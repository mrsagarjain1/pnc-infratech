"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/device";

const SESSION_KEY = "pnc_lusion_preloaded_v1";

/**
 * Crisp 00 -> 100 Lusion-inspired obsidian/cobalt architectural opening preloader.
 * Runs once per browser session and lifts cleanly in ~1s.
 */
export function Preloader() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [lifting, setLifting] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (reduced) return;
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // sessionStorage blocked; still animate once
    }

    const startId = window.requestAnimationFrame(() => {
      setVisible(true);
    });

    const start = performance.now();
    const duration = 920;
    let rafId = 0;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setPct(Math.round(eased * 100));

      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        window.setTimeout(() => setLifting(true), 90);
        window.setTimeout(() => setVisible(false), 760);
      }
    };

    rafId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(startId);
      window.cancelAnimationFrame(rafId);
    };
  }, [reduced]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[90] flex flex-col justify-between bg-obsidian px-[max(4vw,24px)] py-8 text-white transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        lifting ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Top registration row */}
      <div className="flex items-center justify-between font-mono text-xs tracking-[0.16em] text-white/60 uppercase">
        <span>+</span>
        <span>PNC INFRATECH LIMITED · EST. 1999</span>
        <span>+</span>
      </div>

      {/* Center giant Lusion numeric counter & cobalt/lime calibration bar */}
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.16em] text-lime uppercase">
              INITIALIZING 3D ARTERIAL CORRIDOR
            </p>
            <p className="mt-2 font-mono text-xs text-white/55">
              CH. {String(Math.round(pct * 3.91)).padStart(3, "0")}+000 // 137
              MANDATES · 16 STATES
            </p>
          </div>
          <div className="lusion-display text-[clamp(4.5rem,13vw,11rem)] leading-none tabular-nums text-white">
            {String(pct).padStart(2, "0")}
          </div>
        </div>

        <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full bg-gradient-to-r from-cobalt via-cyan-arc to-lime transition-all duration-75"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Bottom registration row */}
      <div className="flex items-center justify-between font-mono text-xs tracking-[0.16em] text-white/50 uppercase">
        <span>+</span>
        <span>ISO 9001:2015 DNV · MES &ldquo;SS&rdquo; CLASS</span>
        <span>+</span>
      </div>
    </div>
  );
}
