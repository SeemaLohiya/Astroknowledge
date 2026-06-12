import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { catalogStore } from "@/lib/catalog-store";
import { CatalogType } from "@/lib/types";

const VALID_TYPES: CatalogType[] = ["products", "services", "courses", "pooja", "healing"];

function isValidType(type: string): type is CatalogType {
  return VALID_TYPES.includes(type as CatalogType);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, id } = await params;
  if (!isValidType(type)) return NextResponse.json({ error: "Invalid catalog type" }, { status: 400 });

  const body = await req.json();
  const item = await catalogStore.update(type, id, body);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ type: string; id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type, id } = await params;
  if (!isValidType(type)) return NextResponse.json({ error: "Invalid catalog type" }, { status: 400 });

  const ok = await catalogStore.delete(type, id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
