import fs from "node:fs";
import path from "node:path";

const TOPO_PATH =
  "C:/Users/user/.gemini/antigravity/brain/a0fe6c28-8695-4db8-8fe9-bb21ff4ba07e/scratch/india-topo.json";
const OUT_PATH = "C:/Users/user/Documents/ai/pnc/src/data/india-map-geometry.ts";

const topo = JSON.parse(fs.readFileSync(TOPO_PATH, "utf8"));
const { scale, translate } = topo.transform;

// Decode all delta-encoded TopoJSON arcs to [lon, lat]
const decodedArcs = topo.arcs.map((arc) => {
  let x = 0;
  let y = 0;
  return arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
  });
});

// Geographic projection: equirectangular with cos(22 deg) aspect correction
// Bounding box of full official India: lon [68.10, 97.39], lat [6.76, 37.08]
const MIN_LON = 68.05;
const MAX_LON = 97.45;
const MIN_LAT = 6.7;
const MAX_LAT = 37.15;
const COS_LAT = Math.cos((22 * Math.PI) / 180);

const RAW_W = (MAX_LON - MIN_LON) * COS_LAT;
const RAW_H = MAX_LAT - MIN_LAT;

// Fit into 1000 x 1080 canvas with comfortable padding
const CANVAS_W = 1000;
const CANVAS_H = 1080;
const PAD_X = 56;
const PAD_Y = 38;
const SCALE_PX = Math.min(
  (CANVAS_W - PAD_X * 2) / RAW_W,
  (CANVAS_H - PAD_Y * 2) / RAW_H,
);
const OFFSET_X = (CANVAS_W - RAW_W * SCALE_PX) / 2;
const OFFSET_Y = (CANVAS_H - RAW_H * SCALE_PX) / 2;

function project([lon, lat]) {
  const px = OFFSET_X + (lon - MIN_LON) * COS_LAT * SCALE_PX;
  const py = OFFSET_Y + (MAX_LAT - lat) * SCALE_PX;
  return [Math.round(px * 10) / 10, Math.round(py * 10) / 10];
}

function getArcPoints(arcIndex) {
  const rev = arcIndex < 0;
  const idx = rev ? ~arcIndex : arcIndex;
  const pts = decodedArcs[idx];
  const projected = pts.map(project);
  return rev ? projected.reverse() : projected;
}

function ringFromArcIndices(arcIndices) {
  const ring = [];
  for (const ai of arcIndices) {
    const pts = getArcPoints(ai);
    for (let i = 0; i < pts.length; i++) {
      if (ring.length > 0 && i === 0) continue;
      ring.push(pts[i]);
    }
  }
  return ring;
}

// Douglas-Peucker simplification
function perpDist(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) {
    return Math.hypot(p[0] - a[0], p[1] - a[1]);
  }
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  const clamped = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + clamped * dx), p[1] - (a[1] + clamped * dy));
}

function simplifyDP(pts, eps) {
  if (pts.length <= 3) return pts;
  let maxD = 0;
  let maxI = 0;
  const end = pts.length - 1;
  for (let i = 1; i < end; i++) {
    const d = perpDist(pts[i], pts[0], pts[end]);
    if (d > maxD) {
      maxD = d;
      maxI = i;
    }
  }
  if (maxD > eps) {
    const left = simplifyDP(pts.slice(0, maxI + 1), eps);
    const right = simplifyDP(pts.slice(maxI), eps);
    return left.slice(0, -1).concat(right);
  }
  return [pts[0], pts[end]];
}

