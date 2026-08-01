import { NextResponse } from "next/server";
import { getSession, sanitizeUser } from "@/lib/auth";
import { paymentsStore } from "@/lib/payments-store";
import { slotsStore } from "@/lib/slots-store";
import { store } from "@/lib/store";
import { addressesStore } from "@/lib/addresses-store";
import { vouchersStore } from "@/lib/vouchers-store";
import { isVoucherAssignedToUser } from "@/lib/voucher-users";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const user = await store.users.findById(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const vouchers = await vouchersStore.getAll();
  const assignedVouchers = vouchers.filter((v) => isVoucherAssignedToUser(v, id));
  const payments = await paymentsStore.getByUser(id);
  const usedVoucherCodes = [
    ...new Set(payments.map((p) => p.voucherCode).filter(Boolean) as string[]),
  ];
  const usedVouchers = vouchers.filter(
    (v) => usedVoucherCodes.includes(v.code) || (isVoucherAssignedToUser(v, id) && v.usedCount > 0)
  );

  return NextResponse.json({
    user: sanitizeUser(user),
    bookings: await store.bookings.getByUser(id),
    orders: await store.orders.getByUser(id),
    payments,
    slots: (await slotsStore.getAll()).filter((s) => s.userId === id),
    addresses: await addressesStore.getByUser(id),
    vouchersAssigned: assignedVouchers,
    vouchersUsed: usedVouchers,
  });
}
