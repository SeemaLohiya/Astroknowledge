import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { vouchersStore } from "@/lib/vouchers-store";
import { Voucher } from "@/lib/types";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await req.json()) as Partial<Voucher>;
  const updated = await vouchersStore.update(id, body);
  if (!updated) return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
  return NextResponse.json({ voucher: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ok = await vouchersStore.delete(id);
  if (!ok) return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
