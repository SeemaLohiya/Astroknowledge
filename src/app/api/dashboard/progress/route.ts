import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth";
import { isBirthProfileComplete } from "@/lib/profile";
import { paymentsStore } from "@/lib/payments-store";
import { slotsStore } from "@/lib/slots-store";
import { store } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await store.users.findById(session.userId);
  const hasPaid = await paymentsStore.hasPaidAccess(session.userId);
  const userPayments = await paymentsStore.getByUser(session.userId);
  const hasAwaiting = userPayments.some((p) => p.status === "awaiting_approval");
  const bookings = await store.bookings.getByUser(session.userId);
  const slots = await slotsStore.getByUser(session.userId);
  const hasPendingBooking = bookings.some((b) => b.status === "pending") || slots.some((s) => s.status === "pending");
  const hasConfirmedBooking = bookings.some((b) => b.status === "confirmed" || b.status === "completed") || slots.some((s) => s.status === "booked");

  const steps = [
    { key: "account", done: true, href: "/dashboard/profile" },
    { key: "birth", done: isBirthProfileComplete(user), current: !isBirthProfileComplete(user), href: "/dashboard/profile" },
    { key: "purchase", done: userPayments.length > 0, href: "/services" },
    { key: "payment", done: hasPaid, current: hasAwaiting, href: "/dashboard/products" },
    { key: "book", done: bookings.length > 0 || slots.length > 0, href: "/dashboard/slots" },
    { key: "confirm", done: hasConfirmedBooking, current: hasPendingBooking, href: "/dashboard/services" },
  ];

  return NextResponse.json({ steps });
}
