"use client";

import { useEffect } from "react";

/** Toggles a flag on <html> so CSS can pause ambient animation when hidden. */
export function VisibilityPauser() {
  useEffect(() => {
    const update = () => {
      document.documentElement.toggleAttribute("data-tab-hidden", document.hidden);
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return null;
}
