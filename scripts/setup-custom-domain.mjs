/**
 * Wire astroknowledge.in (GoDaddy) to Render.
 * Usage: node scripts/setup-custom-domain.mjs
 *
 * GoDaddy DNS (manual — required once):
 *   1. Go to https://dcc.godaddy.com/manage/astroknowledge.in/dns
 *   2. Delete any AAAA records for @ and www
 *   3. Delete old A records pointing to GoDaddy parking (76.223.x / 13.248.x)
 *   4. Add A record:  Host @   →  216.24.57.1   TTL 600
 *   5. Add CNAME:     Host www →  astroknowledge.onrender.com   TTL 600
 *   6. Remove domain forwarding / parking if enabled
 */
const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO";
const RENDER_SERVICE = process.env.RENDER_SERVICE_ID || "srv-d8lpek0g4nts73flkd8g";
const APEX = process.env.CUSTOM_DOMAIN || "astroknowledge.in";
const WWW = `www.${APEX}`;
const RENDER_SUBDOMAIN = process.env.RENDER_SUBDOMAIN || "astroknowledge.onrender.com";
const RENDER_A_RECORD = "216.24.57.1";

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
  if (!res.ok && res.status !== 404 && res.status !== 409) {
    throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : null;
}

async function ensureDomain(name) {
  try {
    const created = await render("POST", `/services/${RENDER_SERVICE}/custom-domains`, { name });
    const row = Array.isArray(created) ? created[0] : created;
    console.log(`Added ${name}:`, row?.id || row?.customDomain?.id || "ok");
    return row?.id || row?.customDomain?.id;
  } catch (e) {
    if (String(e.message).includes("409")) {
      console.log(`Domain already on Render: ${name}`);
      return null;
    }
    throw e;
  }
}

async function listDomains() {
  const data = await render("GET", `/services/${RENDER_SERVICE}/custom-domains`);
  return (data || []).map((row) => row.customDomain || row);
}

async function verifyDomain(id, name) {
  const res = await fetch(
    `https://api.render.com/v1/services/${RENDER_SERVICE}/custom-domains/${id}/verify`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${RENDER_KEY}`, "Content-Type": "application/json" },
      body: "{}",
    }
  );
  console.log(`Verify ${name}: HTTP ${res.status}`);
}

async function main() {
  console.log("=== AstroKnowledge custom domain setup ===\n");
  console.log(`Render service: ${RENDER_SERVICE}`);
  console.log(`Target subdomain: ${RENDER_SUBDOMAIN}\n`);

  await ensureDomain(APEX).catch(() => {});
  await ensureDomain(WWW).catch(() => {});

  const domains = await listDomains();
  for (const d of domains) {
    if (d.name === APEX || d.name === WWW) {
      console.log(`${d.name}: ${d.verificationStatus} (${d.id})`);
      if (d.verificationStatus !== "verified" && d.id) {
        await verifyDomain(d.id, d.name);
      }
    }
  }

  console.log("\n--- GoDaddy DNS records (required) ---");
  console.log(`A     @    ${RENDER_A_RECORD}`);
  console.log(`CNAME www  ${RENDER_SUBDOMAIN}`);
  console.log("\nGoDaddy: https://dcc.godaddy.com/manage/astroknowledge.in/dns");
  console.log("\nAfter DNS propagates (5–60 min), verify at:");
  console.log("https://dashboard.render.com/web/srv-d8lpek0g4nts73flkd8g/settings");
  console.log(`\nLive URLs: https://${APEX}  https://${WWW}`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
