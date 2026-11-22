"use client";

import { useSyncExternalStore } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";
const SMALL_OR_TOUCH = "(max-width: 767px), (pointer: coarse)";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function subscribeTo(queries: string[]) {
  return (onChange: () => void) => {
    const lists = queries.map((q) => window.matchMedia(q));
    lists.forEach((m) => m.addEventListener("change", onChange));
    return () => lists.forEach((m) => m.removeEventListener("change", onChange));
  };
}

const subscribeReduced = subscribeTo([REDUCED]);
const subscribeMode = subscribeTo([REDUCED, SMALL_OR_TOUCH]);
const subscribePointer = subscribeTo([FINE_POINTER]);

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );
}

export function useFinePointer(): boolean {
  return useSyncExternalStore(
    subscribePointer,
    () => window.matchMedia(FINE_POINTER).matches,
    () => false,
  );
}

let webglSupport: boolean | undefined;
function hasWebGL(): boolean {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = !!(
        canvas.getContext("webgl2") || canvas.getContext("webgl")
      );
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

/**
 * pending: server render / first client pass (no canvas yet)
 * full:    desktop GPU, post-processing on
 * lite:    phones, touch devices or low core counts; cheaper scene, no post FX
 * static:  reduced motion or no WebGL; no 3D, stacked content
 */
export type SceneMode = "pending" | "full" | "lite" | "static";

function getSceneMode(): SceneMode {
  if (window.matchMedia(REDUCED).matches) return "static";
  if (!hasWebGL()) return "static";
  const cores = navigator.hardwareConcurrency ?? 8;
  if (window.matchMedia(SMALL_OR_TOUCH).matches || cores <= 4) return "lite";
  return "full";
}

export function useSceneMode(): SceneMode {
  return useSyncExternalStore(subscribeMode, getSceneMode, () => "pending");
}
