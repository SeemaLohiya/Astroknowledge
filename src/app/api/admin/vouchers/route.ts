import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { normalizeVoucherInput, validateVoucherInput } from "@/lib/voucher-input";
import { vouchersStore } from "@/lib/vouchers-store";
import { isVoucherAssignedToUser } from "@/lib/voucher-users";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const status = searchParams.get("status") || "all";
  const userId = searchParams.get("userId") || "";

  let vouchers = await vouchersStore.getAll();

  if (search) {
    vouchers = vouchers.filter(
      (v) =>
        v.code.toLowerCase().includes(search) ||
        v.label.toLowerCase().includes(search) ||
        (v.description || "").toLowerCase().includes(search)
    );
  }
  if (userId) vouchers = vouchers.filter((v) => isVoucherAssignedToUser(v, userId));
  if (status === "active") vouchers = vouchers.filter((v) => v.active);
  if (status === "inactive") vouchers = vouchers.filter((v) => !v.active);

  return NextResponse.json({ vouchers });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const input = normalizeVoucherInput(body);
    const validationError = validateVoucherInput(input);
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
    const voucher = await vouchersStore.create(input);
    return NextResponse.json({ voucher }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create voucher" },
      { status: 400 }
    );
  }
}
