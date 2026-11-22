"use client";

import { useEffect, useState } from "react";

/**
 * Tracks whether a section container is near the viewport so secondary WebGL
 * canvases mount only when needed (keeping GPU usage low & avoiding browser
 * WebGL context limits).
 */
export function useNearViewport(
  ref: React.RefObject<Element | null>,
  rootMargin = "450px 0px",
): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setNear(entry.isIntersecting);
      },
      { rootMargin },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);

  return near;
}
