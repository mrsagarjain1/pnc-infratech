"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HERO_CHAPTERS } from "@/data/site-data";
import { usePrefersReducedMotion } from "@/lib/device";
import { ScrollTrigger } from "@/lib/gsap";
import { soundEngine } from "@/lib/audio";

const CHAPTER_SHORT_LABELS: Record<string, string> = {
  "corridor-origin": "Expressway Genesis",
  "record-velocity": "100H Paving Record",
  "bridge-crossing": "Early-Completion",
  "multi-sector-horizon": "Pan-India Footprint",
};

const TOTAL_CHAINAGE_METERS = 391_962;

function getChapterIndex(progress: number): number {
  const idx = HERO_CHAPTERS.findIndex(
    (ch, i) =>
      progress >= ch.range[0] &&
      (progress < ch.range[1] || i === HERO_CHAPTERS.length - 1),
  );
  return idx >= 0 ? idx : 0;
}

function getChapterFill(progress: number, range: [number, number]): number {
  const span = Math.max(0.0001, range[1] - range[0]);
  return Math.max(0, Math.min(1, (progress - range[0]) / span));
}

export function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevChapterRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedChapterIndex, setReducedChapterIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    const el = containerRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = Math.max(0, Math.min(1, self.progress));
        setScrollProgress(p);

        const nextIdx = getChapterIndex(p);
        if (nextIdx !== prevChapterRef.current) {
          prevChapterRef.current = nextIdx;
          soundEngine.playHoverTick();
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [reducedMotion]);

  const togglePlayback = () => {
    const vid = videoRef.current;
    if (!vid) return;
    soundEngine.playClickConfirm();
    if (vid.paused) {
      void vid.play();
      setPaused(false);
    } else {
      vid.pause();
      setPaused(true);
    }
  };

  const jumpToChapter = (index: number) => {
    soundEngine.playClickConfirm();
    const ch = HERO_CHAPTERS[index];
    if (!ch) return;

    if (reducedMotion) {
      setReducedChapterIndex(index);
      return;
    }

    const targetProgress = ch.range[0] + (ch.range[1] - ch.range[0]) * 0.35;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top;
    const scrollable = Math.max(0, el.offsetHeight - window.innerHeight);
    window.scrollTo({
      top: top + scrollable * targetProgress,
      behavior: "smooth",
    });
  };

  if (reducedMotion) {
    const activeChapter =
      HERO_CHAPTERS[reducedChapterIndex] ?? HERO_CHAPTERS[0];
    return (
      <section className="bg-alabaster px-[max(4vw,20px)] pt-24 pb-12">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid gap-6 lg:grid-cols-12">
            <h1 className="font-display text-[clamp(1.5rem,2.45vw,2.25rem)] leading-[1.15] font-normal tracking-tight text-obsidian lg:col-span-5 lg:col-start-3">
              We engineer India&apos;s expressways, river bridges, runways and
              arterial infrastructure since 1999.
            </h1>
          </div>
          <div className="relative mt-6 h-[68vh] min-h-[460px] overflow-hidden rounded-[20px] bg-obsidian-soft">
            <Image
              src="/videos/hero-drone-poster.jpg"
              alt="Aerial drone view of modern Indian expressway and rapid transit corridor"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25" />
            <div className="absolute inset-x-4 bottom-4 rounded-[16px] border border-white/15 bg-obsidian-soft/80 p-5 backdrop-blur-xl sm:inset-x-6 sm:bottom-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="font-mono text-[10px] tracking-[0.14em] text-lime uppercase">
                    0{reducedChapterIndex + 1} / 04 · {activeChapter.code}
                  </p>
                  <p className="mt-1.5 font-display text-2xl font-normal tracking-tight text-white sm:text-3xl">
                    {activeChapter.title}
                  </p>
                  <p className="mt-1.5 text-sm text-white/80">
                    {activeChapter.subtitle}
                  </p>
                </div>
                <div className="shrink-0 lg:text-right">
                  <p className="font-display text-3xl text-lime">
                    {activeChapter.metricValue}
                  </p>
                  <p className="mt-0.5 text-xs text-white/75">
                    {activeChapter.metricLabel}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3 sm:grid-cols-4">
                {HERO_CHAPTERS.map((ch, i) => (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => jumpToChapter(i)}
                    className={`rounded-lg px-3 py-2 text-left font-mono text-[10px] tracking-[0.08em] uppercase transition ${
                      i === reducedChapterIndex
                        ? "bg-white text-obsidian"
                        : "bg-white/10 text-white/75 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    0{i + 1} · {CHAPTER_SHORT_LABELS[ch.id] ?? ch.metricValue}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-between font-mono text-xs text-obsidian">
            <span>+</span>
            <span className="hidden sm:inline">+</span>
            <span className="tracking-[0.14em] uppercase">
              SCROLL TO EXPLORE
            </span>
            <span className="hidden sm:inline">+</span>
            <span>+</span>
          </div>
        </div>
      </section>
    );
  }

  const activeChapterIndex = getChapterIndex(scrollProgress);
  const expandIn = Math.max(0, Math.min(1, (scrollProgress - 0.015) / 0.14));
  const expandOut = Math.max(0, Math.min(1, (0.985 - scrollProgress) / 0.1));
  const expandFactor = Math.min(expandIn, expandOut);

  const totalMeters = Math.round(scrollProgress * TOTAL_CHAINAGE_METERS);
  const chainageKm = Math.floor(totalMeters / 1000);
  const chainageM = totalMeters % 1000;

  const frameRadius = Math.round(20 * (1 - expandFactor));
  const horizPadVw = (1 - expandFactor) * 4;
  const chromeOpacity = Math.max(0, 1 - expandFactor * 1.45);
  const videoScale = 1 + scrollProgress * 0.045;

  return (
    <section
      ref={containerRef}
      aria-label="Aerial Drone Infrastructure Video Hero"
      className="relative h-[300vh] w-full bg-alabaster"
    >
      <div
        className="sticky top-0 flex h-screen w-full flex-col justify-between overflow-hidden"
        style={{
          paddingLeft: `max(${horizPadVw.toFixed(2)}vw, ${Math.round(20 * (1 - expandFactor))}px)`,
          paddingRight: `max(${horizPadVw.toFixed(2)}vw, ${Math.round(20 * (1 - expandFactor))}px)`,
          paddingTop: `${Math.round(24 * (1 - expandFactor))}px`,
          paddingBottom: `${Math.round(22 * (1 - expandFactor))}px`,
        }}
      >
        <div className="mx-auto flex h-full w-full max-w-[1600px] flex-col justify-between">
          {/* Top Editorial H1 Row */}
          <div
            className="grid shrink-0 items-start overflow-hidden transition-opacity duration-150 lg:grid-cols-12"
            style={{
              opacity: chromeOpacity,
              maxHeight: `${Math.round(132 * (1 - expandFactor))}px`,
              marginBottom: `${Math.round(12 * (1 - expandFactor))}px`,
            }}
          >
            <h1 className="pt-14 font-display text-[clamp(1.2rem,2.15vw,2.05rem)] leading-[1.14] font-normal tracking-[-0.02em] text-obsidian lg:col-span-5 lg:col-start-3 lg:pt-1">
              We engineer India&apos;s expressways, river bridges, and arterial
              infrastructure that move a nation forward
            </h1>
          </div>

          {/* Centerpiece Rounded-20px -> Full-Bleed 100vw 1080p60 Drone Video Stage */}
          <div
            data-cursor={paused ? "PLAY FILM" : "DRONE 60FPS"}
            className="relative min-h-0 flex-1 overflow-hidden bg-obsidian-soft shadow-[0_24px_60px_rgba(0,0,0,0.16)]"
            style={{ borderRadius: `${frameRadius}px` }}
          >
            <video
              ref={videoRef}
              src="/videos/hero-drone-10-94.mp4"
              poster="/videos/hero-drone-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="h-full w-full object-cover will-change-transform"
              style={{ transform: `scale(${videoScale.toFixed(4)})` }}
            />

            {/* Balanced cinema vignette keeping the aerial expressway crisp & open */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/28"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-cobalt-deep/8 mix-blend-multiply"
            />

            {/* Top HUD inside frame: Live Chainage + Video Play/Pause Control */}
            <div
              className="pointer-events-none absolute inset-x-4 z-10 flex items-center justify-between gap-2.5 sm:inset-x-6"
              style={{ top: `${Math.round(18 + expandFactor * 64)}px` }}
            >
              <div className="pointer-events-auto inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-black/50 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-white backdrop-blur-md uppercase">
                <span className="h-2 w-2 rounded-full bg-lime animate-pulse" />
                <span>AERIAL DRONE · 1080P60</span>
                <span className="text-white/30">|</span>
                <span className="tabular-nums">
                  CH. {String(chainageKm).padStart(3, "0")}+
                  {String(chainageM).padStart(3, "0")}
                </span>
                <span className="hidden text-white/30 sm:inline">|</span>
                <span className="hidden text-white/75 sm:inline">
                  ISO 9001:2015
                </span>
              </div>

              <button
                type="button"
                data-cursor=""
                onClick={togglePlayback}
                aria-label={paused ? "Play drone video" : "Pause drone video"}
                className="pointer-events-auto rounded-full border border-white/12 bg-black/50 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.1em] text-white backdrop-blur-md uppercase transition hover:border-cobalt hover:bg-cobalt"
              >
                {paused ? "▶ PLAY" : "❚❚ PAUSE"}
              </button>
            </div>

            {/* Bottom Frosted Glass Cinema Story Console */}
            <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 sm:inset-x-5 sm:bottom-5">
              <div
                data-cursor=""
                className="pointer-events-auto relative mx-auto max-w-[1440px] overflow-hidden rounded-[18px] border border-white/14 bg-[#0b0d14]/65 shadow-[0_24px_64px_rgba(0,0,0,0.45)] backdrop-blur-xl"
              >
                {/* Subtle specular top rim */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />

                {/* Upper Editorial & Metric Stage (Masked Vertical Cross-Slide) */}
                <div className="grid items-center gap-3 px-4 pt-3.5 pb-3 sm:px-6 sm:pt-4 sm:pb-3.5 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                  {/* Left: Stacked Chapter Headlines & Descriptions */}
                  <div className="grid overflow-hidden">
                    {HERO_CHAPTERS.map((ch, i) => {
                      const isActive = i === activeChapterIndex;
                      const isPast = i < activeChapterIndex;
                      return (
                        <div
                          key={ch.id}
                          aria-hidden={!isActive}
                          className={`[grid-area:1/1] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isActive
                              ? "pointer-events-auto translate-y-0 opacity-100 blur-0"
                              : isPast
                                ? "pointer-events-none -translate-y-5 opacity-0 blur-[3px]"
                                : "pointer-events-none translate-y-5 opacity-0 blur-[3px]"
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/35 bg-lime/15 px-2.5 py-0.5 text-lime">
                              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
                              0{i + 1} / 0{HERO_CHAPTERS.length}
                            </span>
                            <span className="text-white/70">{ch.code}</span>
                          </div>

                          <h2 className="mt-2 font-display text-[clamp(1.25rem,2.3vw,2.1rem)] leading-[1.08] font-normal tracking-[-0.025em] text-white">
                            {ch.title}
                          </h2>

                          <p className="mt-1.5 line-clamp-2 max-w-2xl text-xs leading-relaxed text-white/78 sm:line-clamp-none sm:text-[13px]">
                            {ch.subtitle}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Synchronized Sculptural Metric Roller */}
                  <div className="hidden overflow-hidden border-l border-white/12 pl-6 lg:grid">
                    {HERO_CHAPTERS.map((ch, i) => {
                      const isActive = i === activeChapterIndex;
                      const isPast = i < activeChapterIndex;
                      return (
                        <div
                          key={`${ch.id}-metric`}
                          aria-hidden={!isActive}
                          className={`[grid-area:1/1] flex flex-col justify-center transition-all duration-500 delay-75 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            isActive
                              ? "translate-y-0 opacity-100 blur-0"
                              : isPast
                                ? "-translate-y-6 opacity-0 blur-[3px]"
                                : "translate-y-6 opacity-0 blur-[3px]"
                          }`}
                        >
                          <p className="font-display text-[clamp(2rem,3vw,2.75rem)] leading-none font-normal tracking-[-0.03em] text-lime">
                            {ch.metricValue}
                          </p>
                          <p className="mt-1.5 text-xs leading-snug font-medium text-white/90">
                            {ch.metricLabel}
                          </p>
                          <p className="mt-1 font-mono text-[10px] tracking-[0.06em] text-white/50">
                            {ch.detail}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lower Interactive 4-Segment Live Scroll Timeline Rail */}
                <div className="grid grid-cols-2 gap-2 border-t border-white/10 bg-black/25 px-4 py-2.5 sm:grid-cols-4 sm:gap-3 sm:px-6 sm:py-3">
                  {HERO_CHAPTERS.map((ch, i) => {
                    const isActive = i === activeChapterIndex;
                    const isCompleted = i < activeChapterIndex;
                    const fill = getChapterFill(scrollProgress, ch.range);
                    const shortLabel =
                      CHAPTER_SHORT_LABELS[ch.id] ?? ch.metricValue;

                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => jumpToChapter(i)}
                        onMouseEnter={() => soundEngine.playHoverTick()}
                        aria-current={isActive ? "step" : undefined}
                        className="group flex flex-col gap-1.5 rounded-lg px-1.5 py-1 text-left transition hover:bg-white/6 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime"
                      >
                        {/* Continuous Scroll Progress Bar */}
                        <span className="relative block h-[2.5px] w-full overflow-hidden rounded-full bg-white/15">
                          <span
                            className={`absolute inset-y-0 left-0 w-full origin-left rounded-full will-change-transform ${
                              isActive
                                ? "bg-gradient-to-r from-cobalt via-cyan-arc to-lime shadow-[0_0_10px_rgba(193,255,0,0.65)]"
                                : isCompleted
                                  ? "bg-white/60"
                                  : "bg-transparent"
                            }`}
                            style={{
                              transform: `scaleX(${isCompleted ? 1 : fill})`,
                            }}
                          />
                        </span>

                        {/* Chapter Index + Short Label + Metric Chip */}
                        <span className="flex items-center justify-between gap-1.5 font-mono text-[10px] tracking-[0.06em]">
                          <span
                            className={`truncate transition-colors ${
                              isActive
                                ? "font-medium text-white"
                                : isCompleted
                                  ? "text-white/70 group-hover:text-white"
                                  : "text-white/45 group-hover:text-white/80"
                            }`}
                          >
                            <span
                              className={
                                isActive ? "text-lime" : "text-white/40"
                              }
                            >
                              0{i + 1}
                            </span>{" "}
                            <span className="hidden md:inline">
                              · {shortLabel}
                            </span>
                          </span>

                          <span
                            className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] transition-colors ${
                              isActive
                                ? "bg-lime/15 font-medium text-lime"
                                : "bg-white/6 text-white/55 group-hover:text-white/85"
                            }`}
                          >
                            {ch.metricValue}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Registration Crosshair Bar (+ + SCROLL TO EXPLORE + +) */}
          <div
            className="flex shrink-0 items-center justify-between overflow-hidden font-mono text-[12px] font-medium tracking-[0.14em] text-obsidian uppercase"
            style={{
              opacity: chromeOpacity,
              maxHeight: `${Math.round(32 * (1 - expandFactor))}px`,
              marginTop: `${Math.round(12 * (1 - expandFactor))}px`,
            }}
          >
            <span className="text-lg font-normal leading-none">+</span>
            <span className="hidden text-lg font-normal leading-none sm:inline">
              +
            </span>
            <span>SCROLL TO EXPLORE</span>
            <span className="hidden text-lg font-normal leading-none sm:inline">
              +
            </span>
            <span className="text-lg font-normal leading-none">+</span>
          </div>
        </div>
      </div>
    </section>
  );
}
