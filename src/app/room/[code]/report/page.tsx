import { Suspense } from "react";
import type { Metadata } from "next";
import { getChampionData } from "@/lib/ddragon";
import { SeriesReport } from "@/components/room/SeriesReport";

export const metadata: Metadata = {
  title: "Series Report — Scryer",
  description: "Bans, picks and Fearless locks for every game of the series.",
};

async function ReportLoader({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const data = await getChampionData();
  return <SeriesReport code={code.toUpperCase()} data={data} />;
}

export default function ReportPage({ params }: { params: Promise<{ code: string }> }) {
  return (
    <Suspense fallback={<div className="text-ink-dim px-6 py-12 text-center">Loading…</div>}>
      <ReportLoader params={params} />
    </Suspense>
  );
}
