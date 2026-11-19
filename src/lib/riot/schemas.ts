import { z } from "zod";

export const accountSchema = z.object({
  puuid: z.string(),
  gameName: z.string().optional(),
  tagLine: z.string().optional(),
});

export const masteryListSchema = z.array(
  z.object({
    championId: z.number(),
    championLevel: z.number(),
    championPoints: z.number(),
  }),
);

export const matchIdsSchema = z.array(z.string());

export const matchSchema = z.object({
  info: z.object({
    queueId: z.number().optional(),
    participants: z.array(
      z.object({
        puuid: z.string(),
        championId: z.number(),
        championName: z.string().optional(),
        win: z.boolean(),
      }),
    ),
  }),
});

export type RiotAccount = z.infer<typeof accountSchema>;
export type RiotMatch = z.infer<typeof matchSchema>;
