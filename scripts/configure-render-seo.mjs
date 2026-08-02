/**
 * Set Google/Bing Search Console verification env vars on Render.
 * Usage: node scripts/configure-render-seo.mjs
 *
 * Env (optional overrides):
 *   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
 *   NEXT_PUBLIC_BING_SITE_VERIFICATION
 */
const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_6AxAtft4gmkbRhXV3Wnnkww68mG3";
const RENDER_SERVICE = process.env.RENDER_SERVICE_ID || "srv-d8lpek0g4nts73flkd8g";

const GOOGLE_VERIFY =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
  "daHNZGd0wyFk_Lbpn_lCEGVYgMHSE8KZ7zlCFpSA6Ns";

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

async function setVar(key, value) {
  if (!value?.trim()) return;
  console.log(`Setting ${key}...`);
  await render("PUT", `/services/${RENDER_SERVICE}/env-vars/${key}`, { value: value.trim() });
}

async function main() {
  console.log("Configuring SEO env vars on Render...\n");

  await setVar("NEXT_PUBLIC_SITE_URL", "https://astroknowledge.in");
  await setVar("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION", GOOGLE_VERIFY);

  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim();
  if (bing) await setVar("NEXT_PUBLIC_BING_SITE_VERIFICATION", bing);

  console.log("\nTriggering deploy...");
  const deploy = await render("POST", `/services/${RENDER_SERVICE}/deploys`, { clearCache: "clear" });
  console.log("Deploy:", deploy?.id, deploy?.status);
  console.log("\nDone. After deploy, verify meta tag:");
  console.log('  curl -s https://astroknowledge.in | findstr google-site-verification');
  console.log("\nThen run: npm run seo:submit");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
