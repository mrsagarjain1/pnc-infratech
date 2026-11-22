"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { STATE_PRESENCE, getProjectCountsByState } from "@/data/site-data";
import {
  AGRA_HQ_POINT,
  INDIA_INTERNAL_BORDERS,
  INDIA_OUTLINE_RINGS,
  INDIA_STATES_GEOMETRY,
  type Point2D,
} from "@/data/india-map-geometry";
import type { StateName } from "@/data/project-types";
import { soundEngine } from "@/lib/audio";

const STATE_COUNTS = getProjectCountsByState();
const ACTIVE_STATE_NAMES = new Set<string>(STATE_PRESENCE.map((s) => s.name));

// Projected coral island cluster positions for Lakshadweep (Arabian Sea)
const LAKSHADWEEP_ISLANDS: readonly Point2D[] = [
  [189, 868],
  [194, 886],
  [200, 908],
  [204, 954],
];

const RELIEF_TOP_Y = 0.42;

function toWorld(x: number, y: number): [number, number] {
  return [(x - 495) * 0.0135, (y - 535) * 0.0135];
}

const HQ_WORLD = toWorld(AGRA_HQ_POINT[0], AGRA_HQ_POINT[1]);

function buildShapeFromRing(ring: readonly Point2D[]): THREE.Shape | null {
  if (ring.length < 3) return null;
  const shape = new THREE.Shape();
  ring.forEach(([x, y], idx) => {
    const [wx, wz] = toWorld(x, y);
    if (idx === 0) shape.moveTo(wx, -wz);
    else shape.lineTo(wx, -wz);
  });
  shape.closePath();
  return shape;
}

/**
 * Pure WebGL CanvasTexture pill badge (avoids DOM portal mismatches with Next.js 16 <Activity>).
 */
function createBadgeTexture(
  text: string,
  selected: boolean,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 84;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const x = 14;
    const y = 12;
    const w = 228;
    const h = 60;
    const r = 30;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();

    ctx.fillStyle = selected ? "#1a2ffb" : "#ffffff";
    ctx.fill();
    ctx.lineWidth = selected ? 5 : 3;
    ctx.strokeStyle = selected ? "#c1ff00" : "rgba(0,0,0,0.14)";
    ctx.stroke();

    ctx.font = "600 26px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = selected ? "#ffffff" : "#000000";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function StateBadgeSprite({
  code,
  count,
  selected,
  y,
}: {
  code: string;
  count: number;
  selected: boolean;
  y: number;
}) {
  const texture = useMemo(
    () => createBadgeTexture(`${code} · ${count}`, selected),
    [code, count, selected],
  );

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    <sprite
      position={[0, y, 0]}
      scale={selected ? [1.7, 0.56, 1] : [1.34, 0.44, 1]}
    >
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  );
}

