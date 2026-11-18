"use client";

import { useCallback, useMemo, useState } from "react";
import * as engine from "@/lib/draft-engine";
import type { ActionType, DraftState, Team } from "@/lib/types";

export function useDraft() {
  const [state, setState] = useState<DraftState>(engine.createInitialState);

  const select = useCallback((championId: string) => {
    setState((prev) => engine.select(prev, championId));
  }, []);

  const undo = useCallback(() => setState(engine.undo), []);
  const resetGame = useCallback(() => setState(engine.resetGame), []);
  const confirmGame = useCallback(() => setState(engine.confirmGame), []);
  const resetSeries = useCallback(() => setState(engine.resetSeries), []);

  const fearlessLocked = useMemo(() => engine.fearlessLocked(state), [state]);
  const usedThisGame = useMemo(() => engine.usedThisGame(state), [state]);

  const isUnavailable = useCallback(
    (championId: string) => fearlessLocked.has(championId) || usedThisGame.has(championId),
    [fearlessLocked, usedThisGame],
  );

  const getAssignment = useCallback(
    (team: Team, type: ActionType, slot: number) => engine.getAssignment(state, team, type, slot),
    [state],
  );

  const isActiveSlot = useCallback(
    (team: Team, type: ActionType, slot: number) => engine.isActiveSlot(state, team, type, slot),
    [state],
  );

  return {
    assignments: state.assignments,
    history: state.history,
    cursor: state.cursor,
    gameNumber: engine.gameNumber(state),
    currentStep: engine.currentStep(state),
    isComplete: engine.isComplete(state),
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
