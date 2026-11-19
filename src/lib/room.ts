import { DRAFT_SEQUENCE } from "./draft-sequence";
import { currentStep } from "./draft-engine";
import type { DraftState, Role, Room, Team } from "./types";

/** Team acting at each step; mirrors scryer_turn_order() in the SQL migration. */
export const DRAFT_TURN_ORDER: Team[] = DRAFT_SEQUENCE.map((step) => step.team);

export function roleForUid(
  room: Pick<Room, "blueCaptain" | "redCaptain">,
  uid: string | null,
): Role {
  if (uid && uid === room.blueCaptain) return "blue";
  if (uid && uid === room.redCaptain) return "red";
  return "spectator";
}

/** The team whose turn it is, or null when the draft is complete. */
export function turnTeam(state: DraftState): Team | null {
  return currentStep(state)?.team ?? null;
}

/** A captain may act only on their own team's turn. */
export function canAct(role: Role, state: DraftState): boolean {
  if (role === "spectator") return false;
  return turnTeam(state) === role;
}

export function isRoomFull(room: Pick<Room, "blueCaptain" | "redCaptain">): boolean {
  return Boolean(room.blueCaptain) && Boolean(room.redCaptain);
}