function simplifyClosedRing(ring, eps) {
  if (ring.length < 4) return ring;
  // Ensure closed
  const clean = ring.slice();
  const first = clean[0];
  const last = clean[clean.length - 1];
  if (first[0] === last[0] && first[1] === last[1]) clean.pop();
  if (clean.length < 3) return clean;
  // Split at furthest point from index 0 so DP preserves closed loop cleanly
  let farIdx = 1;
  let farD = -1;
  for (let i = 1; i < clean.length; i++) {
    const d = (clean[i][0] - first[0]) ** 2 + (clean[i][1] - first[1]) ** 2;
    if (d > farD) {
      farD = d;
      farIdx = i;
    }
  }
  const part1 = simplifyDP(clean.slice(0, farIdx + 1), eps);
  const part2 = simplifyDP(clean.slice(farIdx).concat([first]), eps);
  const merged = part1.slice(0, -1).concat(part2.slice(0, -1));
  // Deduplicate adjacent identical vertices
  const out = [];
  for (const pt of merged) {
    const prev = out[out.length - 1];
    if (!prev || Math.hypot(pt[0] - prev[0], pt[1] - prev[1]) > 0.4) {
      out.push([Math.round(pt[0] * 10) / 10, Math.round(pt[1] * 10) / 10]);
    }
  }
  return out;
}

function polygonArea(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) / 2;
}

function polygonCentroid(ring) {
  let sx = 0;
  let sy = 0;
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    const cross = x1 * y2 - x2 * y1;
    a += cross;
    sx += (x1 + x2) * cross;
    sy += (y1 + y2) * cross;
  }
  if (Math.abs(a) < 1e-4) {
    const avgX = ring.reduce((acc, p) => acc + p[0], 0) / ring.length;
    const avgY = ring.reduce((acc, p) => acc + p[1], 0) / ring.length;
    return [Math.round(avgX), Math.round(avgY)];
  }
  return [Math.round(sx / (3 * a)), Math.round(sy / (3 * a))];
}

// Normalize state names from TopoJSON to clean canonical names
const STATE_NAME_ALIASES = {
  "Andaman & Nicobar": "Andaman & Nicobar Islands",
  "Andaman and Nicobar Islands": "Andaman & Nicobar Islands",
  "Arunachal Pradesh": "Arunachal Pradesh",
  "Dadra and Nagar Haveli and Daman and Diu": "Dadra & Nagar Haveli and Daman & Diu",
  "NCT of Delhi": "Delhi",
  "Jammu and Kashmir": "Jammu & Kashmir",
};

const stateGeoms = topo.objects.states.geometries;
const statesOut = [];

// Track how many times each undirected arc is referenced across all states
// Boundary arcs of India appear exactly ONCE in states; internal state borders appear TWICE!
const arcUsage = new Map();

for (const geom of stateGeoms) {
  const rawName = geom.properties.st_nm;
  const name = STATE_NAME_ALIASES[rawName] ?? rawName;
  const polygons =
    geom.type === "Polygon" ? [geom.arcs] : geom.arcs;

  const stateRings = [];
  for (const poly of polygons) {
    // outer ring only (index 0); count arc usages for outer ring
    const outerArcIndices = poly[0];
    for (const ai of outerArcIndices) {
      const key = ai < 0 ? ~ai : ai;
      arcUsage.set(key, (arcUsage.get(key) ?? 0) + 1);
    }
    const rawRing = ringFromArcIndices(outerArcIndices);
    const area = polygonArea(rawRing);
    // Keep mainland polygons and meaningful islands (Andaman, Nicobar, Lakshadweep, Diu, etc.)
    const isIslandUT =
      name.includes("Andaman") || name.includes("Lakshadweep");
    const minArea = isIslandUT ? 12 : 45;
    if (area < minArea) continue;
    const eps = isIslandUT ? 1.1 : 2.1;
    const simp = simplifyClosedRing(rawRing, eps);
    if (simp.length >= 3) {
      stateRings.push({ ring: simp, area });
    }
  }

  // Sort rings largest first
  stateRings.sort((a, b) => b.area - a.area);
  // Cap tiny scattered islets on island UTs to the largest 8 crisp islands
  const kept =
    name.includes("Andaman") || name.includes("Lakshadweep")
      ? stateRings.slice(0, 8)
      : stateRings.slice(0, 4);

  const rings = kept.map((k) => k.ring);
  const centroid = rings.length > 0 ? polygonCentroid(rings[0]) : [500, 500];

  statesOut.push({
    name,
    rings,
    centroid,
  });
}

