import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { slotsStore } from "@/lib/slots-store";
import { store } from "@/lib/store";
import { UnifiedBookingItem } from "@/lib/types";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const legacy: UnifiedBookingItem[] = (await store.bookings
    .getByUser(session.userId))
    .filter((b) => b.status !== "cancelled")
    .map((b) => ({
    id: b.id,
    source: "request" as const,
    serviceName: b.serviceName,
    date: b.date,
    time: b.time,
    status: b.status,
    createdAt: b.createdAt,
  }));

  const slots: UnifiedBookingItem[] = (await slotsStore.getByUser(session.userId)).map((s) => ({
    id: s.id,
    source: "slot" as const,
    serviceName: s.serviceName || "Consultation",
    date: s.date,
    time: s.time,
    status: s.status === "pending" ? "pending" : s.status === "booked" ? "confirmed" : "cancelled",
    createdAt: s.bookedAt || s.createdAt,
  }));

  const bookings = [...legacy, ...slots].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return NextResponse.json({ bookings });
}
