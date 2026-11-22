import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { LusionPill } from "@/components/LusionPill";
import {
  ACHIEVEMENTS,
  CLIENTELE_AUTHORITIES,
  COMPANY_INFO,
  CORE_STRENGTHS,
  GROWTH_OBJECTIVES,
} from "@/data/site-data";

export const metadata: Metadata = {
  title: "Company Overview, Strengths & Records",
  description:
    "Incorporated in 1999, ISO 9001:2015 DNV certified, MES 'SS' Super Special Class accredited, and holder of Asia & India Book of Records for 100-hour non-stop paving.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="INCORPORATED 1999 · ISO 9001:2015 DNV · MES 'SS' CLASS"
        title="Integrated Engineering. Nation-Building Scale."
        subtitle={COMPANY_INFO.overviewLong}
        code="CORPORATE DOSSIER // PROFILE"
        breadcrumb="About Us"
        stats={[
          { label: "Incorporated", value: "1999" },
          { label: "Quality Assurance", value: "ISO 9001:2015" },
          { label: "MES Accreditation", value: "Class 'SS'" },
          { label: "Government Clients", value: "18+ Authorities" },
        ]}
      />

      {/* Vision, Mission & Philosophy */}
      <section className="bg-alabaster pb-20 text-obsidian">
        <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[20px] bg-white p-8 shadow-[0_6px_24px_rgba(0,0,0,0.03)]">
              <p className="font-mono text-[10px] tracking-[0.14em] text-cobalt uppercase">
                01 // VISION
              </p>
              <h2 className="lusion-display mt-3 text-3xl text-obsidian">
                Top-3 National Leader
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {COMPANY_INFO.vision}
              </p>
            </div>
            <div className="rounded-[20px] bg-cobalt p-8 text-white shadow-xl shadow-cobalt/15">
              <p className="font-mono text-[10px] tracking-[0.14em] text-lime uppercase">
                02 // MISSION
              </p>
              <h2 className="lusion-display mt-3 text-3xl text-white">
                Timely Sustainable Delivery
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/85">
                {COMPANY_INFO.mission}
              </p>
            </div>
            <div className="rounded-[20px] bg-white p-8 shadow-[0_6px_24px_rgba(0,0,0,0.03)]">
              <p className="font-mono text-[10px] tracking-[0.14em] text-cobalt uppercase">
                03 // PHILOSOPHY
              </p>
              <h2 className="lusion-display mt-3 text-3xl text-obsidian">
                Think Globally. Act Locally.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {COMPANY_INFO.philosophy}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9 Core Strengths */}
      <section className="bg-white py-20 text-obsidian sm:py-28">
        <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] tracking-[0.14em] text-cobalt uppercase">
                COMPETITIVE MOAT · 9 PILLARS
              </p>
              <h2 className="lusion-display mt-2 text-3xl text-obsidian sm:text-5xl">
                Our Core Execution Strengths
              </h2>
            </div>
            <div className="flex items-center gap-3 rounded-full bg-alabaster px-5 py-2.5">
              <Image
                src="/images/brand/dnv-iso-9001.gif"
                alt="DNV ISO 9001:2015"
                width={24}
                height={36}
                className="h-8 w-auto rounded bg-white p-0.5"
              />
              <div className="font-mono text-[10px]">
                <p className="font-medium text-obsidian">DNV ISO 9001:2015</p>
                <p className="text-cobalt">QUALITY CERTIFIED</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {CORE_STRENGTHS.map((s) => (
              <div
                key={s.code}
                className="rounded-[16px] bg-alabaster p-6 transition hover:bg-obsidian hover:text-white group"
              >
                <span className="font-mono text-[10px] font-medium text-cobalt group-hover:text-lime">
                  {s.code}
                </span>
                <h3 className="mt-2.5 font-display text-xl font-normal">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted group-hover:text-white/75">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Growth Objectives */}
          <div className="mt-14 rounded-[20px] bg-alabaster p-7 sm:p-10">
            <p className="font-mono text-[11px] tracking-[0.14em] text-cobalt uppercase">
              KEY OBJECTIVES &amp; GROWTH STRATEGY
            </p>
            <h3 className="lusion-display mt-2 text-3xl text-obsidian sm:text-4xl">
              Disciplined Corridor Expansion
            </h3>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {GROWTH_OBJECTIVES.map((obj, idx) => (
                <div
                  key={obj}
                  className="flex items-start gap-3.5 rounded-[14px] bg-white p-4 text-sm text-obsidian shadow-xs"
                >
                  <span className="font-mono text-xs font-medium text-cobalt">
                    0{idx + 1}
                  </span>
                  <span className="leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Obsidian Black Portal: Achievements, National Records & Early Bonuses */}
      <section
        id="achievements"
        data-theme="dark"
        className="bg-obsidian py-24 text-white sm:py-32"
      >
        <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
          <p className="font-mono text-[11px] tracking-[0.14em] text-lime uppercase">
            VERIFIED RECORDS, BONUSES &amp; ACCOLADES
          </p>
          <h2 className="lusion-display mt-3 text-[clamp(2.75rem,6.5vw,6rem)] text-white">
            Achievements &amp; Records.
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {ACHIEVEMENTS.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between overflow-hidden rounded-[20px] border border-white/12 bg-obsidian-soft p-6 sm:p-7"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                    <span className="text-white/60 uppercase">
                      {item.category}
                    </span>
                    <span className="rounded-full bg-lime px-3 py-0.5 font-medium text-obsidian uppercase">
                      {item.metric}
                    </span>
                  </div>
                  <h3 className="mt-3.5 font-display text-2xl leading-snug font-normal text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 font-mono text-[11px] text-white/55">
                    {item.authority}
                  </p>
                  <p className="mt-3.5 text-sm leading-relaxed text-white/80">
                    {item.description}
                  </p>
                </div>

                {item.certificateImage && (
                  <div className="relative mt-6 aspect-[16/10] w-full overflow-hidden rounded-[14px] bg-white">
                    <Image
                      src={item.certificateImage}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Esteemed Clientele Directory on Alabaster */}
      <section id="clientele" className="bg-alabaster py-24 text-obsidian">
        <div className="mx-auto max-w-[1600px] px-[max(4vw,20px)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] tracking-[0.14em] text-cobalt uppercase">
                PUBLIC SECTOR PARTNERSHIPS
              </p>
              <h2 className="lusion-display mt-2 text-3xl text-obsidian sm:text-5xl">
                18+ Esteemed Government Authorities
              </h2>
            </div>
            <LusionPill label="INSPECT 137 PROJECTS" href="/projects" />
          </div>

          <div className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            {CLIENTELE_AUTHORITIES.map((c) => (
              <div
                key={c.short}
                className="flex items-center gap-4 rounded-[16px] bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.03)]"
              >
                <span className="flex h-11 min-w-[74px] items-center justify-center rounded-full bg-alabaster px-3 font-mono text-xs font-medium text-cobalt">
                  {c.short}
                </span>
                <div>
                  <p className="text-sm font-medium text-obsidian">{c.name}</p>
                  <p className="mt-0.5 font-mono text-[10px] text-muted uppercase">
                    {c.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
