import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { MetricsBand } from "@/components/MetricsBand";
import { ShowcaseGallery } from "@/components/ShowcaseGallery";
import { PavingRecordInteractive } from "@/components/PavingRecordInteractive";
import { IndiaPresenceMap } from "@/components/IndiaPresenceMap";
import { LusionPill } from "@/components/LusionPill";
import {
  ANNUAL_REPORTS,
  CAREER_OPENINGS,
  SECTORS,
  getProjectCountsBySector,
} from "@/data/site-data";

export default function HomePage() {
  const sectorCounts = getProjectCountsBySector();
  const latestReport = ANNUAL_REPORTS[0];

  return (
    <>
      {/* 1. Lusion Alabaster Framed Rounded-20px 3D WebGL Expressway & Cable-Stayed Bridge */}
      <HeroSection />

      {/* 2. Lusion Editorial Statement ("Bold Scale. Built Ahead of Time.") + Cobalt Ribbon + Counters + Clientele Marquee */}
      <MetricsBand />

      {/* 3. Lusion Featured Work Exact 2-Column Staggered Grid (8 Flagship Corridors) */}
      <ShowcaseGallery />

      {/* 4. Lusion Obsidian Black Portal (#000): 100-Hour Continuous Paving Record & 6 Early Bonuses */}
      <PavingRecordInteractive />

      {/* 5. Six Core Infrastructure Verticals on Clean Alabaster (#f0f1fa) */}
      <section className="relative bg-alabaster pt-24 pb-10 text-obsidian sm:pt-32">
        <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="font-mono text-[11px] tracking-[0.14em] text-cobalt uppercase">
                END-TO-END IMPLEMENTATION UNDER ONE ROOF
              </p>
              <h2 className="lusion-display mt-3 text-[clamp(2.75rem,6.5vw,6.25rem)] text-obsidian">
                Six Core Verticals.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:justify-self-end">
              <LusionPill label="COMPANY & STRENGTHS" href="/about" />
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((sec) => {
              const count =
                sec.id === "industrial"
                  ? sectorCounts.industrial +
                    sectorCounts.power +
                    sectorCounts.coal
                  : sectorCounts[sec.id];
              return (
                <Link
                  key={sec.id}
                  href={`/projects?sector=${sec.id}`}
                  className="group flex flex-col justify-between overflow-hidden rounded-[18px] bg-white shadow-[0_6px_24px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(26,47,251,0.12)]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-obsidian-soft">
                    <Image
                      src={sec.image}
                      alt={sec.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                      <span className="rounded-full bg-white/95 px-3 py-1 font-mono text-[10px] font-medium text-obsidian shadow-sm">
                        {sec.code}
                      </span>
                      <span className="rounded-full bg-cobalt px-3 py-1 font-mono text-[10px] font-medium text-white shadow-sm">
                        {count} Mandates
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <h3 className="lusion-card-title-wrap font-display text-xl leading-snug font-normal text-obsidian">
                        <span className="lusion-card-arrow" aria-hidden="true">
                          →
                        </span>
                        <span>{sec.title}</span>
                      </h3>
                      <p className="mt-2.5 text-xs leading-relaxed text-muted">
                        {sec.description}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-1.5 border-t border-black/8 pt-4">
                      {sec.formats.map((f) => (
                        <span
                          key={f}
                          className="rounded-full bg-alabaster px-2.5 py-0.5 font-mono text-[10px] text-obsidian/80"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Interactive 16-State Pan-India Command Map */}
      <IndiaPresenceMap />

      {/* 7. Investors (SEBI Reg 46) & Careers Dual Editorial Cards */}
      <section className="bg-alabaster pb-24 text-obsidian sm:pb-32">
        <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Electric Cobalt Investor Card */}
            <div className="relative overflow-hidden rounded-[20px] bg-cobalt p-8 text-white sm:p-11">
              <p className="font-mono text-[11px] tracking-[0.14em] text-lime uppercase">
                SEBI (LODR) REGULATION 46 VAULT
              </p>
              <h2 className="lusion-display mt-3 text-3xl text-white sm:text-5xl">
                14 Years of Audited Annual Reports.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
                Direct statutory filings from FY 2013–14 through{" "}
                <strong className="text-white">{latestReport.fy}</strong>,
                subsidiary accounts, and investor disclosures.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <LusionPill label="OPEN INVESTOR VAULT" href="/investors" />
                <a
                  href={latestReport.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-white/90 underline underline-offset-4 hover:text-lime"
                >
                  {latestReport.title} PDF ↗
                </a>
              </div>
            </div>

            {/* Pure White Careers Card */}
            <div className="relative overflow-hidden rounded-[20px] bg-white p-8 text-obsidian shadow-[0_8px_30px_rgba(0,0,0,0.04)] sm:p-11">
              <p className="font-mono text-[11px] tracking-[0.14em] text-cobalt uppercase">
                NATION-BUILDING CAREERS
              </p>
              <h2 className="lusion-display mt-3 text-3xl text-obsidian sm:text-5xl">
                {CAREER_OPENINGS.length} Leadership &amp; Engineering Mandates.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
                Highway Project Directors, FIDIC Contract Heads, Structural
                Design Engineers, Water Supply (JJM) Managers, and HAM Toll
                Systems Specialists.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <LusionPill
                  label={`EXPLORE ${CAREER_OPENINGS.length} OPEN ROLES`}
                  href="/careers"
                  variant="dark"
                />
                <Link
                  href="/contact"
                  className="font-mono text-xs text-obsidian underline underline-offset-4 hover:text-cobalt"
                >
                  Offices &amp; Enquiry →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
