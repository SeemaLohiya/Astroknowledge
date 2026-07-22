import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logNotification } from "@/lib/notifications-store";
import { paymentsStore } from "@/lib/payments-store";
import { verifyRazorpaySignature } from "@/lib/razorpay";

/**
 * Razorpay Standard Checkout — verify HMAC signature.
 * When `paymentId` is sent, marks the app payment as paid after verification.
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const razorpayOrderId = body.razorpay_order_id || body.razorpayOrderId;
  const razorpayPaymentId = body.razorpay_payment_id || body.razorpayPaymentId;
  const razorpaySignature = body.razorpay_signature || body.razorpaySignature;
  const paymentId = body.paymentId as string | undefined;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json(
      { error: "razorpay_order_id, razorpay_payment_id, and razorpay_signature are required" },
      { status: 400 }
    );
  }

  if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
    return NextResponse.json({ error: "Payment verification failed", success: false }, { status: 400 });
  }

  if (!paymentId) {
    return NextResponse.json({ success: true, verified: true });
  }

  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await paymentsStore.getById(paymentId);
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  const payment = await paymentsStore.confirmRazorpayPayment(paymentId, {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });
  if (!payment) {
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }

  await logNotification({
    type: "payment_received",
    userId: session.userId,
    userName: session.name,
    referenceId: payment.id,
    message: `${session.name} paid ₹${payment.amount} via Razorpay`,
    channel: "system",
  });

  return NextResponse.json({
    success: true,
    verified: true,
    payment,
    message: "Payment successful! Calendar booking is now unlocked.",
  });
}
