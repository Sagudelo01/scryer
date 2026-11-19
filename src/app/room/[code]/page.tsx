import { Suspense } from "react";
import type { Metadata } from "next";
import { getChampionData } from "@/lib/ddragon";
import { OnlineDraftBoard } from "@/components/room/OnlineDraftBoard";

export const metadata: Metadata = {
  title: "Live Draft Room — Scryer",
  description: "Draft a Fearless series in real time with another captain.",
};

async function RoomLoader({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await getChampionData();
  return <OnlineDraftBoard code={code.toUpperCase()} data={data} />;
}

export default function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense fallback={<div className="text-ink-dim px-6 py-12 text-center">Loading…</div>}>
      <RoomLoader params={params} />
    </Suspense>
  );
}
