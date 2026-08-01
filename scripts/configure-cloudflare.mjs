/**
 * Put astroknowledge.in behind Cloudflare (DDoS, WAF, HTTPS).
 *
 * Requires:
 *   CLOUDFLARE_API_TOKEN — Zone:Edit, DNS:Edit (create at dash.cloudflare.com/profile/api-tokens)
 * Optional (auto-switch GoDaddy nameservers to Cloudflare):
 *   GODADDY_API_KEY, GODADDY_API_SECRET
 *
 * Usage: node scripts/configure-cloudflare.mjs
 */
const DOMAIN = process.env.CLOUDFLARE_DOMAIN || "astroknowledge.in";
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const RENDER_CNAME = process.env.RENDER_SUBDOMAIN || "astroknowledge.onrender.com";
const RAILWAY_CNAME = process.env.RAILWAY_CNAME_TARGET || "xxd3id76.up.railway.app";
const RENDER_A = "216.24.57.1";
const GODADDY_KEY = process.env.GODADDY_API_KEY;
const GODADDY_SECRET = process.env.GODADDY_API_SECRET;

async function cf(method, path, body) {
  const res = await fetch(`https://api.cloudflare.com/client/v4${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${CF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(`Cloudflare ${method} ${path}: ${JSON.stringify(data.errors || data).slice(0, 400)}`);
  }
  return data.result;
}

async function godaddy(method, path, body) {
  const res = await fetch(`https://api.godaddy.com/v1${path}`, {
    method,
    headers: {
      Authorization: `sso-key ${GODADDY_KEY}:${GODADDY_SECRET}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`GoDaddy ${method} ${path} -> ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

async function ensureZone() {
  const existing = await cf("GET", `/zones?name=${DOMAIN}`);
  if (existing?.length) {
    console.log("Zone exists:", existing[0].id, existing[0].status);
    return existing[0];
  }

  console.log("Creating Cloudflare zone for", DOMAIN);
  const zone = await cf("POST", "/zones", {
    name: DOMAIN,
    jump_start: true,
    type: "full",
  });
  console.log("Created zone:", zone.id);
  return zone;
}

async function upsertDns(zoneId) {
  const records = await cf("GET", `/zones/${zoneId}/dns_records?per_page=100`);

  async function setRecord(type, name, content, proxied = true) {
    const fqdn = name === "@" ? DOMAIN : `${name}.${DOMAIN}`;
    const match = records.find((r) => r.type === type && r.name === fqdn);
    const payload = { type, name: fqdn, content, proxied, ttl: 1 };
    if (match) {
      await cf("PUT", `/zones/${zoneId}/dns_records/${match.id}`, payload);
      console.log(`Updated ${type} ${name} → ${content} (proxied=${proxied})`);
    } else {
      await cf("POST", `/zones/${zoneId}/dns_records`, payload);
      console.log(`Created ${type} ${name} → ${content} (proxied=${proxied})`);
    }
  }

  await setRecord("A", "@", RENDER_A, true);
  await setRecord("CNAME", "www", RENDER_CNAME, true);
}

async function hardenZone(zoneId) {
  const settings = [
    { id: "ssl", value: "full" },
    { id: "always_use_https", value: "on" },
    { id: "min_tls_version", value: "1.2" },
    { id: "security_level", value: "high" },
    { id: "browser_check", value: "on" },
    { id: "email_obfuscation", value: "on" },
    { id: "hotlink_protection", value: "on" },
  ];

  for (const s of settings) {
    try {
      await cf("PATCH", `/zones/${zoneId}/settings/${s.id}`, { value: s.value });
      console.log(`Setting ${s.id} = ${s.value}`);
    } catch (e) {
      console.warn(`  skip ${s.id}:`, String(e.message).slice(0, 80));
    }
  }

  // Block common attack paths at edge (free WAF expression rules where available)
  const rules = [
    {
      description: "Block SQLi in query string",
      expression: `(http.request.uri.query contains "union select") or (http.request.uri.query contains "<script")`,
      action: "block",
    },
    {
      description: "Challenge suspicious bots",
      expression: `(cf.client.bot) and not (cf.verified_bot_category in {"Search Engine Crawler" "Monitoring & Analytics"})`,
      action: "managed_challenge",
    },
  ];

  for (const rule of rules) {
    try {
      await cf("POST", `/zones/${zoneId}/firewall/rules`, {
        filter: { expression: rule.expression, paused: false },
        action: rule.action,
        description: rule.description,
      });
      console.log("Firewall rule:", rule.description);
    } catch (e) {
      console.warn("  firewall rule skip:", String(e.message).slice(0, 100));
    }
  }
}

async function pointGodaddyToCloudflare(nameServers) {
  if (!GODADDY_KEY || !GODADDY_SECRET) {
    console.log("\n--- Manual step: update GoDaddy nameservers ---");
    for (const ns of nameServers) console.log(" ", ns);
    console.log(`https://dcc.godaddy.com/manage/${DOMAIN}/dns`);
    return;
  }

  console.log("Updating GoDaddy nameservers to Cloudflare...");
  await godaddy("PUT", `/domains/${DOMAIN}`, { nameServers });
  console.log("GoDaddy nameservers updated.");
}

async function main() {
  if (!CF_TOKEN) {
    console.error("Missing CLOUDFLARE_API_TOKEN.");
    console.error("Create at https://dash.cloudflare.com/profile/api-tokens");
    console.error("Permissions: Zone:Edit, DNS:Edit, SSL:Edit, Firewall:Edit");
    process.exit(1);
  }

  const zone = await ensureZone();
  await upsertDns(zone.id);
  await hardenZone(zone.id);
  await pointGodaddyToCloudflare(zone.name_servers);

  console.log("\nCloudflare setup complete.");
  console.log("Zone status:", zone.status);
  console.log("When nameservers propagate, traffic is proxied through Cloudflare.");
  console.log("Dashboard: https://dash.cloudflare.com/");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
