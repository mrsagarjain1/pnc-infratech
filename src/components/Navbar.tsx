"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { COMPANY_INFO } from "@/data/site-data";
import { soundEngine } from "@/lib/audio";

const MENU_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT US" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/investors", label: "INVESTORS" },
  { href: "/careers", label: "CAREERS" },
  { href: "/contact", label: "CONTACT" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [quickInput, setQuickInput] = useState("");
  const [quickSent, setQuickSent] = useState(false);

  useEffect(() => {
    const unsubAudio = soundEngine.subscribe((on) => setAudioOn(on));
    const handler = (e: Event) => {
      const ce = e as CustomEvent<"dark" | "light">;
      setOverDark(ce.detail === "dark");
    };
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("pnc-header-theme", handler);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      unsubAudio();
      window.removeEventListener("pnc-header-theme", handler);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    setQuickSent(true);
    setQuickInput("");
  };

  return (
    <>
      {/* Fixed Floating Lusion-Style Header */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-[max(4vw,20px)] py-5 sm:py-6">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4">
          {/* Left: Clean Architectural Wordmark (pure at y=0, crisp adaptive pill on scroll) */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className={`pointer-events-auto group inline-flex items-center gap-2.5 rounded-full transition-all duration-300 ${
              scrolled && !menuOpen
                ? overDark
                  ? "bg-black/75 px-3.5 py-2 text-white ring-1 ring-white/15 backdrop-blur-md shadow-lg"
                  : "bg-white/88 px-3.5 py-2 text-obsidian ring-1 ring-black/6 backdrop-blur-md shadow-[0_6px_14px_rgba(0,0,0,0.06)]"
                : overDark && !menuOpen
                  ? "text-white"
                  : "text-obsidian"
            }`}
          >
            <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-[6px] bg-cobalt p-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/brand/pnc-mark.png"
                alt="PNC Emblem"
                width={22}
                height={22}
                className="h-full w-full object-contain brightness-125"
                priority
              />
            </span>
            <span className="font-display text-lg font-bold tracking-[0.14em] uppercase sm:text-xl">
              PNC
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.18em] opacity-60 uppercase md:inline">
              INFRATECH
            </span>
          </Link>

          {/* Right: Lusion 3-Control Capsule Cluster */}
          <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3">
            {/* 1. Circular Opt-In Web Audio Soundscape Toggle (exact Lusion audio wave control) */}
            <button
              type="button"
              onClick={() => soundEngine.toggle()}
              aria-pressed={audioOn}
              aria-label={
                audioOn
                  ? "Mute ambient audio soundscape"
                  : "Enable generative Web Audio soundscape"
              }
              title={
                audioOn
                  ? "Ambient Sound ON (Click to Mute)"
                  : "Enable Lusion-Style Ambient Audio"
              }
              data-cursor={audioOn ? "MUTE" : "SOUND ON"}
              className="hidden h-11 w-11 items-center justify-center rounded-full bg-alabaster-deep text-obsidian shadow-[0_6px_14px_rgba(0,0,0,0.06)] transition hover:bg-white sm:inline-flex"
            >
              {audioOn ? (
                <span className="flex items-center gap-[2.5px]" aria-hidden="true">
                  <span className="wave-bar h-2.5 w-[2px] rounded-full bg-obsidian" style={{ animationDelay: "0ms" }} />
                  <span className="wave-bar h-4 w-[2px] rounded-full bg-cobalt" style={{ animationDelay: "160ms" }} />
                  <span className="wave-bar h-3 w-[2px] rounded-full bg-obsidian" style={{ animationDelay: "320ms" }} />
                  <span className="wave-bar h-2 w-[2px] rounded-full bg-obsidian" style={{ animationDelay: "480ms" }} />
                </span>
              ) : (
                <span className="h-[2px] w-4 rounded-full bg-obsidian" aria-hidden="true" />
              )}
            </button>

            {/* 2. Dark Pill CTA ("LET'S TALK •") */}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="lusion-pill lusion-pill-dark !h-11 !px-5 !text-[12px]"
            >
              <span className="lusion-pill-label">LET&apos;S TALK</span>
              <span className="lusion-pill-dot" aria-hidden="true" />
              <span className="lusion-pill-arrow" aria-hidden="true">
                →
              </span>
            </Link>

            {/* 3. Light Pill Menu Toggle ("MENU ••" -> "CLOSE :") */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="lusion-menu-drawer"
              className={`inline-flex h-11 items-center gap-3 rounded-full px-5 font-sans text-[12px] font-medium tracking-[0.06em] uppercase shadow-[0_6px_14px_rgba(0,0,0,0.06)] transition-all duration-300 ${
                menuOpen
                  ? "bg-white text-obsidian"
                  : "bg-alabaster-deep text-obsidian hover:bg-white"
              }`}
            >
              <span>{menuOpen ? "CLOSE" : "MENU"}</span>
              <span
                aria-hidden="true"
                className={`flex items-center gap-[3.5px] transition-transform duration-300 ${
                  menuOpen ? "rotate-90" : "rotate-0"
                }`}
              >
                <span className="h-[4px] w-[4px] rounded-full bg-obsidian" />
                <span className="h-[4px] w-[4px] rounded-full bg-obsidian" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Lusion Right-Aligned Stacked Floating Menu Overlay */}
      {menuOpen && (
        <div
          id="lusion-menu-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation Menu"
          className="fixed inset-0 z-40 flex justify-end"
          onClick={() => setMenuOpen(false)}
        >
          {/* Soft right-side gradient scrim */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-l from-[#0b0b12]/50 via-[#0b0b12]/15 to-transparent backdrop-blur-[2px]"
          />

          <div
            className="relative z-10 mt-20 mr-[max(4vw,20px)] flex w-[min(320px,calc(100vw-40px))] flex-col gap-2.5 sm:mt-24"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Card 1: White Navigation Links */}
            <nav
              aria-label="Primary Navigation"
              className="rounded-[12px] bg-white p-5 shadow-2xl shadow-black/15"
            >
              <ul className="space-y-1">
                {MENU_ITEMS.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className={`group flex items-center justify-between rounded-lg px-2 py-2.5 font-sans text-[19px] font-normal tracking-tight transition-colors ${
                          active
                            ? "text-obsidian"
                            : "text-obsidian/75 hover:text-cobalt"
                        }`}
                      >
                        <span className="transition-transform duration-200 group-hover:translate-x-1.5">
                          {item.label}
                        </span>
                        {active ? (
                          <span
                            className="h-2 w-2 rounded-full bg-obsidian"
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            className="text-sm text-cobalt opacity-0 transition-opacity group-hover:opacity-100"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Card 2: White Briefings / Quick Contact Card */}
            <div className="rounded-[12px] bg-white p-5 shadow-2xl shadow-black/15">
              <p className="font-display text-[22px] leading-[1.15] font-normal tracking-tight text-obsidian">
                Request project
                <br />
                briefing
              </p>

              {quickSent ? (
                <p className="mt-3 rounded-xl bg-alabaster px-3.5 py-2.5 font-mono text-[11px] text-cobalt">
                  ✓ Logged for Agra corporate desk.
                </p>
              ) : (
                <form onSubmit={handleQuickSubmit} className="mt-4">
                  <div className="flex items-center rounded-[14px] bg-alabaster px-3.5 py-2.5 focus-within:ring-2 focus-within:ring-cobalt">
                    <label htmlFor="menu-quick-email" className="sr-only">
                      Your email or mobile
                    </label>
                    <input
                      id="menu-quick-email"
                      type="text"
                      value={quickInput}
                      onChange={(e) => setQuickInput(e.target.value)}
                      placeholder="Your email or +91"
                      className="w-full bg-transparent text-xs text-obsidian placeholder:text-muted/70 focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Send briefing request"
                      className="ml-2 text-base text-obsidian transition hover:translate-x-0.5 hover:text-cobalt"
                    >
                      →
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-3.5 flex items-center justify-between border-t border-black/5 pt-3 font-mono text-[10px]">
                <span className="text-muted">ISO 9001:2015 DNV</span>
                <a
                  href={COMPANY_INFO.documents.fraudWarningPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral hover:underline"
                >
                  Fraud Notice PDF ↗
                </a>
              </div>
            </div>

            {/* Card 3: Obsidian Black Accent Card (Lusion LABS ↗ equivalent) */}
            <Link
              href="/projects"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center justify-between rounded-[12px] bg-obsidian px-5 py-4 text-white shadow-2xl shadow-black/25 transition-colors hover:bg-cobalt"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/30 font-mono text-[10px]"
                >
                  137
                </span>
                <span className="font-sans text-[15px] font-medium tracking-[0.06em] uppercase">
                  PROJECTS LEDGER
                </span>
              </div>
              <span className="text-lg transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
