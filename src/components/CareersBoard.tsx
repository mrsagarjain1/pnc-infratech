"use client";

import { useMemo, useState } from "react";
import {
  CAREER_OPENINGS,
  COMPANY_INFO,
  type CareerOpening,
} from "@/data/site-data";

const DEPARTMENTS: ("All" | CareerOpening["department"])[] = [
  "All",
  "Highways & EPC",
  "Water & Irrigation",
  "HAM & O&M",
  "Finance, Tax & Legal",
  "Engineering & Corporate",
];

export function CareersBoard() {
  const [dept, setDept] = useState<"All" | CareerOpening["department"]>("All");
  const [query, setQuery] = useState("");
  const [applyingRole, setApplyingRole] = useState<CareerOpening | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [mobile, setMobile] = useState("");
  const [resumeName, setResumeName] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CAREER_OPENINGS.filter((role) => {
      if (dept !== "All" && role.department !== dept) return false;
      if (
        q &&
        !`${role.code} ${role.title} ${role.eligibility} ${role.qualification}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [dept, query]);

  const openModal = (role: CareerOpening) => {
    setApplyingRole(role);
    setSubmitted(false);
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim() || !mobile.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-10">
      {/* Official Fraudulent Employment Offers Advisory */}
      <div className="rounded-[20px] bg-obsidian p-6 text-white sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] font-medium tracking-[0.12em] text-lime uppercase">
              ⚠ OFFICIAL PUBLIC ADVISORY — BEWARE OF FRAUDULENT EMPLOYMENT OFFERS
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              PNC Infratech Limited does not charge any fee or deposit at any
              stage of recruitment. Always mention the exact Vacancy Code when
              sending your CV directly to{" "}
              <a
                href={`mailto:${COMPANY_INFO.corporateOffice.email}`}
                className="font-mono text-white underline hover:text-lime"
              >
                {COMPANY_INFO.corporateOffice.email}
              </a>
              .
            </p>
          </div>
          <a
            href={COMPANY_INFO.documents.fraudWarningPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-white px-5 py-2.5 font-mono text-[11px] font-medium text-obsidian uppercase transition hover:bg-cobalt hover:text-white"
          >
            READ OFFICIAL NOTICE (PDF) ↗
          </a>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[18px] bg-white p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)]">
        <div className="flex flex-wrap gap-1.5">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDept(d)}
              className={`rounded-full px-3.5 py-1.5 font-mono text-[11px] transition ${
                dept === d
                  ? "bg-cobalt font-medium text-white"
                  : "bg-alabaster text-obsidian/75 hover:bg-alabaster-deep"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <label htmlFor="career-search" className="sr-only">
            Search vacancies by code, title, or eligibility
          </label>
          <input
            id="career-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role, vacancy code (e.g. HAM04, SAP)..."
            className="w-full rounded-[12px] bg-alabaster px-3.5 py-2.5 text-xs text-obsidian placeholder:text-muted/65 focus:ring-2 focus:ring-cobalt focus:outline-none"
          />
        </div>
      </div>

      {/* 17 Vacancy Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((role) => (
          <div
            key={role.code}
            className="flex flex-col justify-between rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.03)] transition hover:shadow-[0_14px_34px_rgba(26,47,251,0.1)]"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]">
                <span className="rounded-full bg-cobalt px-3 py-0.5 font-medium text-white">
                  CODE: {role.code}
                </span>
                <span className="text-muted uppercase">{role.department}</span>
              </div>

              <h3 className="mt-3.5 font-display text-2xl leading-snug font-normal text-obsidian">
                {role.title}
              </h3>

              <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px]">
                <span className="rounded-full bg-alabaster px-3 py-1 text-obsidian">
                  Experience: {role.experience}
                </span>
                <span className="rounded-full bg-alabaster px-3 py-1 text-muted">
                  {role.qualification}
                </span>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-muted">
                {role.eligibility}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/8 pt-4">
              <a
                href={`mailto:${COMPANY_INFO.corporateOffice.email}?subject=Application%20for%20${encodeURIComponent(role.code)}%20-%20${encodeURIComponent(role.title)}`}
                className="font-mono text-[11px] text-cobalt hover:underline"
              >
                Email HR ({role.code}) ↗
              </a>
              <button
                type="button"
                onClick={() => openModal(role)}
                className="rounded-full bg-obsidian px-5 py-2 font-mono text-[11px] font-medium text-white uppercase transition hover:bg-cobalt"
              >
                APPLY NOW →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {applyingRole && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="apply-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setApplyingRole(null)}
        >
          <div
            className="thin-scroll max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[20px] bg-white p-6 text-obsidian shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-medium text-cobalt uppercase">
                  VACANCY CODE: {applyingRole.code}
                </p>
                <h3
                  id="apply-modal-title"
                  className="mt-1 font-display text-2xl font-normal text-obsidian"
                >
                  {applyingRole.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApplyingRole(null)}
                className="rounded-full bg-alabaster px-3.5 py-1.5 font-mono text-xs text-obsidian hover:bg-obsidian hover:text-white"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="mt-6 rounded-[16px] bg-alabaster p-6 text-sm text-obsidian">
                <p className="font-mono text-xs font-medium text-cobalt uppercase">
                  ✓ APPLICATION STAGED FOR DEMO
                </p>
                <p className="mt-2 font-medium">
                  Thank you, {firstName} {lastName}. Your profile for{" "}
                  <span className="text-cobalt">{applyingRole.code}</span> has
                  been recorded locally.
                </p>
                <p className="mt-2 text-xs text-muted">
                  To submit a live application to PNC Infratech, email your CV
                  citing <strong>{applyingRole.code}</strong> to{" "}
                  <a
                    href={`mailto:${COMPANY_INFO.corporateOffice.email}?subject=Application%20${applyingRole.code}`}
                    className="text-cobalt underline"
                  >
                    {COMPANY_INFO.corporateOffice.email}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setApplyingRole(null)}
                  className="mt-5 rounded-full bg-obsidian px-5 py-2 font-mono text-xs text-white hover:bg-cobalt"
                >
                  DONE
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="apply-fn"
                      className="block font-mono text-[10px] text-muted uppercase"
                    >
                      First Name *
                    </label>
                    <input
                      id="apply-fn"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 w-full rounded-[12px] bg-alabaster px-3.5 py-2.5 text-xs text-obsidian focus:ring-2 focus:ring-cobalt focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="apply-ln"
                      className="block font-mono text-[10px] text-muted uppercase"
                    >
                      Last Name *
                    </label>
                    <input
                      id="apply-ln"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 w-full rounded-[12px] bg-alabaster px-3.5 py-2.5 text-xs text-obsidian focus:ring-2 focus:ring-cobalt focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="apply-email"
                      className="block font-mono text-[10px] text-muted uppercase"
                    >
                      Email Address *
                    </label>
                    <input
                      id="apply-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-[12px] bg-alabaster px-3.5 py-2.5 text-xs text-obsidian focus:ring-2 focus:ring-cobalt focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="apply-city"
                      className="block font-mono text-[10px] text-muted uppercase"
                    >
                      City (India) *
                    </label>
                    <input
                      id="apply-city"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Agra, Lucknow, Delhi"
                      className="mt-1 w-full rounded-[12px] bg-alabaster px-3.5 py-2.5 text-xs text-obsidian focus:ring-2 focus:ring-cobalt focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="apply-mobile"
                    className="block font-mono text-[10px] text-muted uppercase"
                  >
                    Mobile Number *
                  </label>
                  <div className="mt-1 flex">
                    <span className="inline-flex items-center rounded-l-[12px] bg-alabaster-deep px-3 font-mono text-xs text-cobalt">
                      +91
                    </span>
                    <input
                      id="apply-mobile"
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full rounded-r-[12px] bg-alabaster px-3.5 py-2.5 text-xs text-obsidian focus:ring-2 focus:ring-cobalt focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="apply-resume"
                    className="block font-mono text-[10px] text-muted uppercase"
                  >
                    Attach Resume (PDF / DOCX / DOC)
                  </label>
                  <input
                    id="apply-resume"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) =>
                      setResumeName(e.target.files?.[0]?.name ?? "")
                    }
                    className="mt-1 block w-full rounded-[12px] bg-alabaster px-3 py-2 text-xs text-muted file:mr-3 file:rounded-full file:border-0 file:bg-obsidian file:px-3.5 file:py-1 file:font-mono file:text-[10px] file:text-white"
                  />
                  {resumeName && (
                    <p className="mt-1 font-mono text-[10px] text-cobalt">
                      Selected: {resumeName}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyingRole(null)}
                    className="rounded-full bg-alabaster px-4 py-2 font-mono text-xs text-obsidian hover:bg-alabaster-deep"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-cobalt px-6 py-2.5 font-mono text-xs font-medium text-white uppercase transition hover:bg-obsidian"
                  >
                    SUBMIT APPLICATION →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
