/**
 * Set production security env vars on Render (JWT_SECRET rotation, etc.)
 * Usage: RENDER_API_KEY=... node scripts/configure-render-security.mjs
 */
import { randomBytes } from "crypto";

const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO";
const RENDER_SERVICE = process.env.RENDER_SERVICE_ID || "srv-d8lpek0g4nts73flkd8g";

async function render(method, path, body) {
  const res = await fetch(`https://api.render.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${RENDER_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok && res.status !== 404) {
    throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : null;
}

function generateJwtSecret() {
  if (process.env.JWT_SECRET?.trim() && process.env.JWT_SECRET.trim().length >= 32) {
    return process.env.JWT_SECRET.trim();
  }
  return randomBytes(48).toString("base64url");
}

async function main() {
  const jwt = generateJwtSecret();
  console.log("Setting JWT_SECRET on Render (value hidden)...");
  await render("PUT", `/services/${RENDER_SERVICE}/env-vars/JWT_SECRET`, { value: jwt });

  console.log("Ensuring NODE_ENV=production...");
  await render("PUT", `/services/${RENDER_SERVICE}/env-vars/NODE_ENV`, { value: "production" });

  console.log("Ensuring NEXT_PUBLIC_SITE_URL...");
  await render("PUT", `/services/${RENDER_SERVICE}/env-vars/NEXT_PUBLIC_SITE_URL`, {
    value: "https://astroknowledge.in",
  });

  console.log("Triggering deploy...");
  const deploy = await render("POST", `/services/${RENDER_SERVICE}/deploys`, { clearCache: "clear" });
  console.log("Deploy:", deploy?.id, deploy?.status);
  console.log("\nDone. All existing user sessions were invalidated (new JWT secret).");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
