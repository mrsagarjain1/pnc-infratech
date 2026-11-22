"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SHOWCASE_PROJECTS, type ShowcaseProject } from "@/data/site-data";
import { usePrefersReducedMotion } from "@/lib/device";
import { soundEngine } from "@/lib/audio";
import { LusionPill } from "./LusionPill";
import { RevealLines, ScrambleText } from "./KineticText";

export function ShowcaseGallery() {
  const [spotlight, setSpotlight] = useState<ShowcaseProject | null>(null);
  const reduced = usePrefersReducedMotion();
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  // Lusion scroll-velocity kinetic skew + differential column inertia
  useEffect(() => {
    if (reduced) return;
    let targetVel = 0;
    let currentVel = 0;
    let rafId = 0;

    const onVel = (e: Event) => {
      const ce = e as CustomEvent<number>;
      targetVel = Math.max(-28, Math.min(28, ce.detail ?? 0));
    };

    const tick = () => {
      currentVel += (targetVel - currentVel) * 0.12;
      targetVel *= 0.9;
      const skew = Math.max(-2.2, Math.min(2.2, currentVel * 0.08));
      const lagY = Math.max(-22, Math.min(22, currentVel * 0.65));

      if (leftColRef.current) {
        leftColRef.current.style.transform = `skewY(${skew.toFixed(3)}deg)`;
      }
      if (rightColRef.current) {
        rightColRef.current.style.transform = `translate3d(0, ${lagY.toFixed(2)}px, 0) skewY(${(skew * 1.15).toFixed(3)}deg)`;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pnc-scroll-velocity", onVel);
    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pnc-scroll-velocity", onVel);
      window.cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  const handleCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${x.toFixed(1)}%`);
    e.currentTarget.style.setProperty("--my", `${y.toFixed(1)}%`);
  };

  const leftItems = SHOWCASE_PROJECTS.filter((_, i) => i % 2 === 0);
  const rightItems = SHOWCASE_PROJECTS.filter((_, i) => i % 2 === 1);

  const renderCard = (proj: ShowcaseProject) => (
    <article key={proj.id}>
      <button
        type="button"
        data-cursor="VIEW PROJECT"
        onMouseEnter={() => soundEngine.playHoverTick()}
        onClick={() => {
          soundEngine.playClickConfirm();
          setSpotlight(proj);
        }}
        className="group block w-full text-left focus:outline-none"
      >
        {/* Rounded-15px Borderless Photo Frame with Cursor-Tracked Liquid Cobalt Specular Shimmer */}
        <div
          onPointerMove={handleCardPointerMove}
          className="relative aspect-[16/10.4] w-full overflow-hidden rounded-[15px] bg-obsidian-soft"
        >
          <Image
            src={proj.image}
            alt={proj.title}
            fill
            sizes="(max-width: 768px) 100vw, 48vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
          />
          {/* Dynamic liquid radial specular reflection */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(280px circle at var(--mx, 50%) var(--my, 50%), rgba(26, 47, 251, 0.42), rgba(0, 217, 255, 0.14) 45%, transparent 72%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/38 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-25"
          />
          <span className="absolute top-4 right-4 rounded-full bg-white/95 px-3.5 py-1 font-mono text-[10px] font-medium tracking-[0.08em] text-obsidian shadow-sm uppercase">
            {proj.highlightMetric}
          </span>
        </div>

        {/* Line 1: Scramble-Decoded Uppercase Metadata */}
        <p className="mt-4 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
          <ScrambleText
            text={`${proj.code} • ${proj.state} • ${proj.status}`}
            replayOnHover
          />
        </p>

        {/* Line 2: Lusion Hover-Sliding Arrow + Architectural Title */}
        <h3 className="lusion-card-title-wrap mt-1.5 font-display text-[clamp(1.35rem,2.35vw,2.2rem)] leading-[1.12] font-normal tracking-[-0.02em] text-obsidian">
          <span className="lusion-card-arrow" aria-hidden="true">
            →
          </span>
          <span className="line-clamp-2">{proj.title}</span>
        </h3>
      </button>
    </article>
  );

  return (
    <section className="relative bg-alabaster py-24 text-obsidian sm:py-32">
      <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <RevealLines
              lines={["Featured Work"]}
              className="lusion-display text-[clamp(3rem,7.8vw,7.5rem)] text-obsidian"
            />
          </div>
          <div className="lg:col-span-4 lg:pb-2">
            <p className="font-mono text-[11px] leading-[1.6] tracking-[0.09em] text-obsidian/75 uppercase">
              <ScrambleText text="A SELECTION OF NATIONAL EXPRESSWAYS, RIVER BRIDGES, AIRFIELDS AND WATER GRIDS ENGINEERED FOR PUBLIC AUTHORITIES ACROSS 16 STATES." />
            </p>
          </div>
        </div>

        {/* True 2-Column Kinetic Velocity-Skewed Staggered Grid */}
        <div className="mt-14 grid gap-x-[max(2.5vw,24px)] gap-y-14 md:grid-cols-2 lg:mt-20">
          <div
            ref={leftColRef}
            className="space-y-14 will-change-transform"
          >
            {leftItems.map(renderCard)}
          </div>
          <div
            ref={rightColRef}
            className="space-y-14 will-change-transform md:mt-20"
          >
            {rightItems.map(renderCard)}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center gap-4 text-center">
          <LusionPill label="SEE ALL 137 PROJECTS" href="/projects" />
          <p className="font-mono text-[11px] tracking-[0.1em] text-muted uppercase">
            VERBATIM MANDATES ACROSS EPC · BOT · HAM · AIRPORTS · WATER · RAIL
          </p>
        </div>
      </div>

      {/* Spotlight Modal */}
      {spotlight && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="spotlight-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSpotlight(null)}
        >
          <div
            className="thin-scroll max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[20px] bg-white p-6 text-obsidian shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] font-medium tracking-[0.1em] text-cobalt uppercase">
                {spotlight.code} · {spotlight.coordinates}
              </span>
              <button
                type="button"
                onClick={() => setSpotlight(null)}
                className="rounded-full bg-alabaster px-4 py-1.5 font-mono text-[11px] font-medium text-obsidian transition hover:bg-obsidian hover:text-white"
              >
                CLOSE ✕
              </button>
            </div>

            <div className="relative mt-5 aspect-[16/9] w-full overflow-hidden rounded-[15px] bg-obsidian-soft">
              <Image
                src={spotlight.image}
                alt={spotlight.title}
                fill
                sizes="760px"
                className="object-cover"
              />
            </div>

            <h3
              id="spotlight-title"
              className="mt-6 font-display text-2xl leading-[1.15] font-normal tracking-tight text-obsidian sm:text-3xl"
            >
              {spotlight.title}
            </h3>
            <p className="mt-2 font-mono text-xs text-muted uppercase">
              {spotlight.corridor}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-obsidian/80">
              {spotlight.summary}
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[12px] bg-alabaster p-4">
                <dt className="font-mono text-[10px] text-muted uppercase">
                  Highlight
                </dt>
                <dd className="mt-1 font-display text-xl font-medium text-cobalt">
                  {spotlight.highlightMetric}
                </dd>
              </div>
              <div className="rounded-[12px] bg-alabaster p-4">
                <dt className="font-mono text-[10px] text-muted uppercase">
                  Authority
                </dt>
                <dd className="mt-1 text-xs font-medium text-obsidian">
                  {spotlight.employer}
                </dd>
              </div>
              <div className="rounded-[12px] bg-alabaster p-4">
                <dt className="font-mono text-[10px] text-muted uppercase">
                  Delivery Format
                </dt>
                <dd className="mt-1 text-xs font-medium text-obsidian">
                  {spotlight.delivery}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-5">
              <span className="font-mono text-[11px] text-muted uppercase">
                STATE: {spotlight.state} · STATUS: {spotlight.status}
              </span>
              <Link
                href={`/projects?sector=${spotlight.sector}`}
                onClick={() => setSpotlight(null)}
                className="lusion-pill lusion-pill-dark !h-10 !px-5 !text-[11px]"
              >
                <span className="lusion-pill-dot" aria-hidden="true" />
                <span className="lusion-pill-label">OPEN SECTOR LEDGER</span>
                <span className="lusion-pill-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
