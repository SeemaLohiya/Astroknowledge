import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { catalogStore } from "@/lib/catalog-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { categories: catalogStore.getCategories() },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const category = catalogStore.createCategory(body);
  return NextResponse.json({ category }, { status: 201 });
}
