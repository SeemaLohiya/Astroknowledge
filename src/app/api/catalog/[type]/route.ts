import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { catalogStore } from "@/lib/catalog-store";
import { CatalogType } from "@/lib/types";

export const dynamic = "force-dynamic";

const VALID_TYPES: CatalogType[] = ["products", "services", "courses", "pooja", "healing"];

function isValidType(type: string): type is CatalogType {
  return VALID_TYPES.includes(type as CatalogType);
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isValidType(type)) return NextResponse.json({ error: "Invalid catalog type" }, { status: 400 });
  return NextResponse.json(
    { items: await catalogStore.getAll(type) },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ type: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type } = await params;
  if (!isValidType(type)) return NextResponse.json({ error: "Invalid catalog type" }, { status: 400 });

  const body = await req.json();
  const item = await catalogStore.create(type, body);
  return NextResponse.json({ item }, { status: 201 });
}
