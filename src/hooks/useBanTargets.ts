"use client";

import { useCallback, useState } from "react";

export function useBanTargets() {
  const [banTargets, setBanTargets] = useState<Set<string>>(() => new Set());

  const toggle = useCallback((id: string) => {
    setBanTargets((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const markAll = useCallback((ids: string[]) => {
    setBanTargets((prev) => new Set([...prev, ...ids]));
  }, []);

  const clear = useCallback(() => setBanTargets(new Set()), []);

  return { banTargets, toggle, markAll, clear };
}
