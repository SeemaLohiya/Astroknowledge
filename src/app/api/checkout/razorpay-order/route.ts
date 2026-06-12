import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { paymentsStore } from "@/lib/payments-store";
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment." },
      { status: 503 }
    );
  }

  const { paymentId } = await req.json();
  if (!paymentId) {
    return NextResponse.json({ error: "paymentId required" }, { status: 400 });
  }

  const payment = await paymentsStore.getById(paymentId);
  if (!payment || payment.userId !== session.userId) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  if (payment.status === "paid") {
    return NextResponse.json({ error: "Already paid" }, { status: 400 });
  }

  try {
    const order = await createRazorpayOrder(payment.amount, payment.id);
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      userName: payment.userName,
      userEmail: payment.userEmail,
      userPhone: payment.userPhone,
    });
  } catch (err) {
    console.error("[razorpay-order]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create order" },
      { status: 500 }
    );
  }
}
