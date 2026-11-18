import type { Metadata } from "next";
import { getChampionData } from "@/lib/ddragon";
import { DraftBoard } from "@/components/draft/DraftBoard";

export const metadata: Metadata = {
  title: "Fearless Draft — Scryer",
  description:
    "Draft a full best-of series with the Fearless ruleset. Champions picked in earlier games are locked for the rest of the series.",
};

export default async function DraftPage() {
  const data = await getChampionData();
  return <DraftBoard data={data} />;
}
