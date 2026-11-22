"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ACHIEVEMENTS } from "@/data/site-data";
import { useSceneMode } from "@/lib/device";
import { useNearViewport } from "@/lib/useNearViewport";
import { soundEngine } from "@/lib/audio";
import { LusionPill } from "./LusionPill";
import { RevealLines, ScrambleText } from "./KineticText";

const SpeedTunnelCanvas = dynamic(
  () => import("./SpeedTunnelCanvas").then((m) => m.SpeedTunnelCanvas),
  { ssr: false },
);

const MILESTONE_PHASES = [
  {
    hour: 0,
    phase: "MOBILIZATION & HOT-MIX CALIBRATION",
    detail:
      "Sensor pavers, tandem rollers, automated hot-mix batching plants, and 24/7 QA crews synchronized at Package 29, Panchmahal, Gujarat (NH-148N).",
  },
  {
    hour: 25,
    phase: "FIRST 24+ HOURS — CONTINUOUS THERMAL FLOW",
    detail:
      "Uninterrupted bituminous mix supply chain maintaining compaction temperature and longitudinal smoothness across eight-lane greenfield geometry.",
  },
  {
    hour: 50,
    phase: "MIDPOINT — DUAL NIGHT-SHIFT PRECISION",
    detail:
      "50 consecutive hours of zero-stoppage flexible pavement laying under high-mast floodlighting and real-time thickness laser verification.",
  },
  {
    hour: 75,
    phase: "ENDURANCE THRESHOLD — NATIONAL BENCHMARK",
    detail:
      "Synchronized fleet rotation and aggregate logistics sustaining continuous laydown rates without a single cold joint.",
  },
  {
    hour: 100,
    phase: "100 HOURS COMPLETED — DUAL RECORD CERTIFIED",
    detail:
      "Highest quantity of bituminous mix laid for the longest continuous flexible pavement stretch in 100 hours — certified by Asia Book of Records & India Book of Records.",
  },
];

