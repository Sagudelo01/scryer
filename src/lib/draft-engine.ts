import { DRAFT_SEQUENCE } from "./draft-sequence";
import { draftStateSchema } from "./schemas";
import type { ActionType, DraftState, DraftStep, GameResult, Team } from "./types";

/** A fresh, empty draft with no completed games. */
export function createInitialState(): DraftState {
  return {
    assignments: Array<string | null>(DRAFT_SEQUENCE.length).fill(null),
    cursor: 0,
    history: [],
  };
}

/** Validate an untrusted draft state (e.g. restored from storage). */
export function parseDraftState(value: unknown): DraftState {
  return draftStateSchema.parse(value);
}

export function isComplete(state: DraftState): boolean {
  return state.cursor >= DRAFT_SEQUENCE.length;
}

export function currentStep(state: DraftState): DraftStep | null {
  return isComplete(state) ? null : DRAFT_SEQUENCE[state.cursor];
}

export function gameNumber(state: DraftState): number {
  return state.history.length + 1;
}

/** Champions picked in any previous game — unavailable under the Fearless rule. */
export function fearlessLocked(state: DraftState): Set<string> {
  const locked = new Set<string>();
  for (const game of state.history) {
    game.bluePicks.forEach((id) => locked.add(id));
    game.redPicks.forEach((id) => locked.add(id));
  }
  return locked;
}

/** Champions already banned or picked in the current game. */
export function usedThisGame(state: DraftState): Set<string> {
  const used = new Set<string>();
  for (const id of state.assignments) {
    if (id) used.add(id);
  }
  return used;
}

export function isUnavailable(state: DraftState, championId: string): boolean {
  return fearlessLocked(state).has(championId) || usedThisGame(state).has(championId);
}

/** Assign a champion to the current step and advance. No-op if unavailable. */
export function select(state: DraftState, championId: string): DraftState {
  if (isComplete(state)) return state;
  if (isUnavailable(state, championId)) return state;
  const assignments = [...state.assignments];
  assignments[state.cursor] = championId;
  return { ...state, assignments, cursor: state.cursor + 1 };
}

/** Step back one action, clearing the last assignment. */
export function undo(state: DraftState): DraftState {
  if (state.cursor === 0) return state;
  const assignments = [...state.assignments];
  assignments[state.cursor - 1] = null;
  return { ...state, assignments, cursor: state.cursor - 1 };
}

/** Clear the current game's picks and bans without touching the series. */
export function resetGame(state: DraftState): DraftState {
  return { ...state, assignments: createInitialState().assignments, cursor: 0 };
}

/** Lock the completed game's picks into series history and start the next game. */
export function confirmGame(state: DraftState): DraftState {
  if (!isComplete(state)) return state;
  const result = { bluePicks: [], redPicks: [], blueBans: [], redBans: [] } as GameResult;
  DRAFT_SEQUENCE.forEach((step, index) => {
    const id = state.assignments[index];
    if (!id) return;
    if (step.type === "pick") {
      (step.team === "blue" ? result.bluePicks : result.redPicks).push(id);
    } else {
      (step.team === "blue" ? result.blueBans : result.redBans).push(id);
    }
  });
  return {
    assignments: createInitialState().assignments,
    cursor: 0,
    history: [...state.history, result],
  };
}

/** Wipe the whole series back to game one. */
export function resetSeries(): DraftState {
  return createInitialState();
}

/** Champion id assigned to a given team/type/slot in the current game. */
export function getAssignment(
  state: DraftState,
  team: Team,
  type: ActionType,
  slot: number,
): string | null {
  const index = DRAFT_SEQUENCE.findIndex(
    (step) => step.team === team && step.type === type && step.slot === slot,
  );
  return index === -1 ? null : state.assignments[index];
}

export function isActiveSlot(
  state: DraftState,
  team: Team,
  type: ActionType,
  slot: number,
): boolean {
  const step = currentStep(state);
  return step?.team === team && step?.type === type && step?.slot === slot;
}
