"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { COMPANY_INFO } from "@/data/site-data";
import { soundEngine } from "@/lib/audio";
import { usePrefersReducedMotion } from "@/lib/device";

const PAGE_SEQUENCE = [
  { path: "/", nextHref: "/about", nextLabel: "ABOUT US" },
  { path: "/about", nextHref: "/projects", nextLabel: "137 PROJECTS" },
  { path: "/projects", nextHref: "/investors", nextLabel: "INVESTORS" },
  { path: "/investors", nextHref: "/careers", nextLabel: "CAREERS" },
  { path: "/careers", nextHref: "/contact", nextLabel: "CONTACT" },
  { path: "/contact", nextHref: "/", nextLabel: "CORRIDOR 3D" },
] as const;

export function Footer() {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();
  const [enquiryText, setEnquiryText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [overscrollPct, setOverscrollPct] = useState(0);
  const chargeRef = useRef(0);
  const navigatingRef = useRef(false);

  const nextStep =
    PAGE_SEQUENCE.find((p) => p.path === pathname) ?? PAGE_SEQUENCE[0];

  // Reset charge on route change
  useEffect(() => {
    chargeRef.current = 0;
    navigatingRef.current = false;
    const id = window.requestAnimationFrame(() => setOverscrollPct(0));
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  // Lusion Signature Scroll-to-Trigger NEXT PAGE overscroll accumulator
  useEffect(() => {
    if (reduced) return;
    let decayTimer = 0;

    const onWheel = (e: WheelEvent) => {
      if (navigatingRef.current) return;
      const distFromBottom =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);

      if (distFromBottom <= 8 && e.deltaY > 0) {
        chargeRef.current = Math.min(100, chargeRef.current + e.deltaY * 0.14);
        setOverscrollPct(Math.round(chargeRef.current));

        window.clearTimeout(decayTimer);
        if (chargeRef.current >= 100) {
          navigatingRef.current = true;
          window.dispatchEvent(
            new CustomEvent("pnc-navigate", {
              detail: { href: nextStep.nextHref, label: nextStep.nextLabel },
            }),
          );
          return;
        }

        decayTimer = window.setTimeout(() => {
          chargeRef.current = 0;
          setOverscrollPct(0);
        }, 900);
      } else if (e.deltaY < 0 && chargeRef.current > 0) {
        chargeRef.current = 0;
        setOverscrollPct(0);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(decayTimer);
    };
  }, [nextStep.nextHref, nextStep.nextLabel, reduced]);

  const handleNextClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    window.dispatchEvent(
      new CustomEvent("pnc-navigate", {
        detail: { href: nextStep.nextHref, label: nextStep.nextLabel },
      }),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryText.trim()) return;
    soundEngine.playClickConfirm();
    setSubmitted(true);
    setEnquiryText("");
  };

  const scrollToTop = () => {
    soundEngine.playClickConfirm();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-10">
      {/* PART A: Pure White Lusion 12-Column Editorial Footer */}
      <div className="border-t border-black/8 bg-white text-obsidian">
        <div className="mx-auto max-w-[1600px] px-[max(4vw,24px)] pt-16 pb-12 sm:pt-24 sm:pb-14">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-8 text-[15px] leading-[1.55] text-obsidian/85 lg:col-span-3">
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                  CORPORATE OFFICE — AGRA
                </p>
                <p className="mt-2">
                  3/22 D, Civil Lines, PNC Tower
                  <br />
                  Bypass Road, Agra – 282002
                  <br />
                  Uttar Pradesh, India
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                  REGISTERED OFFICE — NEW DELHI
                </p>
                <p className="mt-2">
                  NBCC Plaza, Tower II, 4th Floor
                  <br />
                  Pushp Vihar (Near Saket)
                  <br />
                  New Delhi – 110 017, India
                </p>
              </div>
            </div>

            <div className="space-y-8 text-[15px] leading-[1.6] lg:col-span-3">
              <ul className="space-y-1 text-obsidian">
                <li>
                  <Link href="/about" className="transition hover:text-cobalt">
                    Company Overview
                  </Link>
                </li>
                <li>
                  <Link href="/projects" className="transition hover:text-cobalt">
                    All 137 Projects
                  </Link>
                </li>
                <li>
                  <Link href="/investors" className="transition hover:text-cobalt">
                    SEBI Reg 46 &amp; Annual Reports
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="transition hover:text-cobalt">
                    Careers (17 Roles)
                  </Link>
                </li>
                <li>
                  <a
                    href={COMPANY_INFO.documents.corporateBrochurePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-cobalt"
                  >
                    Corporate Prospectus PDF ↗
                  </a>
                </li>
              </ul>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted">Company Secretary</p>
                  <p className="font-medium text-obsidian">
                    Mr. Kumar Jain ·{" "}
                    <a
                      href={`tel:${COMPANY_INFO.corporateOffice.phone}`}
                      className="hover:text-cobalt"
                    >
                      {COMPANY_INFO.corporateOffice.phone}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted">Careers &amp; HR</p>
                  <a
                    href={`mailto:${COMPANY_INFO.corporateOffice.email}`}
                    className="font-medium text-obsidian hover:text-cobalt"
                  >
                    {COMPANY_INFO.corporateOffice.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:pl-8">
              <h2 className="lusion-display text-[clamp(2rem,3.6vw,3.5rem)] text-obsidian">
                Start a project
                <br />
                or tender enquiry
              </h2>

              {submitted ? (
                <div className="mt-7 flex items-center justify-between gap-4 rounded-[18px] bg-alabaster px-6 py-5">
                  <div>
                    <p className="font-mono text-[11px] font-medium text-cobalt uppercase">
                      ✓ ENQUIRY LOGGED IN DEMO DESK
                    </p>
                    <p className="mt-1 text-sm text-obsidian">
                      For live official inquiries call{" "}
                      <strong>{COMPANY_INFO.corporateOffice.phone}</strong> or
                      visit{" "}
                      <Link href="/contact" className="text-cobalt underline">
                        Contact Desk
                      </Link>
                      .
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="rounded-full bg-obsidian px-4 py-2 font-mono text-[11px] text-white hover:bg-cobalt"
                  >
                    NEW
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-7">
                  <div className="flex items-center rounded-[18px] bg-alabaster px-6 py-4 transition focus-within:ring-2 focus-within:ring-cobalt">
                    <label htmlFor="footer-lusion-input" className="sr-only">
                      Enter your requirement, email, or +91 phone number
                    </label>
                    <input
                      id="footer-lusion-input"
                      type="text"
                      value={enquiryText}
                      onChange={(e) => setEnquiryText(e.target.value)}
                      placeholder="Your requirement, email, or +91 mobile"
                      className="w-full bg-transparent text-base text-obsidian placeholder:text-muted/60 focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Submit enquiry"
                      className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-obsidian transition hover:bg-cobalt hover:text-white"
                    >
                      →
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-black/8 pt-6">
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/brand/dnv-iso-9001.gif"
                    alt="DNV ISO 9001:2015 Certified"
                    width={28}
                    height={42}
                    className="h-9 w-auto rounded border border-black/10 bg-white p-0.5"
                  />
                  <div className="font-mono text-[10px] leading-snug text-muted">
                    <p className="font-medium text-obsidian">
                      ISO 9001:2015 DNV CERTIFIED
                    </p>
                    <p>MES &ldquo;SS&rdquo; SUPER SPECIAL CLASS</p>
                  </div>
                </div>
                <a
                  href={COMPANY_INFO.documents.fraudWarningPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-coral transition hover:underline"
                >
                  ⚠ Fraudulent Employment Offers Notice (PDF) ↗
                </a>
              </div>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-black/8 pt-8 text-xs text-muted">
            <p>©1999–2026 {COMPANY_INFO.name}. All Rights Reserved.</p>
            <p className="font-mono text-[11px]">
              PAN-INDIA INFRASTRUCTURE · 16 STATES · 137 MANDATES
            </p>
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-obsidian/70 sm:inline">
                Rebuilt with Next.js + 3D WebGL
              </span>
              <button
                type="button"
                onClick={scrollToTop}
                data-cursor="TOP ↑"
                aria-label="Scroll back to top"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-obsidian text-lg text-white transition hover:bg-cobalt"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PART B: Lusion Signature Obsidian Black Scroll-to-Navigate NEXT PAGE Band */}
      <a
        href={nextStep.nextHref}
        onClick={handleNextClick}
        onMouseEnter={() => soundEngine.playHoverTick()}
        data-theme="dark"
        data-cursor="NEXT PAGE"
        className="group block bg-obsidian text-white transition-colors hover:bg-[#070914]"
      >
        <div className="mx-auto max-w-[1600px] px-[max(4vw,24px)] pt-14 pb-10 sm:pt-20 sm:pb-12">
          <p className="font-mono text-[11px] leading-relaxed tracking-[0.12em] text-white/65 uppercase">
            {overscrollPct > 0
              ? `CHARGING TRANSITION · ${overscrollPct}%`
              : "KEEP SCROLLING OR CLICK"}
            <br />
            TO LEARN MORE
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
            <span className="lusion-display text-[clamp(2.75rem,6.5vw,5.75rem)] tracking-tight text-white transition-transform duration-300 group-hover:translate-x-2">
              {nextStep.nextLabel}
            </span>

            <div className="flex items-center gap-4 font-mono text-xs tracking-[0.14em] uppercase">
              <span className="text-white/80">NEXT PAGE</span>
              <span className="relative h-[4px] w-32 overflow-hidden rounded-full bg-white/20 sm:w-44">
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-lime transition-all duration-150 group-hover:!w-full"
                  style={{ width: `${Math.max(24, overscrollPct)}%` }}
                />
              </span>
              <span className="text-lg transition-transform duration-300 group-hover:translate-x-1.5">
                →
              </span>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="mt-14 flex items-center justify-between font-mono text-lg font-light text-white/80"
          >
            <span>+</span>
            <span>+</span>
            <span>+</span>
            <span>+</span>
          </div>
        </div>
      </a>
    </footer>
  );
}
