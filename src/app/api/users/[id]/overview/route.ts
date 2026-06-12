import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { paymentsStore } from "@/lib/payments-store";
import { slotsStore } from "@/lib/slots-store";
import { store } from "@/lib/store";
import { addressesStore } from "@/lib/addresses-store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const user = await store.users.findById(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    bookings: await store.bookings.getByUser(id),
    orders: await store.orders.getByUser(id),
    payments: await paymentsStore.getByUser(id),
    slots: slotsStore.getAll().filter((s) => s.userId === id),
    addresses: addressesStore.getByUser(id),
  });
}
