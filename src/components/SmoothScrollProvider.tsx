"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/device";
import { soundEngine } from "@/lib/audio";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();
  const router = useRouter();
  const [curtainPhase, setCurtainPhase] = useState<"idle" | "in" | "out">("idle");
  const [curtainLabel, setCurtainLabel] = useState("");

  // 1. Lenis smooth scrolling + live scroll velocity broadcast for kinetic sections
  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    lenis.on("scroll", (ev: { velocity?: number }) => {
      ScrollTrigger.update();
      window.dispatchEvent(
        new CustomEvent("pnc-scroll-velocity", { detail: ev.velocity ?? 0 }),
      );
    });

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, [reducedMotion]);

  // 2. Full-screen Lusion Cobalt/Obsidian Page Transition Curtain triggered via `pnc-navigate`
  useEffect(() => {
    const onNavigate = (e: Event) => {
      const ce = e as CustomEvent<{ href: string; label?: string }>;
      const href = ce.detail?.href;
      if (!href || href === pathname) return;

      if (reducedMotion) {
        router.push(href);
        return;
      }

      soundEngine.playTransitionWhoosh();
      setCurtainLabel(ce.detail?.label ?? "LOADING");
      setCurtainPhase("in");

      window.setTimeout(() => {
        router.push(href);
        window.setTimeout(() => {
          setCurtainPhase("out");
          window.setTimeout(() => setCurtainPhase("idle"), 560);
        }, 120);
      }, 420);
    };

    window.addEventListener("pnc-navigate", onNavigate);
    return () => window.removeEventListener("pnc-navigate", onNavigate);
  }, [pathname, router, reducedMotion]);

  // 3. Reset scroll & refresh ScrollTrigger on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const id = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // 4. Dynamic header polarity detector (instant switch when obsidian bands cross top bar)
  useEffect(() => {
    const checkHeaderTheme = () => {
      const darkSections = document.querySelectorAll<HTMLElement>(
        "[data-theme='dark']",
      );
      let overDark = false;
      for (const sec of darkSections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= 64 && rect.bottom >= 24) {
          overDark = true;
          break;
        }
      }
      document.documentElement.dataset.headerTheme = overDark ? "dark" : "light";
      window.dispatchEvent(
        new CustomEvent("pnc-header-theme", {
          detail: overDark ? "dark" : "light",
        }),
      );
    };

    checkHeaderTheme();
    window.addEventListener("scroll", checkHeaderTheme, { passive: true });
    window.addEventListener("resize", checkHeaderTheme, { passive: true });
    return () => {
      window.removeEventListener("scroll", checkHeaderTheme);
      window.removeEventListener("resize", checkHeaderTheme);
    };
  }, [pathname]);

  return (
    <>
      {children}

      {/* Full-Screen Lusion Electric-Cobalt / Obsidian Route Transition Curtain */}
      {curtainPhase !== "idle" && (
        <div
          aria-hidden="true"
          className={`fixed inset-0 z-[88] flex flex-col justify-between bg-cobalt px-[max(4vw,24px)] py-8 text-white transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            curtainPhase === "in" ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex justify-between font-mono text-xs text-white/70">
            <span>+</span>
            <span>PNC INFRATECH</span>
            <span>+</span>
          </div>
          <div className="text-center">
            <p className="font-mono text-xs tracking-[0.18em] text-lime uppercase">
              TRANSITIONING CORRIDOR
            </p>
            <p className="lusion-display mt-2 text-[clamp(2.5rem,7vw,6rem)] text-white">
              {curtainLabel}
            </p>
          </div>
          <div className="flex justify-between font-mono text-xs text-white/70">
            <span>+</span>
            <span>NEXT CHAPTER</span>
            <span>+</span>
          </div>
        </div>
      )}
    </>
  );
}
