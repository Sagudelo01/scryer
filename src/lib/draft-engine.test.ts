import { describe, expect, it } from "vitest";
import { DRAFT_SEQUENCE } from "./draft-sequence";
import {
  confirmGame,
  createInitialState,
  currentStep,
  fearlessLocked,
  gameNumber,
  getAssignment,
  isComplete,
  isUnavailable,
  parseDraftState,
  resetGame,
  resetSeries,
  select,
  undo,
} from "./draft-engine";
import type { DraftState } from "./types";

/** Champion ids c1..c20, one per draft step. */
const ids = Array.from({ length: DRAFT_SEQUENCE.length }, (_, i) => `c${i + 1}`);

function playFullGame(start: DraftState, championIds: string[]): DraftState {
  return championIds.reduce((state, id) => select(state, id), start);
}

describe("DRAFT_SEQUENCE", () => {
  it("has 20 steps: 10 bans and 10 picks", () => {
    expect(DRAFT_SEQUENCE).toHaveLength(20);
    expect(DRAFT_SEQUENCE.filter((s) => s.type === "ban")).toHaveLength(10);
    expect(DRAFT_SEQUENCE.filter((s) => s.type === "pick")).toHaveLength(10);
  });

  it("gives each team five bans and five picks", () => {
    for (const team of ["blue", "red"] as const) {
      expect(DRAFT_SEQUENCE.filter((s) => s.team === team && s.type === "ban")).toHaveLength(5);
      expect(DRAFT_SEQUENCE.filter((s) => s.team === team && s.type === "pick")).toHaveLength(5);
    }
  });

  it("opens with six bans, blue first", () => {
    const firstSix = DRAFT_SEQUENCE.slice(0, 6);
    expect(firstSix.every((s) => s.type === "ban")).toBe(true);
    expect(firstSix.map((s) => s.team)).toEqual(["blue", "red", "blue", "red", "blue", "red"]);
  });

  it("gives blue the first pick of the game", () => {
    const firstPick = DRAFT_SEQUENCE.find((s) => s.type === "pick");
    expect(firstPick).toEqual({ team: "blue", type: "pick", slot: 0 });
  });
});

describe("select", () => {
  it("assigns the champion to the current step and advances the cursor", () => {
    const state = select(createInitialState(), "Aatrox");
    expect(state.cursor).toBe(1);
    expect(state.assignments[0]).toBe("Aatrox");
    expect(getAssignment(state, "blue", "ban", 0)).toBe("Aatrox");
  });

  it("cannot reuse a champion already banned or picked in the same game", () => {
    const state = select(createInitialState(), "Aatrox");
    const again = select(state, "Aatrox");
    expect(again).toBe(state);
    expect(again.cursor).toBe(1);
  });

  it("ignores selections once the draft is complete", () => {
    const complete = playFullGame(createInitialState(), ids);
    expect(isComplete(complete)).toBe(true);
    expect(currentStep(complete)).toBeNull();
    const after = select(complete, "Teemo");
    expect(after).toBe(complete);
  });

  it("walks the standard ban/pick order", () => {
    let state = createInitialState();
    expect(currentStep(state)).toEqual({ team: "blue", type: "ban", slot: 0 });
    state = select(state, ids[0]);
    expect(currentStep(state)).toEqual({ team: "red", type: "ban", slot: 0 });
  });
});

describe("undo and reset", () => {
  it("undo steps back and clears the last assignment", () => {
    const state = select(select(createInitialState(), "Ahri"), "Zed");
    const back = undo(state);
    expect(back.cursor).toBe(1);
    expect(back.assignments[1]).toBeNull();
    expect(back.assignments[0]).toBe("Ahri");
  });

  it("undo on an empty draft is a no-op", () => {
    const state = createInitialState();
    expect(undo(state)).toBe(state);
  });

  it("resetGame clears the current game but keeps series history", () => {
    const afterGame = confirmGame(playFullGame(createInitialState(), ids));
    const inProgress = select(afterGame, "Lux");
    const reset = resetGame(inProgress);
    expect(reset.cursor).toBe(0);
    expect(reset.assignments.every((a) => a === null)).toBe(true);
    expect(reset.history).toHaveLength(1);
  });

  it("resetSeries wipes everything back to game one", () => {
    const afterGame = confirmGame(playFullGame(createInitialState(), ids));
    expect(gameNumber(afterGame)).toBe(2);
    const fresh = resetSeries();
    expect(fresh.history).toHaveLength(0);
    expect(gameNumber(fresh)).toBe(1);
  });
});

describe("confirmGame", () => {
  it("is a no-op before the draft is complete", () => {
    const state = select(createInitialState(), "Jinx");
    expect(confirmGame(state)).toBe(state);
  });

  it("records picks and bans, five per team, and starts the next game", () => {
    const state = confirmGame(playFullGame(createInitialState(), ids));
    expect(state.history).toHaveLength(1);
    expect(gameNumber(state)).toBe(2);
    expect(state.cursor).toBe(0);

    const { bluePicks, redPicks, blueBans, redBans } = state.history[0];
    expect(bluePicks).toEqual(["c7", "c10", "c11", "c18", "c19"]);
    expect(redPicks).toEqual(["c8", "c9", "c12", "c17", "c20"]);
    expect(blueBans).toEqual(["c1", "c3", "c5", "c14", "c16"]);
    expect(redBans).toEqual(["c2", "c4", "c6", "c13", "c15"]);
    expect(bluePicks).toHaveLength(5);
    expect(redBans).toHaveLength(5);
  });
});

describe("Fearless rule across games", () => {
  it("locks champions picked in a previous game", () => {
    const afterGame1 = confirmGame(playFullGame(createInitialState(), ids));
    const lockedPick = afterGame1.history[0].bluePicks[0]; // "c7"

    expect(fearlessLocked(afterGame1).has(lockedPick)).toBe(true);
    expect(isUnavailable(afterGame1, lockedPick)).toBe(true);

    // Trying to use a locked champion in game 2 is rejected.
    const attempt = select(afterGame1, lockedPick);
    expect(attempt).toBe(afterGame1);
    expect(attempt.cursor).toBe(0);
  });

  it("does not lock champions that were only banned", () => {
    const afterGame1 = confirmGame(playFullGame(createInitialState(), ids));
    const bannedOnly = ids[0]; // step 0 is a ban, never a pick

    expect(fearlessLocked(afterGame1).has(bannedOnly)).toBe(false);
    expect(isUnavailable(afterGame1, bannedOnly)).toBe(false);

    const used = select(afterGame1, bannedOnly);
    expect(used.cursor).toBe(1);
    expect(used.assignments[0]).toBe(bannedOnly);
  });

  it("accumulates locked champions across several games", () => {
    let state = confirmGame(playFullGame(createInitialState(), ids));
    const secondGameIds = ids.map((_, i) => `d${i + 1}`);
    state = confirmGame(playFullGame(state, secondGameIds));

    expect(state.history).toHaveLength(2);
    // 5 picks per team per game, over two games.
    expect(fearlessLocked(state).size).toBe(20);
    expect(isUnavailable(state, "c7")).toBe(true);
    expect(isUnavailable(state, "d7")).toBe(true);
  });
});

describe("parseDraftState", () => {
  it("accepts a valid state", () => {
    const state = createInitialState();
    expect(() => parseDraftState(state)).not.toThrow();
  });

  it("rejects a malformed state", () => {
    expect(() => parseDraftState({ assignments: "nope", cursor: -1 })).toThrow();
  });
});
