/**
 * Full checkout Razorpay test (requires logged-in session cookie).
 * Usage: node scripts/test-razorpay-checkout.mjs [baseUrl] [email] [password]
 */
const base = (process.argv[2] || "http://localhost:3001").replace(/\/$/, "");
const email = process.argv[3] || "user@demo.com";
const password = process.argv[4] || "user123";

function parseCookies(res) {
  const raw = res.headers.getSetCookie?.() || [];
  return raw.map((c) => c.split(";")[0]).join("; ");
}

async function main() {
  const loginRes = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const loginData = await loginRes.json();
  if (!loginRes.ok) {
    console.error("Login failed:", loginRes.status, loginData);
    process.exit(1);
  }
  const cookie = parseCookies(loginRes);
  console.log("Logged in as:", loginData.user?.email);

  const checkoutRes = await fetch(`${base}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      userName: loginData.user.name,
      userPhone: loginData.user.phone || "+919998887766",
      userEmail: loginData.user.email,
      items: [
        {
          id: "kundali",
          name: "Kundali Analysis",
          price: 2100,
          quantity: 1,
          itemType: "service",
          image: "/images/astro/kundali.jpg",
        },
      ],
      total: 2100,
    }),
  });
  const checkoutData = await checkoutRes.json();
  if (!checkoutRes.ok || !checkoutData.payment?.id) {
    console.error("Checkout failed:", checkoutRes.status, checkoutData);
    process.exit(1);
  }
  const paymentId = checkoutData.payment.id;
  console.log("Created pending payment:", paymentId);

  const orderRes = await fetch(`${base}/api/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ paymentId }),
  });
  const orderData = await orderRes.json();
  console.log("create-order:", orderRes.status, orderData.order_id || orderData.error);

  if (orderRes.ok && orderData.order_id?.startsWith("order_")) {
    console.log("\n✓ Full checkout → Razorpay order flow OK\n");
    process.exit(0);
  }
  process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
