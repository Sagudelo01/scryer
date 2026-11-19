import { accountSchema, masteryListSchema, matchIdsSchema, matchSchema } from "./schemas";
import type { RiotCluster } from "./regions";

export type RiotErrorCode = "config" | "not_found" | "rate_limited" | "upstream";

export class RiotError extends Error {
  constructor(
    public code: RiotErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "RiotError";
  }
}

export function isRiotConfigured(): boolean {
  return Boolean(process.env.RIOT_API_KEY);
}

const DAY = 60 * 60 * 24;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple limiter to stay under a development key's burst limit (20 req/s):
// cap concurrency and keep a minimum spacing between dispatches.
const MAX_CONCURRENT = 8;
const MIN_INTERVAL_MS = 55;
let active = 0;
let lastStart = 0;
const waiters: (() => void)[] = [];

async function acquire(): Promise<void> {
  while (active >= MAX_CONCURRENT) {
    await new Promise<void>((resolve) => waiters.push(resolve));
  }
  active += 1;
  const now = Date.now();
  const wait = Math.max(0, lastStart + MIN_INTERVAL_MS - now);
  lastStart = Math.max(now, lastStart + MIN_INTERVAL_MS);
  if (wait > 0) await sleep(wait);
}

function release(): void {
  active -= 1;
  waiters.shift()?.();
}

async function riotFetch(url: string, revalidate: number): Promise<unknown> {
  const key = process.env.RIOT_API_KEY;
  if (!key) throw new RiotError("config", "RIOT_API_KEY is not set");

  await acquire();
  try {
    for (let attempt = 0; ; attempt += 1) {
      const res = await fetch(url, {
        headers: { "X-Riot-Token": key },
        next: { revalidate },
      });
      if (res.status === 429 && attempt < 2) {
        const retryAfter = Number(res.headers.get("retry-after") ?? "1");
        await sleep(Math.min(Number.isFinite(retryAfter) ? retryAfter : 1, 10) * 1000);
        continue;
      }
      if (res.status === 429) throw new RiotError("rate_limited", "Riot rate limit reached");
      if (res.status === 404) throw new RiotError("not_found", "Resource not found");
      if (!res.ok) throw new RiotError("upstream", `Riot API error ${res.status}`);
      return (await res.json()) as unknown;
    }
  } finally {
    release();
  }
}

const host = (prefix: string) => `https://${prefix}.api.riotgames.com`;

export async function getAccount(gameName: string, tagLine: string, cluster: RiotCluster) {
  const url = `${host(cluster)}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName,
  )}/${encodeURIComponent(tagLine)}`;
  return accountSchema.parse(await riotFetch(url, DAY));
}

export async function getTopMasteries(puuid: string, platform: string, count: number) {
  const url = `${host(platform)}/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`;
  return masteryListSchema.parse(await riotFetch(url, 60 * 10));
}

export async function getMatchIds(puuid: string, cluster: RiotCluster, count: number) {
  const url = `${host(cluster)}/lol/match/v5/matches/by-puuid/${puuid}/ids?count=${count}`;
  return matchIdsSchema.parse(await riotFetch(url, 60 * 5));
}

export async function getMatch(matchId: string, cluster: RiotCluster) {
  const url = `${host(cluster)}/lol/match/v5/matches/${matchId}`;
  return matchSchema.parse(await riotFetch(url, DAY));
}
