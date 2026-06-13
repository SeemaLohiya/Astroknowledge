/**
 * Trigger a Render deploy for the latest main commit (GitHub webhook may not fire).
 * Usage: node scripts/trigger-render-deploy.mjs
 */
const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO";
const RENDER_SERVICE = process.env.RENDER_SERVICE_ID || "srv-d8lpek0g4nts73flkd8g";

async function main() {
  const res = await fetch(`https://api.render.com/v1/services/${RENDER_SERVICE}/deploys`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RENDER_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clearCache: "clear" }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Deploy failed ${res.status}: ${text.slice(0, 300)}`);
  const deploy = JSON.parse(text);
  console.log("Deploy triggered:", deploy.id, deploy.status);
  console.log("Live URL: https://astroknowledge.onrender.com");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
