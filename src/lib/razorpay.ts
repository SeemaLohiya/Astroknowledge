import crypto from "crypto";
import Razorpay from "razorpay";

let razorpayClient: Razorpay | null = null;

function getRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured");
  }
  if (!razorpayClient) {
    razorpayClient = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return razorpayClient;
}

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

/** Public key for checkout modal (server may also return this in create-order). */
export function getRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
}

export async function createRazorpayOrder(amountInr: number, receipt: string) {
  const amountPaise = Math.round(amountInr * 100);
  if (amountPaise < 100) {
    throw new Error("Minimum order amount is ₹1 (100 paise)");
  }

  const razorpay = getRazorpayClient();
  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: receipt.slice(0, 40),
  });

  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
  };
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return expected === signature;
}
