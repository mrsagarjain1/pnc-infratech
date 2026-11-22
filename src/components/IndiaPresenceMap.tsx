"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { STATE_PRESENCE, getProjectCountsByState } from "@/data/site-data";
import {
  AGRA_HQ_POINT,
  INDIA_INTERNAL_BORDERS,
  INDIA_OUTLINE_RINGS,
  INDIA_STATES_GEOMETRY,
  polylinesToSvgPath,
  ringsToSvgPath,
} from "@/data/india-map-geometry";
import { projects } from "@/data/projects";
import type { StateName } from "@/data/project-types";
import { useSceneMode } from "@/lib/device";
import { useNearViewport } from "@/lib/useNearViewport";
import { soundEngine } from "@/lib/audio";
import { LusionPill } from "./LusionPill";
import { RevealLines } from "./KineticText";

const IndiaMap3DCanvas = dynamic(
  () => import("./IndiaMap3DCanvas").then((m) => m.IndiaMap3DCanvas),
  { ssr: false },
);

const HQ_AGRA = { x: AGRA_HQ_POINT[0], y: AGRA_HQ_POINT[1] };
const STATE_COUNTS = getProjectCountsByState();
const ACTIVE_STATE_SET = new Set<string>(STATE_PRESENCE.map((n) => n.name));
const FULL_OUTLINE_PATH = ringsToSvgPath(INDIA_OUTLINE_RINGS);
const INTERNAL_BORDERS_PATH = polylinesToSvgPath(INDIA_INTERNAL_BORDERS);

const LAKSHADWEEP_DOTS: readonly [number, number][] = [
  [189, 868],
  [194, 886],
  [200, 908],
  [204, 954],
];

const STATE_SVG_SHAPES = INDIA_STATES_GEOMETRY.filter(
  (s) => s.rings.length > 0,
).map((s) => ({
  name: s.name,
  path: ringsToSvgPath(s.rings),
  isPncActive: ACTIVE_STATE_SET.has(s.name),
}));