// Stitch outer boundary arcs (arcUsage === 1) into closed loops for the seamless 3D extruded relief!
// Keep directed edges preserving original polygon winding
const boundaryDirectedArcs = [];
for (const geom of stateGeoms) {
  const polygons = geom.type === "Polygon" ? [geom.arcs] : geom.arcs;
  for (const poly of polygons) {
    const outerArcIndices = poly[0];
    for (const ai of outerArcIndices) {
      const key = ai < 0 ? ~ai : ai;
      if (arcUsage.get(key) === 1) {
        const pts = getArcPoints(ai);
        boundaryDirectedArcs.push(pts);
      }
    }
  }
}

function ptKey(p) {
  return `${Math.round(p[0] * 10)},${Math.round(p[1] * 10)}`;
}

// Build adjacency from start point to directed arc
const startMap = new Map();
boundaryDirectedArcs.forEach((pts, idx) => {
  const k = ptKey(pts[0]);
  if (!startMap.has(k)) startMap.set(k, []);
  startMap.get(k).push(idx);
});

const usedArc = new Set();
const stitchedLoops = [];

for (let i = 0; i < boundaryDirectedArcs.length; i++) {
  if (usedArc.has(i)) continue;
  usedArc.add(i);
  const loop = boundaryDirectedArcs[i].slice();
  const startK = ptKey(loop[0]);

  let guard = 0;
  while (ptKey(loop[loop.length - 1]) !== startK && guard < 2000) {
    guard++;
    const curK = ptKey(loop[loop.length - 1]);
    const candidates = startMap.get(curK) ?? [];
    const nextIdx = candidates.find((c) => !usedArc.has(c));
    if (nextIdx === undefined) break;
    usedArc.add(nextIdx);
    const nextPts = boundaryDirectedArcs[nextIdx];
    for (let j = 1; j < nextPts.length; j++) {
      loop.push(nextPts[j]);
    }
  }

  if (loop.length >= 4) {
    const area = polygonArea(loop);
    if (area >= 18) {
      stitchedLoops.push({ loop, area });
    }
  }
}

stitchedLoops.sort((a, b) => b.area - a.area);
// Keep Mainland India (index 0) + largest islands (Andaman, Nicobar, Lakshadweep, Rameswaram, etc.)
const outlineRings = stitchedLoops
  .slice(0, 12)
  .map(({ loop, area }) =>
    simplifyClosedRing(loop, area > 50000 ? 1.8 : 1.0),
  )
  .filter((r) => r.length >= 3);

// Also extract internal state boundary polylines (arcUsage >= 2) cleanly simplified once
// so we draw shared state borders with zero doubled lines!
const internalBorders = [];
for (const [arcIdx, count] of arcUsage.entries()) {
  if (count >= 2) {
    const pts = decodedArcs[arcIdx].map(project);
    const simp = simplifyDP(pts, 2.0).map(([x, y]) => [
      Math.round(x * 10) / 10,
      Math.round(y * 10) / 10,
    ]);
    if (simp.length >= 2) {
      internalBorders.push(simp);
    }
  }
}

// Compute exact projected coordinates for Agra HQ & PNC's 16 active states
const AGRA_HQ_GEO = [78.0081, 27.1767];
const AGRA_HQ = project(AGRA_HQ_GEO);

