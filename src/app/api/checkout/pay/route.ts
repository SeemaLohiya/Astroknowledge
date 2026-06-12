import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { logNotification } from "@/lib/notifications-store";
import { paymentsStore } from "@/lib/payments-store";
import { verifyRazorpaySignature } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const {
    paymentId,
    method,
    transactionRefId,
    paymentProofImage,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  } = await req.json();

  if (!paymentId || !method) {
    return NextResponse.json({ error: "paymentId and method required" }, { status: 400 });
  }

  const existing = await paymentsStore.getById(paymentId);
  if (!existing || existing.userId !== session.userId) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  if (method === "razorpay") {
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json({ error: "Razorpay payment details required" }, { status: 400 });
    }
    if (!verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const payment = await paymentsStore.confirmRazorpayPayment(paymentId, {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    if (!payment) return NextResponse.json({ error: "Failed to process" }, { status: 500 });

    await logNotification({
      type: "payment_received",
      userId: session.userId,
      userName: session.name,
      referenceId: payment.id,
      message: `${session.name} paid ₹${payment.amount} via Razorpay`,
      channel: "system",
    });

    return NextResponse.json({
      payment,
      message: "Payment successful! Calendar booking is now unlocked.",
    });
  }

  if (method !== "admin_approval") {
    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  }

  if (!transactionRefId?.trim()) {
    return NextResponse.json({ error: "Transaction / reference ID is required" }, { status: 400 });
  }
  if (!paymentProofImage?.trim()) {
    return NextResponse.json({ error: "Payment screenshot is required" }, { status: 400 });
  }

  const payment = await paymentsStore.processPayment(paymentId, method, {
    transactionRefId: transactionRefId.trim(),
    paymentProofImage: paymentProofImage.trim(),
  });
  if (!payment) return NextResponse.json({ error: "Failed to process" }, { status: 500 });

  await logNotification({
    type: "payment_submitted",
    userId: session.userId,
    userName: session.name,
    referenceId: payment.id,
    message: `${session.name} submitted payment for admin verification (₹${payment.amount})`,
    channel: "system",
  });

  return NextResponse.json({
    payment,
    message: "Submitted for admin verification. Status will update once confirmed.",
  });
}
