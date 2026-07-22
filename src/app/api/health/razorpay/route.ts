import { NextResponse } from "next/server";
import crypto from "crypto";
import { createRazorpayOrder, getRazorpayKeyId, isRazorpayConfigured } from "@/lib/razorpay";

/** Diagnostics for Razorpay config (no secrets exposed). */
export async function GET() {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim() || "";
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim() || "";
  const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim() || "";

  const info = {
    configured: isRazorpayConfigured(),
    keyIdPrefix: keyId.slice(0, 12),
    keyIdLength: keyId.length,
    secretLength: secret.length,
    secretFingerprint: secret ? crypto.createHash("sha256").update(secret).digest("hex").slice(0, 12) : null,
    publicKeyPrefix: publicKey.slice(0, 12),
    publicKeyMatches: publicKey === keyId || !publicKey,
    getRazorpayKeyId: getRazorpayKeyId().slice(0, 12),
  };

  if (!isRazorpayConfigured()) {
    return NextResponse.json({ ok: false, ...info, error: "missing env" }, { status: 503 });
  }

  try {
    const order = await createRazorpayOrder(1, `health_${Date.now()}`);
    return NextResponse.json({ ok: true, ...info, orderId: order.id, amount: order.amount });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        ...info,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