// Geographic city/capital anchors for PNC's 16 execution states (ensures pinpoint accuracy on full map!)
const STATE_ANCHORS_GEO = {
  "Uttar Pradesh": [80.95, 26.85], // Lucknow / Central UP
  "Madhya Pradesh": [77.41, 23.26], // Bhopal
  Maharashtra: [75.71, 19.75], // Central Maharashtra / Samruddhi
  Bihar: [85.31, 25.61], // Patna
  Karnataka: [75.71, 15.32], // Hubli-Dharwad / Central KA
  Rajasthan: [74.22, 26.91], // Central Rajasthan
  Gujarat: [71.8, 22.45], // Central Gujarat / Saurashtra-Vadodara
  Haryana: [76.45, 29.05], // Central Haryana
  Uttarakhand: [79.02, 30.18], // Garhwal-Kumaon
  Chhattisgarh: [82.0, 21.45], // Raipur-Korba
  "West Bengal": [87.85, 22.98], // Kolkata-Burdwan
  Assam: [92.93, 26.2], // Central Assam / Jorhat corridor
  Delhi: [77.21, 28.61], // New Delhi
  Punjab: [75.34, 31.15], // Ludhiana / Central Punjab
  "Andhra Pradesh": [79.74, 15.91], // Central Andhra / Kurnool-Amaravati
  "Tamil Nadu": [78.65, 11.12], // Central Tamil Nadu / Madurai-Trichy
};

const projectedAnchors = Object.fromEntries(
  Object.entries(STATE_ANCHORS_GEO).map(([k, ll]) => [k, project(ll)]),
);

const tsContent = `/**
 * Official Full Map of India Geometry (Survey-of-India aligned full territory,
 * including complete Jammu & Kashmir, Ladakh, Gujarat peninsulas, Arunachal Pradesh,
 * Northeast Seven Sisters, Kanyakumari, Andaman & Nicobar Islands, and Lakshadweep).
 *
 * Generated from udit-001/india-maps-data TopoJSON via scripts/generate-india-map.mjs.
 * Shared single source of truth for both 3D Architectural Relief (IndiaMap3DCanvas)
 * and 2D Vector Blueprint (IndiaPresenceMap).
 */

export type Point2D = readonly [number, number];

export interface IndiaStateShape {
  readonly name: string;
  readonly rings: readonly (readonly Point2D[])[];
  readonly centroid: Point2D;
}

export const INDIA_MAP_VIEWBOX = {
  width: ${CANVAS_W},
  height: ${CANVAS_H},
} as const;

export const AGRA_HQ_POINT: Point2D = ${JSON.stringify(AGRA_HQ)};

export const STATE_PROJECTED_COORDS: Record<string, Point2D> = ${JSON.stringify(projectedAnchors, null, 2)};

/** Seamless national outer landmass rings (Mainland India + Andaman & Nicobar + Lakshadweep) */
export const INDIA_OUTLINE_RINGS: readonly (readonly Point2D[])[] = ${JSON.stringify(outlineRings)};

/** Single-pass internal state boundary polylines (deduplicated shared borders) */
export const INDIA_INTERNAL_BORDERS: readonly (readonly Point2D[])[] = ${JSON.stringify(internalBorders)};

/** All 36 Indian States & Union Territories polygons for interactive highlighting & 2D/3D overlays */
export const INDIA_STATES_GEOMETRY: readonly IndiaStateShape[] = ${JSON.stringify(statesOut)};

export function ringsToSvgPath(rings: readonly (readonly Point2D[])[]): string {
  return rings
    .filter((r) => r.length >= 3)
    .map((r) => "M " + r.map(([x, y]) => \`\${x},\${y}\`).join(" L ") + " Z")
    .join(" ");
}

export function polylinesToSvgPath(lines: readonly (readonly Point2D[])[]): string {
  return lines
    .filter((l) => l.length >= 2)
    .map((l) => "M " + l.map(([x, y]) => \`\${x},\${y}\`).join(" L "))
    .join(" ");
}
`;

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, tsContent, "utf8");

console.log("Generated:", OUT_PATH);
console.log("File size:", (tsContent.length / 1024).toFixed(1), "KB");
console.log("States count:", statesOut.length);
console.log(
  "Outline rings:",
  outlineRings.length,
  "mainland vertices:",
  outlineRings[0]?.length,
);
console.log("Internal border segments:", internalBorders.length);
console.log("Agra HQ:", AGRA_HQ);
console.log("Projected 16 state anchors:", projectedAnchors);
console.log(
  "All 36 state names:",
  statesOut.map((s) => s.name).join(", "),
);
