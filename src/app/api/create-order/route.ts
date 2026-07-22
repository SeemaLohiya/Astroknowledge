import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { paymentsStore } from "@/lib/payments-store";
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

/**
 * Razorpay Standard Checkout — create order.
 * Accepts either `paymentId` (app checkout) or raw `amount` + `receipt`.
 */
export async function POST(req: NextRequest) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json(
      { error: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { paymentId, amount, currency = "INR", receipt } = body as {
    paymentId?: string;
    amount?: number;
    currency?: string;
    receipt?: string;
  };

  let amountPaise: number;
  let receiptId: string;
  let userName: string | undefined;
  let userEmail: string | undefined;
  let userPhone: string | undefined;

  if (paymentId) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payment = await paymentsStore.getById(paymentId);
    if (!payment || payment.userId !== session.userId) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }
    if (payment.status === "paid") {
      return NextResponse.json({ error: "Already paid" }, { status: 400 });
    }

    amountPaise = Math.round(payment.amount * 100);
    receiptId = payment.id;
    userName = payment.userName;
    userEmail = payment.userEmail;
    userPhone = payment.userPhone;
  } else {
    if (typeof amount !== "number" || !Number.isFinite(amount)) {
      return NextResponse.json({ error: "amount is required (in paise)" }, { status: 400 });
    }
    if (amount < 100) {
      return NextResponse.json({ error: "Minimum amount is 100 paise" }, { status: 400 });
    }
    if (currency !== "INR") {
      return NextResponse.json({ error: "Only INR is supported" }, { status: 400 });
    }
    amountPaise = Math.round(amount);
    receiptId = receipt || `rcpt_${Date.now()}`;
  }

  try {
    const order = await createRazorpayOrder(amountPaise / 100, receiptId);
    return NextResponse.json({
      order_id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      userName,
      userEmail,
      userPhone,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    const status = message.includes("authentication") || message.includes("401") ? 401 : 500;
    console.error("[create-order]", err);
    return NextResponse.json({ error: message }, { status });
  }
}
