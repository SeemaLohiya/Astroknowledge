import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logNotification } from "@/lib/notifications-store";
import { store } from "@/lib/store";
import { Booking } from "@/lib/types";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status } = await req.json();
  const booking = await store.bookings.updateStatus(id, status as Booking["status"]);

  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status === "confirmed") {
    logNotification({
      type: "booking_confirmed",
      userId: booking.userId,
      userName: booking.userName,
      referenceId: booking.id,
      message: `Booking confirmed for ${booking.userName} — ${booking.serviceName} on ${booking.date}`,
      channel: "whatsapp",
    });
  }

  return NextResponse.json({ booking });
}
