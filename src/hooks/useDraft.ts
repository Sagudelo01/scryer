"use client";

import { useCallback, useMemo, useState } from "react";
import { DRAFT_SEQUENCE } from "@/lib/draft-sequence";
import type { GameResult } from "@/lib/types";

interface DraftState {
  /** Champion id assigned to each step of the current game, or null if empty. */
  assignments: (string | null)[];
  /** Index of the next step to fill (equals sequence length when complete). */
  cursor: number;
  /** Picks from previous games of the series, locked by the Fearless rule. */
  history: GameResult[];
}

const emptyAssignments = () => Array<string | null>(DRAFT_SEQUENCE.length).fill(null);

export function useDraft() {
  const [state, setState] = useState<DraftState>({
    assignments: emptyAssignments(),
    cursor: 0,
    history: [],
  });

  const isComplete = state.cursor >= DRAFT_SEQUENCE.length;
  const currentStep = isComplete ? null : DRAFT_SEQUENCE[state.cursor];
  const gameNumber = state.history.length + 1;

  /** Champions picked in any previous game — unavailable under Fearless. */
  const fearlessLocked = useMemo(() => {
    const locked = new Set<string>();
    for (const game of state.history) {
      game.bluePicks.forEach((id) => locked.add(id));
      game.redPicks.forEach((id) => locked.add(id));
    }
    return locked;
  }, [state.history]);

  /** Champions already used (banned or picked) in the current game. */
  const usedThisGame = useMemo(() => {
    const used = new Set<string>();
    for (const id of state.assignments) {
      if (id) used.add(id);
    }
    return used;
  }, [state.assignments]);

  const isUnavailable = useCallback(
    (championId: string) => fearlessLocked.has(championId) || usedThisGame.has(championId),
    [fearlessLocked, usedThisGame],
  );

  const select = useCallback((championId: string) => {
    setState((prev) => {
      if (prev.cursor >= DRAFT_SEQUENCE.length) return prev;
      if (prev.assignments.includes(championId)) return prev;
      for (const game of prev.history) {
        if (game.bluePicks.includes(championId) || game.redPicks.includes(championId)) {
          return prev;
        }
      }
      const assignments = [...prev.assignments];
      assignments[prev.cursor] = championId;
      return { ...prev, assignments, cursor: prev.cursor + 1 };
    });
  }, []);

  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.cursor === 0) return prev;
      const assignments = [...prev.assignments];
      assignments[prev.cursor - 1] = null;
      return { ...prev, assignments, cursor: prev.cursor - 1 };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState((prev) => ({ ...prev, assignments: emptyAssignments(), cursor: 0 }));
  }, []);

  const confirmGame = useCallback(() => {
    setState((prev) => {
      if (prev.cursor < DRAFT_SEQUENCE.length) return prev;
      const bluePicks: string[] = [];
      const redPicks: string[] = [];
      DRAFT_SEQUENCE.forEach((step, index) => {
        const id = prev.assignments[index];
        if (!id || step.type !== "pick") return;
        if (step.team === "blue") bluePicks.push(id);
        else redPicks.push(id);
      });
      return {
        assignments: emptyAssignments(),
        cursor: 0,
        history: [...prev.history, { bluePicks, redPicks }],
      };
    });
  }, []);

  const resetSeries = useCallback(() => {
    setState({ assignments: emptyAssignments(), cursor: 0, history: [] });
  }, []);

  /** Champion id assigned to a given team/type/slot in the current game. */
  const getAssignment = useCallback(
    (team: "blue" | "red", type: "ban" | "pick", slot: number) => {
      const index = DRAFT_SEQUENCE.findIndex(
        (step) => step.team === team && step.type === type && step.slot === slot,
      );
      return index === -1 ? null : state.assignments[index];
    },
    [state.assignments],
  );

  const isActiveSlot = useCallback(
    (team: "blue" | "red", type: "ban" | "pick", slot: number) =>
      currentStep?.team === team && currentStep?.type === type && currentStep?.slot === slot,
    [currentStep],
  );

  return {
    assignments: state.assignments,
    history: state.history,
    cursor: state.cursor,
    gameNumber,
    currentStep,
    isComplete,
    fearlessLocked,
    usedThisGame,
    isUnavailable,
    select,
    undo,
    resetGame,
    confirmGame,
    resetSeries,
    getAssignment,
    isActiveSlot,
  };
}