function ReliefMapScene({
  selectedState,
  onSelectState,
}: {
  selectedState: StateName;
  onSelectState: (s: StateName) => void;
}) {
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Extruded Full India Relief (Mainland + Andaman & Nicobar Islands)
  const landmassGeometries = useMemo(() => {
    return INDIA_OUTLINE_RINGS.map((ring) => {
      const shape = buildShapeFromRing(ring);
      if (!shape) return null;
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.36,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.045,
        bevelSegments: 2,
      });
      geo.rotateX(-Math.PI / 2);
      geo.computeVertexNormals();
      return geo;
    }).filter((g): g is THREE.ExtrudeGeometry => g !== null);
  }, []);

  // Single-pass GPU LineSegments for all internal state boundaries etched onto relief top
  const internalBorderGeo = useMemo(() => {
    const positions: number[] = [];
    const y = RELIEF_TOP_Y + 0.012;
    for (const poly of INDIA_INTERNAL_BORDERS) {
      for (let i = 0; i < poly.length - 1; i++) {
        const [x1, z1] = toWorld(poly[i][0], poly[i][1]);
        const [x2, z2] = toWorld(poly[i + 1][0], poly[i + 1][1]);
        positions.push(x1, y, z1, x2, y, z2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return geo;
  }, []);

  // Crisp outer national silhouette edge line on top of relief
  const outerOutlineGeo = useMemo(() => {
    const positions: number[] = [];
    const y = RELIEF_TOP_Y + 0.015;
    for (const ring of INDIA_OUTLINE_RINGS) {
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i];
        const b = ring[(i + 1) % ring.length];
        const [x1, z1] = toWorld(a[0], a[1]);
        const [x2, z2] = toWorld(b[0], b[1]);
        positions.push(x1, y, z1, x2, y, z2);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3),
    );
    return geo;
  }, []);

  // Per-state interactive surface highlight plates for PNC's 16 active states
  const activeStatePlates = useMemo(() => {
    return INDIA_STATES_GEOMETRY.filter((s) =>
      ACTIVE_STATE_NAMES.has(s.name),
    ).map((state) => {
      const shapes = state.rings
        .map(buildShapeFromRing)
        .filter((sh): sh is THREE.Shape => sh !== null);
      const geo = new THREE.ShapeGeometry(shapes);
      geo.rotateX(-Math.PI / 2);
      return {
        name: state.name as StateName,
        geo,
      };
    });
  }, []);

  // 16 State Towers & Elevated Arterial Corridor Arcs originating from Agra HQ
  const nodesAndArcs = useMemo(() => {
    const start = new THREE.Vector3(HQ_WORLD[0], RELIEF_TOP_Y + 0.08, HQ_WORLD[1]);

    return STATE_PRESENCE.map((node) => {
      const [wx, wz] = toWorld(node.x, node.y);
      const count = STATE_COUNTS[node.name] ?? 1;
      const towerH = Math.min(2.35, 0.34 + Math.sqrt(count) * 0.22);
      const end = new THREE.Vector3(wx, RELIEF_TOP_Y + 0.08, wz);
      const dist = start.distanceTo(end);
      const mid = start
        .clone()
        .add(end)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 0.65 + dist * 0.28, 0));

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.028, 8, false);
      const activeTubeGeo = new THREE.TubeGeometry(curve, 36, 0.055, 10, false);

      return {
        node,
        wx,
        wz,
        count,
        towerH,
        curve,
        tubeGeo,
        activeTubeGeo,
      };
    });
  }, []);

  useEffect(() => {
    return () => {
      landmassGeometries.forEach((g) => g.dispose());
      internalBorderGeo.dispose();
      outerOutlineGeo.dispose();
      activeStatePlates.forEach((p) => p.geo.dispose());
      nodesAndArcs.forEach((n) => {
        n.tubeGeo.dispose();
        n.activeTubeGeo.dispose();
      });
    };
  }, [
    landmassGeometries,
    internalBorderGeo,
    outerOutlineGeo,
    activeStatePlates,
    nodesAndArcs,
  ]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < nodesAndArcs.length; i++) {
      const mesh = pulseRefs.current[i];
      if (!mesh) continue;
      const u = (t * 0.28 + i * 0.13) % 1;
      const pt = nodesAndArcs[i].curve.getPointAt(u);
      mesh.position.copy(pt);
    }
  });

  return (
    <>
      <color attach="background" args={["#f0f1fa"]} />
      <ambientLight intensity={1.05} color="#ffffff" />
      <directionalLight position={[8, 18, 10]} intensity={1.85} color="#ffffff" />
      <directionalLight position={[-10, 9, -8]} intensity={0.95} color="#1a2ffb" />

      <gridHelper
        args={[28, 28, "#1a2ffb", "#d6daf0"]}
        position={[0, -0.03, 0]}
      />

      {/* Full Extruded India Landmass (Mainland + Andaman & Nicobar Islands) */}
      <group>
        {landmassGeometries.map((geo, idx) => (
          <mesh key={`india-ring-${idx}`} geometry={geo}>
            <meshPhysicalMaterial
              color="#ffffff"
              roughness={0.34}
              metalness={0.06}
              clearcoat={0.55}
              clearcoatRoughness={0.24}
            />
          </mesh>
        ))}

        {/* Lakshadweep Coral Islands Cluster */}
        {LAKSHADWEEP_ISLANDS.map(([lx, ly], idx) => {
          const [wx, wz] = toWorld(lx, ly);
          return (
            <mesh key={`lakshadweep-${idx}`} position={[wx, RELIEF_TOP_Y / 2, wz]}>
              <cylinderGeometry args={[0.075, 0.09, RELIEF_TOP_Y, 10]} />
              <meshPhysicalMaterial
                color="#ffffff"
                roughness={0.35}
                clearcoat={0.5}
              />
            </mesh>
          );
        })}
      </group>

      {/* Engraved Internal Boundaries for All 36 States & Union Territories */}
      <lineSegments geometry={internalBorderGeo}>
        <lineBasicMaterial color="#7d89bd" transparent opacity={0.48} />
      </lineSegments>

      {/* Crisp Electric-Cobalt Outer National Boundary Edge */}
      <lineSegments geometry={outerOutlineGeo}>
        <lineBasicMaterial color="#1a2ffb" transparent opacity={0.35} />
      </lineSegments>

      {/* Interactive Surface Highlight Plates for PNC's 16 Execution States */}
      {activeStatePlates.map((plate) => {
        const isSelected = plate.name === selectedState;
        return (
          <mesh
            key={`plate-${plate.name}`}
            geometry={plate.geo}
            position={[0, isSelected ? RELIEF_TOP_Y + 0.022 : RELIEF_TOP_Y + 0.008, 0]}
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playClickConfirm();
              onSelectState(plate.name);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto";
            }}
          >
            <meshBasicMaterial
              color={isSelected ? "#1a2ffb" : "#1a2ffb"}
              transparent
              opacity={isSelected ? 0.48 : 0.11}
              depthWrite={false}
            />
          </mesh>
        );
      })}

      {/* Agra Corporate HQ Origin Beacon */}
      <mesh position={[HQ_WORLD[0], RELIEF_TOP_Y + 0.1, HQ_WORLD[1]]}>
        <cylinderGeometry args={[0.14, 0.2, 0.16, 16]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#1a2ffb"
          emissiveIntensity={0.7}
        />
      </mesh>

      {/* 16 State Towers, Corridor Arcs & Live Traveling Telemetry Pulses */}
      {nodesAndArcs.map((item, idx) => {
        const isSelected = item.node.name === selectedState;
        return (
          <group key={item.node.code}>
            <mesh geometry={isSelected ? item.activeTubeGeo : item.tubeGeo}>
              <meshStandardMaterial
                color={isSelected ? "#1a2ffb" : "#7e89b8"}
                emissive={isSelected ? "#1a2ffb" : "#000000"}
                emissiveIntensity={isSelected ? 0.9 : 0}
                transparent
                opacity={isSelected ? 1 : 0.38}
              />
            </mesh>

            <mesh
              ref={(el) => {
                pulseRefs.current[idx] = el;
              }}
            >
              <sphereGeometry args={[isSelected ? 0.12 : 0.065, 12, 12]} />
              <meshBasicMaterial color={isSelected ? "#c1ff00" : "#1a2ffb"} />
            </mesh>

            <group
              position={[item.wx, RELIEF_TOP_Y + 0.02, item.wz]}
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playClickConfirm();
                onSelectState(item.node.name);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <mesh position={[0, item.towerH / 2, 0]}>
                <cylinderGeometry
                  args={[
                    isSelected ? 0.13 : 0.08,
                    isSelected ? 0.16 : 0.1,
                    item.towerH,
                    14,
                  ]}
                />
                <meshPhysicalMaterial
                  color={isSelected ? "#1a2ffb" : "#11131a"}
                  emissive={isSelected ? "#1a2ffb" : "#000000"}
                  emissiveIntensity={isSelected ? 0.55 : 0}
                  roughness={0.22}
                  clearcoat={0.8}
                />
              </mesh>

              <mesh position={[0, item.towerH + 0.05, 0]}>
                <sphereGeometry args={[isSelected ? 0.15 : 0.09, 14, 14]} />
                <meshBasicMaterial color={isSelected ? "#c1ff00" : "#1a2ffb"} />
              </mesh>

              {(isSelected || item.count >= 5) && (
                <StateBadgeSprite
                  code={item.node.code}
                  count={item.count}
                  selected={isSelected}
                  y={item.towerH + 0.48}
                />
              )}
            </group>
          </group>
        );
      })}

      <OrbitControls
        makeDefault
        target={[0, 0, 0.25]}
        enablePan={false}
        minDistance={9}
        maxDistance={28}
        minPolarAngle={Math.PI * 0.08}
        maxPolarAngle={Math.PI * 0.44}
        enableDamping
        dampingFactor={0.07}
      />
    </>
  );
}

class Map3DErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function IndiaMap3DCanvas({
  selectedState,
  onSelectState,
  fallback,
}: {
  selectedState: StateName;
  onSelectState: (s: StateName) => void;
  fallback: React.ReactNode;
}) {
  return (
    <Map3DErrorBoundary fallback={fallback}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0.3, 17.6, 13.6], fov: 38 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ReliefMapScene
          selectedState={selectedState}
          onSelectState={onSelectState}
        />
      </Canvas>
    </Map3DErrorBoundary>
  );
}
