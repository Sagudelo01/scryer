import { z } from "zod";

/** Data Dragon `/api/versions.json` is a non-empty array of version strings. */
export const versionsSchema = z.array(z.string()).min(1);

/** A single champion entry inside Data Dragon's `champion.json`. */
export const rawChampionSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  title: z.string(),
  tags: z.array(z.string()),
});

/** The full `champion.json` payload; only `data` is required by Scryer. */
export const championResponseSchema = z.object({
  data: z.record(z.string(), rawChampionSchema),
});

export const championSchema = z.object({
  id: z.string(),
  key: z.string(),
  tags: z.array(z.string()),
  names: z.record(z.string(), z.string()),
});

export const gameResultSchema = z.object({
  bluePicks: z.array(z.string()),
  redPicks: z.array(z.string()),
});

/** Shape of a single game's draft state kept in the client. */
export const draftStateSchema = z.object({
  assignments: z.array(z.string().nullable()),
  cursor: z.number().int().nonnegative(),
  history: z.array(gameResultSchema),
});

/** Raw `rooms` row as returned by Supabase (snake_case columns). */
export const roomRowSchema = z.object({
  id: z.string(),
  code: z.string(),
  status: z.enum(["waiting", "drafting", "complete"]),
  blue_captain: z.string().nullable(),
  red_captain: z.string().nullable(),
  state: draftStateSchema,
  updated_at: z.string(),
});

export type RawChampion = z.infer<typeof rawChampionSchema>;
export type DraftStateInput = z.infer<typeof draftStateSchema>;
export type RoomRow = z.infer<typeof roomRowSchema>;
