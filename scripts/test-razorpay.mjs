/**
 * Smoke-test Razorpay integration (local + production).
 * Usage: node scripts/test-razorpay.mjs [baseUrl]
 */
const base = (process.argv[2] || "http://localhost:3001").replace(/\/$/, "");

async function post(path, body, cookie) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text.slice(0, 200) };
  }
  return { status: res.status, data };
}

async function main() {
  console.log(`\n=== Razorpay smoke test: ${base} ===\n`);

  const min = await post("/api/create-order", { amount: 50 });
  console.log("1. Min amount validation (expect 400):", min.status, min.data.error || min.data);

  const bad = await post("/api/verify-payment", {
    razorpay_order_id: "order_test",
    razorpay_payment_id: "pay_test",
    razorpay_signature: "invalid",
  });
  console.log("2. Bad signature (expect 400):", bad.status, bad.data.error || bad.data);

  const order = await post("/api/create-order", {
    amount: 10000,
    currency: "INR",
    receipt: `smoke_${Date.now()}`,
  });
  console.log("3. Create order (expect 200):", order.status);
  if (order.status === 200) {
    console.log("   order_id:", order.data.order_id);
    console.log("   keyId:", order.data.keyId?.slice(0, 12) + "...");
    console.log("   amount:", order.data.amount, order.data.currency);
  } else {
    console.log("   error:", order.data.error || order.data);
  }

  const paymentPage = await fetch(`${base}/payment`);
  const html = await paymentPage.text();
  const hasPublicKey = html.includes("rzp_test_") || html.includes("NEXT_PUBLIC_RAZORPAY");
  console.log("4. Payment page loads:", paymentPage.status);
  console.log("   Razorpay key embedded in client bundle:", hasPublicKey ? "yes (in JS)" : "check build/env");

  const ok = order.status === 200 && order.data.order_id?.startsWith("order_");
  console.log(ok ? "\n✓ Razorpay create-order is working\n" : "\n✗ Razorpay create-order FAILED\n");
  process.exit(ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
