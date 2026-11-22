"use client";

import Link from "next/link";
import { soundEngine } from "@/lib/audio";

interface LusionPillProps {
  label: string;
  href?: string;
  external?: boolean;
  onClick?: () => void;
  variant?: "light" | "dark";
  className?: string;
}

export function LusionPill({
  label,
  href,
  external,
  onClick,
  variant = "light",
  className = "",
}: LusionPillProps) {
  const classes = `lusion-pill ${
    variant === "dark" ? "lusion-pill-dark" : ""
  } ${className}`;

  const inner = (
    <>
      <span className="lusion-pill-dot" aria-hidden="true" />
      <span className="lusion-pill-label">{label}</span>
      <span className="lusion-pill-arrow" aria-hidden="true">
        →
      </span>
    </>
  );

  const onEnter = () => soundEngine.playHoverTick();
  const handleClick = () => {
    soundEngine.playClickConfirm();
    onClick?.();
  };

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={onEnter}
        onClick={() => soundEngine.playClickConfirm()}
        data-cursor="OPEN PDF"
        className={classes}
      >
        {inner}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        onMouseEnter={onEnter}
        onClick={() => soundEngine.playClickConfirm()}
        data-cursor="EXPLORE"
        className={classes}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onClick={handleClick}
      className={classes}
    >
      {inner}
    </button>
  );
}
