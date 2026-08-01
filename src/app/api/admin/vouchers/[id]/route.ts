import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { normalizeVoucherInput, validateVoucherInput } from "@/lib/voucher-input";
import { vouchersStore } from "@/lib/vouchers-store";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await vouchersStore.getById(id);
    if (!existing) return NextResponse.json({ error: "Voucher not found" }, { status: 404 });

    const body = await req.json();
    const input = normalizeVoucherInput({ ...existing, ...body });
    const validationError = validateVoucherInput(input);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

    const updated = await vouchersStore.update(id, input);
    if (!updated) return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    return NextResponse.json({ voucher: updated });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to update voucher" },
      { status: 400 }
    );
  }
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
