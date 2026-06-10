import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logNotification } from "@/lib/notifications-store";
import { store } from "@/lib/store";
import { Order } from "@/lib/types";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const order = store.orders.findById(id);
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
  const { status, note, trackingId } = await req.json();
  const order = store.orders.updateStatus(id, status as Order["status"], note, trackingId);

  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (status === "shipped" || status === "delivered") {
    logNotification({
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
