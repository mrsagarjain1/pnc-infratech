"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  CLIENTELE_AUTHORITIES,
  COMPANY_INFO,
  KEY_METRICS,
} from "@/data/site-data";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion, useSceneMode } from "@/lib/device";
import { useNearViewport } from "@/lib/useNearViewport";
import { LusionPill } from "./LusionPill";
import { RevealLines, ScrambleText } from "./KineticText";

const CobaltRibbonCanvas = dynamic(
  () => import("./CobaltRibbonCanvas").then((m) => m.CobaltRibbonCanvas),
  { ssr: false },
);

export function MetricsBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const sceneMode = useSceneMode();
  const nearViewport = useNearViewport(bandRef, "420px 0px");
  const show3DRibbon =
    nearViewport && (sceneMode === "full" || sceneMode === "lite");

  useEffect(() => {
    if (reducedMotion || !bandRef.current) return;

    const ctx = gsap.context(() => {
      const counters =
        bandRef.current?.querySelectorAll<HTMLElement>("[data-counter]");
      counters?.forEach((el) => {
        const target = Number(el.dataset.target ?? "0");
        const suffix = el.dataset.suffix ?? "";
        const obj = { val: 0 };

        gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${Math.round(obj.val)}${suffix}`;
          },
        });
      });
    }, bandRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={bandRef}
      className="relative overflow-hidden bg-alabaster text-obsidian"
    >
      <div className="relative mx-auto max-w-[1600px] px-[max(4vw,20px)] pt-20 pb-20 sm:pt-32 sm:pb-28">
        {/* Real 3D Clearcoat Glossy Electric-Cobalt Expressway Ribbon behind Editorial Statement */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -left-20 h-[760px] w-[1080px] sm:h-[880px]"
        >
          {show3DRibbon ? (
            <CobaltRibbonCanvas />
          ) : (
            <svg viewBox="0 0 1200 900" fill="none" className="h-full w-full">
              <path
                d="M -40,40 C 310,60 540,260 515,520 C 495,720 330,835 160,820"
                stroke="#1a2ffb"
                strokeWidth="54"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>

        {/* Masked Split-Line Kinetic Architectural Headline */}
        <div className="relative z-10">
          <RevealLines
            lines={["Bold Scale.", "Built Ahead of Time."]}
            indentFirst
            className="lusion-display text-[clamp(3rem,8.8vw,8.75rem)] text-obsidian"
          />
        </div>

        {/* Asymmetric 2-Column Row: Natural HD Corridor Media Frame + Editorial Copy & Expanding Pill CTA */}
        <div className="relative z-10 mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div
              data-cursor="CORRIDOR"
              className="group relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-obsidian-soft shadow-[0_24px_60px_rgba(0,0,0,0.14)]"
            >
              <Image
                src="/images/real/india-expressway-corridor.jpg"
                alt="Sweeping six-lane elevated Indian expressway corridor curving toward the horizon"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10"
              />
              <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3.5 py-1.5 font-mono text-[10px] font-medium tracking-[0.1em] text-obsidian uppercase shadow-sm backdrop-blur-sm">
                <ScrambleText text="NH-148N · BHARATMALA PARIYOJANA" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <p className="font-sans text-[clamp(1.125rem,1.55vw,1.55rem)] leading-[1.42] font-normal text-obsidian/90">
              {COMPANY_INFO.overviewLong}
            </p>
            <p className="mt-5 font-mono text-xs leading-relaxed text-muted uppercase">
              <ScrambleText text='ISO 9001:2015 DNV CERTIFIED · MES "SS" SUPER SPECIAL CLASS ACCREDITATION' />
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <LusionPill label="OUR APPROACH" href="/about" />
              <LusionPill label="SEBI REG 46" href="/investors" variant="dark" />
            </div>
          </div>
        </div>

        {/* 4-Column Architectural Counter Strip */}
        <div className="relative z-10 mt-20 grid gap-px overflow-hidden rounded-[20px] bg-black/10 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {KEY_METRICS.map((m) => (
            <div
              key={m.id}
              className="group bg-white p-7 transition-colors duration-300 hover:bg-cobalt hover:text-white sm:p-8"
            >
              <div
                data-counter
                data-target={m.value}
                data-suffix={m.suffix}
                className="lusion-display text-[clamp(2.5rem,4vw,4rem)] tabular-nums text-obsidian transition-colors group-hover:text-white"
              >
                {m.value}
                {m.suffix}
              </div>
              <p className="mt-4 text-sm font-medium text-obsidian transition-colors group-hover:text-lime">
                {m.label}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted transition-colors group-hover:text-white/80">
                {m.sublabel}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Clientele Authority Marquee */}
      <div className="border-y border-black/8 bg-white/75 py-8">
        <div className="mx-auto mb-5 flex max-w-[1600px] flex-wrap items-center justify-between gap-2 px-[max(4vw,20px)] font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
          <ScrambleText text="ESTEEMED PUBLIC INFRASTRUCTURE AUTHORITIES (18+)" />
          <span className="text-cobalt">CENTRAL &amp; STATE MANDATES</span>
        </div>

        <div className="marquee relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#f7f7fc] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#f7f7fc] to-transparent"
          />
          <div
            className="marquee-track gap-3.5"
            style={{ "--marquee-duration": "64s" } as React.CSSProperties}
          >
            {[...CLIENTELE_AUTHORITIES, ...CLIENTELE_AUTHORITIES].map(
              (client, idx) => (
                <div
                  key={`${client.short}-${idx}`}
                  className="flex shrink-0 items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] ring-1 ring-black/6"
                >
                  <span className="rounded-full bg-alabaster px-2.5 py-0.5 font-mono text-[11px] font-medium text-cobalt">
                    {client.short}
                  </span>
                  <span className="max-w-[230px] truncate text-xs font-medium text-obsidian">
                    {client.name}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
