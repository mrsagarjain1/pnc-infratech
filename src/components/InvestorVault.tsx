"use client";

import { useMemo, useState } from "react";
import {
  ANNUAL_REPORTS,
  COMPANY_INFO,
  SEBI_LODR_DISCLOSURE_CATEGORIES,
} from "@/data/site-data";
import { LusionPill } from "./LusionPill";

export function InvestorVault() {
  const [filterYear, setFilterYear] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const tags = [
    "All",
    "Latest Filing",
    "Audited Report",
    "Revised Filing",
    "Archive",
  ];

  const filteredReports = useMemo(() => {
    const q = filterYear.trim().toLowerCase();
    return ANNUAL_REPORTS.filter((r) => {
      if (selectedTag !== "All" && r.tag !== selectedTag) return false;
      if (
        q &&
        !`${r.fy} ${r.title} ${r.highlights.join(" ")}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [filterYear, selectedTag]);

  return (
    <div className="space-y-20">
      {/* SEBI (LODR) Regulation 46 Disclosure Pillars */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.14em] text-cobalt uppercase">
              STATUTORY GOVERNANCE &amp; SHAREHOLDER TRANSPARENCY
            </p>
            <h2 className="lusion-display mt-2 text-3xl text-obsidian sm:text-5xl">
              Disclosures Under Reg 46 of SEBI (LODR)
            </h2>
          </div>
          <LusionPill
            label="PROSPECTUS PDF"
            href={COMPANY_INFO.documents.corporateBrochurePdf}
            external
            variant="dark"
          />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SEBI_LODR_DISCLOSURE_CATEGORIES.map((item) => (
            <div
              key={item.code}
              className="flex flex-col justify-between rounded-[16px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition hover:shadow-[0_12px_32px_rgba(26,47,251,0.1)]"
            >
              <div>
                <span className="font-mono text-[10px] font-medium tracking-[0.1em] text-cobalt">
                  {item.code}
                </span>
                <h3 className="mt-2.5 font-display text-xl font-normal text-obsidian">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-black/8 pt-3.5 font-mono text-[10px]">
                <span className="text-obsidian/70">{item.status}</span>
                <a
                  href="https://www.pncinfratech.com/financials.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cobalt hover:underline"
                >
                  Source ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Annual Report Timeline Vault (FY 2013-14 to FY 2025-26) */}
      <section id="annual-reports">
        <div>
          <p className="font-mono text-[11px] tracking-[0.14em] text-cobalt uppercase">
            TIMELINE VAULT · 14 AUDITED FILINGS
          </p>
          <h2 className="lusion-display mt-2 text-3xl text-obsidian sm:text-5xl">
            Annual Reports Archive (FY 14 – FY 26)
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Every direct Annual Report PDF published on
            pncinfratech.com/financials.html, indexed for rapid institutional
            inspection.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-[18px] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTag(t)}
                className={`rounded-full px-4 py-1.5 font-mono text-[11px] transition ${
                  selectedTag === t
                    ? "bg-cobalt font-medium text-white"
                    : "bg-alabaster text-obsidian/75 hover:bg-alabaster-deep"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-64">
            <label htmlFor="report-search" className="sr-only">
              Search annual reports by fiscal year
            </label>
            <input
              id="report-search"
              type="search"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              placeholder="Filter fiscal year (e.g. 2026, 2022)..."
              className="w-full rounded-[12px] bg-alabaster px-3.5 py-2.5 text-xs text-obsidian placeholder:text-muted/65 focus:ring-2 focus:ring-cobalt focus:outline-none"
            />
          </div>
        </div>

        {/* Report Cards */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredReports.map((report, idx) => {
            const isHeroLatest =
              idx === 0 && selectedTag === "All" && !filterYear;
            return (
              <div
                key={report.pdfPath}
                className={`group flex flex-col justify-between rounded-[18px] p-6 transition hover:-translate-y-0.5 ${
                  isHeroLatest
                    ? "bg-obsidian text-white shadow-xl"
                    : "bg-white text-obsidian shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_34px_rgba(26,47,251,0.1)]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span
                      className={isHeroLatest ? "text-lime" : "text-cobalt"}
                    >
                      {report.fy}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 uppercase ${
                        isHeroLatest
                          ? "bg-cobalt text-white"
                          : "bg-alabaster text-muted"
                      }`}
                    >
                      {report.tag}
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-2xl font-normal">
                    {report.title}
                  </h3>

                  <ul
                    className={`mt-3.5 space-y-1.5 text-xs ${
                      isHeroLatest ? "text-white/75" : "text-muted"
                    }`}
                  >
                    {report.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            isHeroLatest ? "bg-lime" : "bg-cobalt"
                          }`}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`mt-6 flex items-center justify-between border-t pt-4 ${
                    isHeroLatest ? "border-white/15" : "border-black/8"
                  }`}
                >
                  <span
                    className={`truncate font-mono text-[10px] ${
                      isHeroLatest ? "text-white/50" : "text-muted/80"
                    }`}
                  >
                    {report.pdfPath}
                  </span>
                  <a
                    href={report.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`shrink-0 rounded-full px-4 py-1.5 font-mono text-[10px] font-medium uppercase transition ${
                      isHeroLatest
                        ? "bg-white text-obsidian hover:bg-lime"
                        : "bg-obsidian text-white hover:bg-cobalt"
                    }`}
                  >
                    OPEN PDF ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
