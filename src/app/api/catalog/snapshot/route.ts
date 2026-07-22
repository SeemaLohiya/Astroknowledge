import { NextResponse } from "next/server";
import { catalogStore } from "@/lib/catalog-store";

export const revalidate = 60;

/** Single round-trip for all catalog data — used to warm client caches. */
export async function GET() {
  const snapshot = await catalogStore.getSnapshot();
  return NextResponse.json(
    { catalog: snapshot },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
