import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isBirthProfileComplete } from "@/lib/profile";
import { paymentsStore } from "@/lib/payments-store";
import { slotsStore } from "@/lib/slots-store";
import { store } from "@/lib/store";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = store.users.findById(session.userId);
  const hasPaid = paymentsStore.hasPaidAccess(session.userId);
  const hasAwaiting = paymentsStore.getByUser(session.userId).some((p) => p.status === "awaiting_approval");
  const bookings = store.bookings.getByUser(session.userId);
  const slots = slotsStore.getByUser(session.userId);
  const hasPendingBooking = bookings.some((b) => b.status === "pending") || slots.some((s) => s.status === "pending");
  const hasConfirmedBooking = bookings.some((b) => b.status === "confirmed" || b.status === "completed") || slots.some((s) => s.status === "booked");

  const steps = [
    { key: "account", done: true, href: "/dashboard/profile" },
    { key: "birth", done: isBirthProfileComplete(user), current: !isBirthProfileComplete(user), href: "/dashboard/profile" },
    { key: "purchase", done: paymentsStore.getByUser(session.userId).length > 0, href: "/services" },
    { key: "payment", done: hasPaid, current: hasAwaiting, href: "/dashboard/purchases" },
    { key: "book", done: bookings.length > 0 || slots.length > 0, href: "/dashboard/slots" },
    { key: "confirm", done: hasConfirmedBooking, current: hasPendingBooking, href: "/dashboard/bookings" },
  ];

  return NextResponse.json({ steps });
}
