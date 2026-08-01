import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logNotification } from "@/lib/notifications-store";
import { isBookingItemType, bookingStatusLabel, bookingStatusNote, consultancyStatusNote, isConsultancyItemType } from "@/lib/booking-order-status";
import { store } from "@/lib/store";
import { CartItemType, Order } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const order = await store.orders.findById(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.role !== "admin" && order.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ order });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status, note, trackingId, itemType } = (await req.json()) as {
    status: Order["status"];
    note?: string;
    trackingId?: string;
    itemType?: CartItemType;
  };

  const isBooking = isBookingItemType(itemType);
  const isConsultancy = isConsultancyItemType(itemType);
  const resolvedNote =
    note ||
    (isBooking
      ? bookingStatusNote(status, itemType!)
      : isConsultancy
        ? consultancyStatusNote(status)
        : `Status updated to ${status}`);

  const order = await store.orders.updateStatus(id, status, resolvedNote, isBooking ? undefined : trackingId);

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (isBooking) {
    if (status === "processing" || status === "delivered") {
      await logNotification({
        type: "order_shipped",
        userId: order.userId,
        userName: order.userName,
        referenceId: order.id,
        message: `${itemType === "pooja" ? "Pooja" : "Healing"} order: ${bookingStatusLabel(status, itemType)} for ${order.userName}`,
        channel: "whatsapp",
      });
    }
  } else if (status === "shipped" || status === "delivered") {
    await logNotification({
      type: "order_shipped",
      userId: order.userId,
      userName: order.userName,
      referenceId: order.id,
      message: `Order ${status} for ${order.userName}${trackingId ? ` (Tracking: ${trackingId})` : ""}`,
      channel: "whatsapp",
    });
  }

  return NextResponse.json({ order });
}