export function IndiaPresenceMap() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneMode = useSceneMode();
  const nearViewport = useNearViewport(sectionRef, "420px 0px");

  const [selectedState, setSelectedState] =
    useState<StateName>("Uttar Pradesh");
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");

  const activeNode =
    STATE_PRESENCE.find((n) => n.name === selectedState) ?? STATE_PRESENCE[0];

  const stateProjects = projects.filter((p) =>
    p.states.includes(selectedState),
  );

  const canRender3D =
    viewMode === "3d" &&
    nearViewport &&
    (sceneMode === "full" || sceneMode === "lite");

  const handleSelectState = (s: StateName) => {
    soundEngine.playClickConfirm();
    setSelectedState(s);
  };

  const render2DVectorMap = () => (
    <div className="relative mx-auto mt-3 max-w-[560px]">
      <svg
        viewBox="25 18 950 1042"
        className="h-auto w-full select-none"
        role="img"
        aria-label="Full interactive Map of India showing all states and union territories with PNC Infratech's 16 active execution states"
      >
        <defs>
          <linearGradient
            id="lusionIndiaFill"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#f5f6fc" />
            <stop offset="100%" stopColor="#e7eaf5" />
          </linearGradient>
        </defs>

        {/* Architectural Blueprint Grid */}
        {[180, 380, 580, 780].map((v) => (
          <g key={`grid-${v}`} opacity="0.14" stroke="#1a2ffb" strokeWidth="1">
            <line x1={v} y1="24" x2={v} y2="1050" strokeDasharray="4 8" />
            <line x1="35" y1={v + 60} x2="965" y2={v + 60} strokeDasharray="4 8" />
          </g>
        ))}

        {/* Full India Base Landmass (Mainland + Andaman & Nicobar Islands) */}
        <path
          d={FULL_OUTLINE_PATH}
          fill="url(#lusionIndiaFill)"
          stroke="none"
        />

        {/* Individual State Polygons (All 36 States & UTs — Interactive Highlight for PNC's 16 States) */}
        {STATE_SVG_SHAPES.map((st) => {
          const isSelected = st.name === selectedState;
          if (!st.isPncActive) {
            return (
              <path
                key={st.name}
                d={st.path}
                fill="transparent"
                stroke="none"
              />
            );
          }
          return (
            <path
              key={st.name}
              d={st.path}
              fill={isSelected ? "#1a2ffb" : "#1a2ffb"}
              fillOpacity={isSelected ? 0.24 : 0.08}
              stroke={isSelected ? "#1a2ffb" : "none"}
              strokeWidth={isSelected ? 2 : 0}
              onClick={() => handleSelectState(st.name as StateName)}
              className="cursor-pointer transition-all duration-200 hover:fill-opacity-20"
            />
          );
        })}

        {/* Crisp Internal State Borders (Single-Pass Deduplicated) */}
        <path
          d={INTERNAL_BORDERS_PATH}
          fill="none"
          stroke="#6b78aa"
          strokeOpacity="0.45"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />

        {/* Full Official Outer Coastline & International Boundary */}
        <path
          d={FULL_OUTLINE_PATH}
          fill="none"
          stroke="#1a2ffb"
          strokeOpacity="0.55"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />

        {/* Lakshadweep Coral Islands */}
        {LAKSHADWEEP_DOTS.map(([lx, ly], idx) => (
          <circle
            key={`lk-${idx}`}
            cx={lx}
            cy={ly}
            r={3.5}
            fill="#e7eaf5"
            stroke="#1a2ffb"
            strokeOpacity="0.55"
            strokeWidth="1.4"
          />
        ))}

        {/* Curved Arterial Corridor Arcs from Agra Corporate HQ */}
        {STATE_PRESENCE.map((node) => {
          const active = node.name === selectedState;
          const midX = (HQ_AGRA.x + node.x) / 2;
          const midY = (HQ_AGRA.y + node.y) / 2 - 42;
          return (
            <path
              key={`arc-${node.code}`}
              d={`M ${HQ_AGRA.x},${HQ_AGRA.y} Q ${midX},${midY} ${node.x},${node.y}`}
              fill="none"
              stroke={active ? "#1a2ffb" : "#2b2e3a"}
              strokeWidth={active ? 3.2 : 1.2}
              strokeOpacity={active ? 1 : 0.24}
              strokeDasharray={active ? "none" : "5 6"}
            />
          );
        })}

        {/* Agra Corporate HQ Marker */}
        <circle
          cx={HQ_AGRA.x}
          cy={HQ_AGRA.y}
          r={5.5}
          fill="#c1ff00"
          stroke="#000000"
          strokeWidth="2"
        />

        {/* 16 Active State Nodes */}
        {STATE_PRESENCE.map((node) => {
          const count = STATE_COUNTS[node.name] ?? 0;
          const active = node.name === selectedState;
          const radius = active
            ? 11.5
            : Math.max(6, Math.min(9.5, 5.5 + Math.sqrt(count) * 0.7));
          return (
            <g
              key={node.code}
              onClick={() => handleSelectState(node.name)}
              onMouseEnter={() => setSelectedState(node.name)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${node.name}: ${count} projects`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelectState(node.name);
                }
              }}
            >
              {active && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={21}
                  fill="none"
                  stroke="#1a2ffb"
                  strokeWidth="2.4"
                  className="node-pulse"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={radius}
                fill={active ? "#1a2ffb" : "#000000"}
                stroke="#ffffff"
                strokeWidth={active ? 2.8 : 1.5}
              />
              <text
                x={node.x + radius + 6}
                y={node.y + 4}
                fill={active ? "#1a2ffb" : "#11131a"}
                fontSize={active ? "16" : "12"}
                fontFamily="var(--font-ibm-plex-mono), monospace"
                fontWeight={active ? "600" : "500"}
              >
                {node.code} ({count})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="presence-map"
      className="relative bg-alabaster py-24 text-obsidian sm:py-32"
    >
      <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] tracking-[0.14em] text-cobalt uppercase">
              PAN-INDIA EXECUTION GRID · 16 STATES
            </p>
            <RevealLines
              lines={["National Footprint."]}
              className="lusion-display mt-3 text-[clamp(2.75rem,6.5vw,6.25rem)] text-obsidian"
            />
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <LusionPill
              label={`OPEN ${activeNode.code} LEDGER (${STATE_COUNTS[selectedState]})`}
              href={`/projects?state=${encodeURIComponent(selectedState)}`}
            />
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch">
          {/* Left: Interactive Full India 3D Architectural Relief (with 2D Blueprint Toggle) */}
          <div className="relative overflow-hidden rounded-[20px] bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-7 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.12em] text-muted uppercase">
              <span>
                {canRender3D
                  ? "FULL INDIA 3D RELIEF · DRAG TO ORBIT · CLICK STATES OR TOWERS"
                  : "FULL INDIA PROJECTION // ALL STATES & ARTERIAL CORRIDORS"}
              </span>

              <div className="flex items-center gap-1 rounded-full bg-alabaster p-1">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClickConfirm();
                    setViewMode("3d");
                  }}
                  className={`rounded-full px-3 py-1 font-mono text-[10px] transition ${
                    viewMode === "3d"
                      ? "bg-cobalt font-medium text-white"
                      : "text-obsidian/70 hover:text-obsidian"
                  }`}
                >
                  3D RELIEF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClickConfirm();
                    setViewMode("2d");
                  }}
                  className={`rounded-full px-3 py-1 font-mono text-[10px] transition ${
                    viewMode === "2d"
                      ? "bg-obsidian font-medium text-white"
                      : "text-obsidian/70 hover:text-obsidian"
                  }`}
                >
                  2D BLUEPRINT
                </button>
              </div>
            </div>

            {canRender3D ? (
              <div
                data-cursor="ORBIT 3D MAP"
                className="relative mt-4 h-[500px] w-full overflow-hidden rounded-[15px] bg-alabaster sm:h-[580px]"
              >
                <IndiaMap3DCanvas
                  selectedState={selectedState}
                  onSelectState={setSelectedState}
                  fallback={render2DVectorMap()}
                />
              </div>
            ) : (
              render2DVectorMap()
            )}

            {/* Capsule State Selector */}
            <div className="mt-5 flex flex-wrap gap-1.5">
              {STATE_PRESENCE.map((node) => {
                const active = node.name === selectedState;
                return (
                  <button
                    key={node.name}
                    type="button"
                    onClick={() => handleSelectState(node.name)}
                    onMouseEnter={() => soundEngine.playHoverTick()}
                    className={`rounded-full px-3 py-1 font-mono text-[10px] transition ${
                      active
                        ? "bg-cobalt font-medium text-white shadow-sm"
                        : "bg-alabaster text-obsidian/75 hover:bg-alabaster-deep hover:text-obsidian"
                    }`}
                  >
                    {node.name} · {STATE_COUNTS[node.name]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: State Dossier Card */}
          <div className="flex flex-col justify-between rounded-[20px] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-cobalt uppercase">
                  REGION // {activeNode.region} INDIA
                </span>
                <span className="rounded-full bg-alabaster px-3 py-0.5 text-obsidian">
                  {activeNode.code}
                </span>
              </div>

              <h3 className="lusion-display mt-3 text-4xl text-obsidian sm:text-5xl">
                {activeNode.name}
              </h3>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-[14px] bg-alabaster p-3.5">
                  <p className="font-mono text-[10px] text-muted uppercase">
                    MANDATES
                  </p>
                  <p className="mt-1 font-display text-3xl font-normal text-obsidian">
                    {stateProjects.length}
                  </p>
                </div>
                <div className="rounded-[14px] bg-alabaster p-3.5">
                  <p className="font-mono text-[10px] text-muted uppercase">
                    ONGOING
                  </p>
                  <p className="mt-1 font-display text-3xl font-normal text-cobalt">
                    {stateProjects.filter((p) => p.status === "ongoing").length}
                  </p>
                </div>
                <div className="rounded-[14px] bg-alabaster p-3.5">
                  <p className="font-mono text-[10px] text-muted uppercase">
                    COMPLETED
                  </p>
                  <p className="mt-1 font-display text-3xl font-normal text-obsidian">
                    {
                      stateProjects.filter(
                        (p) =>
                          p.status === "completed" || p.status === "operating",
                      ).length
                    }
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-[14px] bg-cobalt p-4 text-white">
                <p className="font-mono text-[10px] tracking-[0.1em] text-lime uppercase">
                  KEY CORRIDORS &amp; ASSETS
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-white/90">
                  {activeNode.flagship}
                </p>
              </div>

              <div className="mt-6">
                <p className="font-mono text-[10px] tracking-[0.1em] text-muted uppercase">
                  CATALOGUED MANDATES IN {activeNode.name}
                </p>
                <div className="thin-scroll mt-3 max-h-64 space-y-2.5 overflow-y-auto pr-1">
                  {stateProjects.slice(0, 8).map((proj) => (
                    <div
                      key={proj.id}
                      className="rounded-[12px] bg-alabaster p-3.5 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                        <span className="font-medium text-cobalt uppercase">
                          {proj.sector}
                          {proj.delivery ? ` · ${proj.delivery}` : ""}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-0.5 text-obsidian uppercase">
                          {proj.status ?? "Active"}
                        </span>
                      </div>
                      <p className="mt-1.5 line-clamp-2 font-medium text-obsidian">
                        {proj.name}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        {proj.employer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-black/8 pt-5">
              <LusionPill
                label={`INSPECT ALL ${stateProjects.length} IN ${activeNode.name}`}
                href={`/projects?state=${encodeURIComponent(selectedState)}`}
                variant="dark"
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
