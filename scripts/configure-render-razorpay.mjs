/**
 * Set Razorpay env vars on Render and trigger deploy.
 * Reads from .env.local or environment.
 */
import fs from "fs";
import path from "path";

const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO";
const RENDER_SERVICE = process.env.RENDER_SERVICE_ID || "srv-d8lpek0g4nts73flkd8g";

function loadEnvFile() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    out[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  }
  return out;
}

async function render(method, route, body) {
  const res = await fetch(`https://api.render.com/v1${route}`, {
    method,
    headers: {
      Authorization: `Bearer ${RENDER_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok && res.status !== 404) {
    throw new Error(`${method} ${route} -> ${res.status}: ${text.slice(0, 400)}`);
  }
  return text ? JSON.parse(text) : null;
}

async function setEnv(key, value) {
  if (!value) throw new Error(`Missing ${key}`);
  console.log(`Setting ${key}...`);
  await render("PUT", `/services/${RENDER_SERVICE}/env-vars/${key}`, { value });
}

async function main() {
  const fileEnv = loadEnvFile();
  const keyId = process.env.RAZORPAY_KEY_ID || fileEnv.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || fileEnv.RAZORPAY_KEY_SECRET;
  const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || fileEnv.NEXT_PUBLIC_RAZORPAY_KEY_ID || keyId;

  await setEnv("RAZORPAY_KEY_ID", keyId);
  await setEnv("RAZORPAY_KEY_SECRET", keySecret);
  await setEnv("NEXT_PUBLIC_RAZORPAY_KEY_ID", publicKey);

  console.log("Triggering deploy...");
  const deploy = await render("POST", `/services/${RENDER_SERVICE}/deploys`, {});
  console.log("Deploy:", deploy?.status, deploy?.id);
  console.log("\nLive: https://astroknowledge.in/payment");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
