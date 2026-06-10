import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addressesStore } from "@/lib/addresses-store";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const address = addressesStore.update(id, session.userId, body);
  if (!address) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ address });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const ok = addressesStore.delete(id, session.userId);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