export function PavingRecordInteractive() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneMode = useSceneMode();
  const nearViewport = useNearViewport(sectionRef, "420px 0px");
  const showTunnel =
    nearViewport && (sceneMode === "full" || sceneMode === "lite");

  const [hours, setHours] = useState(100);
  const [activeCert, setActiveCert] = useState<"asia" | "india">("asia");

  const activePhase =
    [...MILESTONE_PHASES].reverse().find((m) => hours >= m.hour) ??
    MILESTONE_PHASES[0];

  const earlyBonuses = ACHIEVEMENTS.filter(
    (a) => a.category === "Early Completion Bonus",
  );

  const updateHours = (next: number) => {
    setHours(next);
    if (next % 5 === 0) {
      soundEngine.playScrubTick(next / 100);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="paving-record"
      data-theme="dark"
      className="relative overflow-hidden bg-obsidian py-24 text-white sm:py-32"
    >
      {/* Live 3D Infinite Cobalt & Acid-Lime Expressway Speed Tunnel Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
      >
        {showTunnel && <SpeedTunnelCanvas hoursRatio={hours / 100} />}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/50 to-obsidian/92"
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-[max(4vw,20px)]">
        <div
          aria-hidden="true"
          className="mb-12 flex items-center justify-between font-mono text-base text-white/50"
        >
          <span>+</span>
          <span className="text-[11px] tracking-[0.16em] text-lime uppercase">
            <ScrambleText text="ASIA BOOK OF RECORDS · INDIA BOOK OF RECORDS" />
          </span>
          <span>+</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <RevealLines
              lines={["100 Hours.", "Non-Stop."]}
              className="lusion-display text-[clamp(3rem,7.2vw,6.8rem)] text-white"
            />
            <p className="mt-6 max-w-2xl text-base leading-[1.55] text-white/80 sm:text-lg">
              At Package 29 of the Delhi–Vadodara Greenfield Expressway (NH-148N)
              in Panchmahal, Gujarat, PNC Infratech laid the highest quantity of
              bituminous mix for the longest continuous flexible pavement in 100
              unbroken hours.
            </p>

            {/* Interactive Cobalt -> Acid-Lime Telemetry Scrubber (syncs 3D tunnel warp velocity + Web Audio!) */}
            <div
              data-cursor="SCRUB 100H"
              className="mt-10 rounded-[20px] border border-white/15 bg-black/75 p-6 backdrop-blur-md sm:p-8"
            >
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] tracking-[0.12em] text-lime uppercase">
                    SCRUB CONTINUOUS PAVING TIMELINE (DRIVES 3D TUNNEL SPEED)
                  </span>
                  <div className="mt-1 flex items-baseline gap-2.5">
                    <span className="lusion-display text-6xl tabular-nums text-white sm:text-7xl">
                      {hours}
                    </span>
                    <span className="font-mono text-xs tracking-[0.12em] text-white/60 uppercase">
                      / 100 HOURS CONTINUOUS
                    </span>
                  </div>
                </div>
                <div className="rounded-full border border-white/15 bg-black/50 px-4 py-1.5 font-mono text-[11px] text-white/85">
                  NH-148N · PKG 29 · GUJARAT
                </div>
              </div>

              <div className="mt-7">
                <div className="relative h-10 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cobalt via-cyan-arc to-lime transition-all duration-150"
                    style={{ width: `${hours}%` }}
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 opacity-75"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(90deg, #fff 0 18px, transparent 18px 36px)",
                    }}
                  />
                </div>

                <label htmlFor="paving-scrubber" className="sr-only">
                  Scrub continuous paving duration in hours (0 to 100)
                </label>
                <input
                  id="paving-scrubber"
                  type="range"
                  min={0}
                  max={100}
                  value={hours}
                  onChange={(e) => updateHours(Number(e.target.value))}
                  className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-lime"
                />

                <div className="mt-2.5 flex justify-between font-mono text-[11px] text-white/55">
                  {[0, 25, 50, 75, 100].map((mark) => (
                    <button
                      key={mark}
                      type="button"
                      onClick={() => {
                        soundEngine.playScrubTick(mark / 100);
                        setHours(mark);
                      }}
                      className={`rounded px-1.5 py-0.5 transition ${
                        hours >= mark ? "text-lime" : "hover:text-white"
                      }`}
                    >
                      {mark}H
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-[14px] border border-white/10 bg-black/60 p-4">
                <p className="font-mono text-[11px] font-medium tracking-[0.08em] text-lime uppercase">
                  {activePhase.phase}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/80">
                  {activePhase.detail}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[20px] border border-white/15 bg-black/75 p-5 backdrop-blur-md sm:p-6">
              <div className="flex items-center justify-between gap-2 pb-4">
                <span className="font-mono text-[11px] tracking-[0.12em] text-white/60 uppercase">
                  OFFICIAL CERTIFICATES
                </span>
                <div className="flex rounded-full bg-white/10 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClickConfirm();
                      setActiveCert("asia");
                    }}
                    className={`rounded-full px-3.5 py-1 font-mono text-[10px] uppercase transition ${
                      activeCert === "asia"
                        ? "bg-white font-medium text-obsidian"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    Asia Book
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClickConfirm();
                      setActiveCert("india");
                    }}
                    className={`rounded-full px-3.5 py-1 font-mono text-[10px] uppercase transition ${
                      activeCert === "india"
                        ? "bg-white font-medium text-obsidian"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    India Book
                  </button>
                </div>
              </div>

              <div className="relative aspect-[700/470] w-full overflow-hidden rounded-[15px] bg-white">
                <Image
                  src={
                    activeCert === "asia"
                      ? "/images/projects/asia-book-of-records.jpg"
                      : "/images/projects/india-book-of-records.jpg"
                  }
                  alt={
                    activeCert === "asia"
                      ? "Asia Book of Records certificate for PNC Infratech 100-hour paving record"
                      : "India Book of Records certificate for PNC Infratech 100-hour paving record"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-white/70">
                  {activeCert === "asia"
                    ? "Asia Book of Records — 100-Hr Bituminous Paving"
                    : "India Book of Records — Delhi–Vadodara Pkg 29"}
                </p>
                <LusionPill
                  label="ALL 11 AWARDS"
                  href="/about#achievements"
                  className="!h-10 !px-4 !text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Six Early-Completion Bonuses */}
        <div className="mt-20 border-t border-white/12 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] tracking-[0.14em] text-lime uppercase">
                EARLY-COMPLETION TRACK RECORD
              </p>
              <h3 className="lusion-display mt-2 text-3xl text-white sm:text-5xl">
                Six Consecutive Early-Completion Bonuses.
              </h3>
            </div>
            <LusionPill label="VIEW FULL TIMELINE" href="/about#achievements" />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {earlyBonuses.map((bonus) => (
              <div
                key={bonus.id}
                className="group rounded-[16px] border border-white/12 bg-black/70 p-6 backdrop-blur-md transition hover:border-cobalt hover:bg-[#101633]/85"
              >
                <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                  <span className="text-white/55 uppercase">
                    {bonus.authority.split("(")[0].trim()}
                  </span>
                  <span className="rounded-full bg-lime px-2.5 py-0.5 font-medium text-obsidian uppercase">
                    {bonus.metric}
                  </span>
                </div>
                <h4 className="mt-4 font-display text-lg font-normal leading-snug text-white">
                  {bonus.title}
                </h4>
                <p className="mt-2.5 text-xs leading-relaxed text-white/70">
                  {bonus.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
