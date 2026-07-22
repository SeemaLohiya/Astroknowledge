import crypto from "crypto";

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID?.trim() && process.env.RAZORPAY_KEY_SECRET?.trim());
}

/** Public key for checkout modal (server may also return this in create-order). */
export function getRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
}

function razorpayAuthHeader() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) {
    throw new Error("Razorpay is not configured");
  }
  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
}

export async function createRazorpayOrder(amountInr: number, receipt: string) {
  const amountPaise = Math.round(amountInr * 100);
  if (amountPaise < 100) {
    throw new Error("Minimum order amount is ₹1 (100 paise)");
  }

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: razorpayAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: receipt.slice(0, 40),
    }),
  });

  const text = await res.text();
  let data: { id?: string; amount?: number; currency?: string; error?: { description?: string; code?: string } } = {};
  try {
    data = JSON.parse(text) as typeof data;
  } catch {
    throw new Error(`Razorpay order failed: ${text.slice(0, 200)}`);
  }

  if (!res.ok || !data.id) {
    const desc = data.error?.description || data.error?.code || text.slice(0, 200);
    throw new Error(`Razorpay order failed: ${desc}`);
  }

  return {
    id: data.id,
    amount: Number(data.amount),
    currency: data.currency || "INR",
  };
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
  return expected === signature;
}
