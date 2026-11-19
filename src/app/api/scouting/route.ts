import { NextResponse } from "next/server";
import {
  RiotError,
  getAccount,
  getMatch,
  getMatchIds,
  getTopMasteries,
  isRiotConfigured,
} from "@/lib/riot/client";
import { findRegion } from "@/lib/riot/regions";
import { buildScoutReport, type MatchLite } from "@/lib/scouting";

const TOP_CHAMPIONS = 8;
const RECENT_MATCHES = 20;

function errorResponse(code: string, status: number) {
  return NextResponse.json({ error: code }, { status });
}

export async function GET(request: Request) {
  if (!isRiotConfigured()) {
    return errorResponse("not_configured", 503);
  }

  const { searchParams } = new URL(request.url);
  const riotId = searchParams.get("riotId")?.trim() ?? "";
  const regionId = searchParams.get("region")?.trim() ?? "";

  const hashIndex = riotId.lastIndexOf("#");
  const gameName = hashIndex > 0 ? riotId.slice(0, hashIndex).trim() : "";
  const tagLine = hashIndex > 0 ? riotId.slice(hashIndex + 1).trim() : "";
  const region = findRegion(regionId);

  if (!gameName || !tagLine || !region) {
    return errorResponse("invalid_input", 400);
  }

  try {
    const account = await getAccount(gameName, tagLine, region.cluster);
    const [masteries, matchIds] = await Promise.all([
      getTopMasteries(account.puuid, region.platform, TOP_CHAMPIONS),
      getMatchIds(account.puuid, region.cluster, RECENT_MATCHES),
    ]);

    const matches = await Promise.all(matchIds.map((id) => getMatch(id, region.cluster)));
    const matchesLite: MatchLite[] = matches.map((match) => ({
      participants: match.info.participants.map((p) => ({
        puuid: p.puuid,
        championId: p.championId,
        win: p.win,
      })),
    }));

    const champions = buildScoutReport(masteries, matchesLite, account.puuid, TOP_CHAMPIONS);

    return NextResponse.json({
      riotId: `${gameName}#${tagLine}`,
      region: region.id,
      champions,
    });
  } catch (error) {
    if (error instanceof RiotError) {
      if (error.code === "config") return errorResponse("not_configured", 503);
      if (error.code === "not_found") return errorResponse("not_found", 404);
      if (error.code === "rate_limited") return errorResponse("rate_limited", 429);
      return errorResponse("upstream", 502);
    }
    return errorResponse("upstream", 502);
  }
}
