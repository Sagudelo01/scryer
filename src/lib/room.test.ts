import { describe, expect, it } from "vitest";
import { DRAFT_TURN_ORDER, canAct, isRoomFull, roleForUid, turnTeam } from "./room";
import type { DraftState } from "./types";

function stateAtCursor(cursor: number): DraftState {
  return { assignments: Array<string | null>(20).fill(null), cursor, history: [] };
}

describe("DRAFT_TURN_ORDER", () => {
  it("matches the order encoded in the SQL migration", () => {
    expect(DRAFT_TURN_ORDER).toEqual([
      "blue",
      "red",
      "blue",
      "red",
      "blue",
      "red",
      "blue",
      "red",
      "red",
      "blue",
      "blue",
      "red",
      "red",
      "blue",
      "red",
      "blue",
      "red",
      "blue",
      "blue",
      "red",
    ]);
  });
});

describe("turnTeam", () => {
  it("returns the team acting at the current cursor", () => {
    expect(turnTeam(stateAtCursor(0))).toBe("blue");
    expect(turnTeam(stateAtCursor(1))).toBe("red");
    expect(turnTeam(stateAtCursor(6))).toBe("blue");
    expect(turnTeam(stateAtCursor(8))).toBe("red");
    expect(turnTeam(stateAtCursor(19))).toBe("red");
  });

  it("returns null once the draft is complete", () => {
    expect(turnTeam(stateAtCursor(20))).toBeNull();
  });
});

describe("roleForUid", () => {
  const room = { blueCaptain: "uid-blue", redCaptain: "uid-red" };

  it("identifies captains and spectators", () => {
    expect(roleForUid(room, "uid-blue")).toBe("blue");
    expect(roleForUid(room, "uid-red")).toBe("red");
    expect(roleForUid(room, "uid-other")).toBe("spectator");
    expect(roleForUid(room, null)).toBe("spectator");
  });

  it("treats empty seats as spectators", () => {
    expect(roleForUid({ blueCaptain: null, redCaptain: null }, "uid")).toBe("spectator");
  });
});

describe("canAct", () => {
  it("lets a captain act only on their own turn", () => {
    const blueTurn = stateAtCursor(0);
    const redTurn = stateAtCursor(1);
    expect(canAct("blue", blueTurn)).toBe(true);
    expect(canAct("red", blueTurn)).toBe(false);
    expect(canAct("red", redTurn)).toBe(true);
    expect(canAct("blue", redTurn)).toBe(false);
  });

  it("never lets a spectator act", () => {
    expect(canAct("spectator", stateAtCursor(0))).toBe(false);
  });

  it("blocks all actions once the draft is complete", () => {
    const done = stateAtCursor(20);
    expect(canAct("blue", done)).toBe(false);
    expect(canAct("red", done)).toBe(false);
  });
});

describe("isRoomFull", () => {
  it("is true only when both captains are seated", () => {
    expect(isRoomFull({ blueCaptain: "a", redCaptain: "b" })).toBe(true);
    expect(isRoomFull({ blueCaptain: "a", redCaptain: null })).toBe(false);
    expect(isRoomFull({ blueCaptain: null, redCaptain: null })).toBe(false);
  });
});
