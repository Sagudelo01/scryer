import { Suspense } from "react";
import type { Metadata } from "next";
import { getChampionData } from "@/lib/ddragon";
import { StreamView } from "@/components/room/StreamView";

export const metadata: Metadata = {
  title: "Stream Overlay — Scryer",
  description: "Read-only live draft overlay for broadcasts.",
};

async function StreamLoader({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ bg?: string }>;
}) {
  const { code } = await params;
  const { bg } = await searchParams;
  const data = await getChampionData();
  return <StreamView code={code.toUpperCase()} data={data} bg={bg ?? "transparent"} />;
}

export default function StreamPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ bg?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <StreamLoader params={params} searchParams={searchParams} />
    </Suspense>
  );
}
