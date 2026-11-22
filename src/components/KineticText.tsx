"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/device";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+-#";

/**
 * Lusion-signature IBM Plex Mono character-scramble decoder on scroll-into-view
 * (and optional hover replay).
 */
export function ScrambleText({
  text,
  className = "",
  replayOnHover = false,
}: {
  text: string;
  className?: string;
  replayOnHover?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number>(0);

  const runScramble = () => {
    if (reduced) return;
    window.cancelAnimationFrame(frameRef.current);
    const totalFrames = 26;
    let frame = 0;

    const tick = () => {
      frame += 1;
      const progress = frame / totalFrames;
      const revealed = Math.floor(progress * text.length);

      let next = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " " || ch === "•" || ch === "·" || i < revealed) {
          next += ch;
        } else {
          const idx = (frame * 7 + i * 13) % SCRAMBLE_CHARS.length;
          next += SCRAMBLE_CHARS[idx];
        }
      }
      setDisplay(next);

      if (frame < totalFrames) {
        frameRef.current = window.requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };

    frameRef.current = window.requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (reduced || !ref.current || typeof IntersectionObserver === "undefined") {
      return;
    }
    let fired = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !fired) {
          fired = true;
          runScramble();
        }
      },
      { threshold: 0.25 },
    );
    obs.observe(ref.current);
    return () => {
      obs.disconnect();
      window.cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduced]);

  return (
    <span
      ref={ref}
      onMouseEnter={replayOnHover ? runScramble : undefined}
      className={className}
    >
      {display}
    </span>
  );
}

/**
 * Masked split-line vertical reveal inspired by Lusion's architectural display headings.
 */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className = "",
  indentFirst = false,
}: {
  lines: string[];
  as?: "h1" | "h2" | "h3";
  className?: string;
  indentFirst?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (reduced || !rootRef.current) return;
    const el = rootRef.current;
    const spans = el.querySelectorAll<HTMLElement>("[data-reveal-line]");

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spans,
        { yPercent: 112, opacity: 0.01 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.11,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 86%",
            once: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <Tag ref={rootRef} className={className}>
      {lines.map((line, i) => (
        <span
          key={line}
          className={`block overflow-hidden pb-[0.08em] ${
            indentFirst && i === 0 ? "sm:pl-[14%]" : ""
          }`}
        >
          <span data-reveal-line className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
