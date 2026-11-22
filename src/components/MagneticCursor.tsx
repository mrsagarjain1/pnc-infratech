"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/device";

/**
 * Lusion-inspired minimal magnetic cursor dot that smoothly expands into an
 * electric-cobalt contextual pill badge over elements with `data-cursor="..."`.
 */
export function MagneticCursor() {
  const finePointer = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setLabel(null));
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!finePointer || reduced) return;

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let rafId = 0;

    const inspectAt = (x: number, y: number) => {
      const hit = document.elementFromPoint(x, y) as HTMLElement | null;
      const el = hit?.closest<HTMLElement>("[data-cursor]");
      setLabel(el?.dataset.cursor ?? null);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setActive(true);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-cursor]",
      );
      setLabel(el?.dataset.cursor ?? null);
    };

    const onScroll = () => {
      if (target.x >= 0 && target.y >= 0) {
        inspectAt(target.x, target.y);
      }
    };

    const onLeave = () => {
      setActive(false);
      setLabel(null);
    };

    const loop = () => {
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      }
      rafId = window.requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    rafId = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, [finePointer, reduced]);

  if (!finePointer || reduced) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 z-[80] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {label ? (
        <div className="flex items-center gap-1.5 rounded-full bg-cobalt px-3.5 py-1.5 font-mono text-[10px] font-medium tracking-[0.12em] text-white uppercase shadow-[0_10px_28px_rgba(26,47,251,0.45)]">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          <span>{label}</span>
        </div>
      ) : (
        <div className="h-3 w-3 rounded-full bg-cobalt/85 ring-2 ring-white/80 shadow-sm" />
      )}
    </div>
  );
}
