/**
 * Configure Render for MongoDB-only: set MONGODB_URI and remove REDIS_URL.
 * Usage:
 *   node scripts/configure-render-mongo.mjs "mongodb+srv://..."
 * Or: MONGODB_URI=... node scripts/configure-render-mongo.mjs
 */
const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO";
const RENDER_SERVICE = process.env.RENDER_SERVICE_ID || "srv-d8lpek0g4nts73flkd8g";
const uri = process.argv[2] || process.env.MONGODB_URI?.trim();

if (!uri?.startsWith("mongodb")) {
  console.error("Usage: node scripts/configure-render-mongo.mjs <MONGODB_URI>");
  process.exit(1);
}

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

async function main() {
  console.log("Removing REDIS_URL from Render...");
  await render("DELETE", `/services/${RENDER_SERVICE}/env-vars/REDIS_URL`).catch(() => {});

  console.log("Setting MONGODB_URI on Render...");
  await render("PUT", `/services/${RENDER_SERVICE}/env-vars/MONGODB_URI`, { value: uri });

  console.log("Triggering deploy...");
  const deploy = await render("POST", `/services/${RENDER_SERVICE}/deploys`, {});
  console.log("Deploy:", deploy?.status, deploy?.id);

  console.log("\nDone. Verify after deploy:");
  console.log("https://astroknowledge.onrender.com/api/health/db");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
