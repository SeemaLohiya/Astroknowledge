import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logNotification } from "@/lib/notifications-store";
import { paymentsStore } from "@/lib/payments-store";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const payment = paymentsStore.getById(id);
  if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (session.role !== "admin" && payment.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ payment });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const adminComment = typeof body.adminComment === "string" ? body.adminComment : undefined;

  if (body.action === "approve") {
    const payment = paymentsStore.approvePayment(id, adminComment);
    if (!payment) return NextResponse.json({ error: "Cannot approve" }, { status: 400 });
    logNotification({
      type: "payment_approved",
      userId: payment.userId,
      userName: payment.userName,
      referenceId: payment.id,
      message: adminComment?.trim()
        ? `Payment approved for ${payment.userName} (₹${payment.amount}). Note: ${adminComment.trim()}`
        : `Payment approved for ${payment.userName} (₹${payment.amount})`,
      channel: "whatsapp",
    });
    return NextResponse.json({ payment, message: "Payment approved. User can now book slots." });
  }

  if (body.action === "reject") {
    const payment = paymentsStore.rejectPayment(id, adminComment);
    if (!payment) return NextResponse.json({ error: "Cannot reject" }, { status: 400 });
    logNotification({
      type: "payment_rejected",
      userId: payment.userId,
      userName: payment.userName,
      referenceId: payment.id,
      message: adminComment?.trim()
        ? `Payment rejected for ${payment.userName} (₹${payment.amount}). Reason: ${adminComment.trim()}`
        : `Payment rejected for ${payment.userName} (₹${payment.amount})`,
      channel: "system",
    });
    return NextResponse.json({ payment, message: "Payment rejected. User can resubmit." });
  }

  if (body.status) {
    const payment = paymentsStore.updateStatus(id, body.status);
    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ payment });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
