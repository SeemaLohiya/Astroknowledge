/**
 * Update GoDaddy DNS for astroknowledge.in → Railway.
 *
 * Requires GoDaddy API keys (https://developer.godaddy.com/keys):
 *   GODADDY_API_KEY=...
 *   GODADDY_API_SECRET=...
 *
 * Usage: node scripts/configure-godaddy-dns.mjs
 */
const DOMAIN = process.env.GODADDY_DOMAIN || "astroknowledge.in";
const KEY = process.env.GODADDY_API_KEY;
const SECRET = process.env.GODADDY_API_SECRET;
const RAILWAY_CNAME =
  process.env.RAILWAY_CNAME_TARGET || "xxd3id76.up.railway.app";
const RAILWAY_VERIFY =
  process.env.RAILWAY_VERIFY_TOKEN ||
  "railway-verify=2e531b32b749402e081f2d5fd66c49342af207873ed048044404a00ee3f24ac5";
const API = "https://api.godaddy.com/v1";

async function godaddy(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `sso-key ${KEY}:${SECRET}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

async function main() {
  if (!KEY || !SECRET) {
    console.error("Missing GODADDY_API_KEY or GODADDY_API_SECRET.");
    console.error("Create keys at https://developer.godaddy.com/keys then run:");
    console.error(
      "  $env:GODADDY_API_KEY='your-key'; $env:GODADDY_API_SECRET='your-secret'; node scripts/configure-godaddy-dns.mjs"
    );
    process.exit(1);
  }

  console.log(`Configuring DNS for ${DOMAIN} → Railway (${RAILWAY_CNAME})...\n`);

  const records = await godaddy("GET", `/domains/${DOMAIN}/records`);
  console.log(`Found ${records.length} existing records.`);

  const parkingIps = new Set(["76.223.105.230", "13.248.243.5", "216.24.57.1"]);
  const parkingMarkers = new Set(["WebsiteBuilder Site"]);
  for (const r of records) {
    const remove =
      r.type === "AAAA" ||
      (r.type === "A" && (r.name === "@" || r.name === "www") && parkingIps.has(r.data)) ||
      (r.type === "A" && r.name === "@" && parkingMarkers.has(r.data)) ||
      (r.type === "CNAME" &&
        (r.name === "@" || r.name === "www") &&
        r.data !== RAILWAY_CNAME &&
        r.data.includes("onrender.com"));
    if (remove) {
      console.log(`Removing ${r.type} ${r.name} → ${r.data}`);
      try {
        await godaddy("DELETE", `/domains/${DOMAIN}/records/${r.type}/${encodeURIComponent(r.name)}`);
      } catch (e) {
        console.log(`  (skip delete: ${String(e.message).slice(0, 80)})`);
      }
    }
  }

  console.log(`Setting CNAME @ → ${RAILWAY_CNAME}`);
  await godaddy("PUT", `/domains/${DOMAIN}/records/CNAME/@`, [{ data: RAILWAY_CNAME, ttl: 600 }]);

  console.log(`Setting CNAME www → ${RAILWAY_CNAME}`);
  await godaddy("PUT", `/domains/${DOMAIN}/records/CNAME/www`, [{ data: RAILWAY_CNAME, ttl: 600 }]);

  console.log(`Setting TXT _railway-verify → ${RAILWAY_VERIFY}`);
  await godaddy("PUT", `/domains/${DOMAIN}/records/TXT/_railway-verify`, [
    { data: RAILWAY_VERIFY, ttl: 600 },
  ]);

  const updated = await godaddy("GET", `/domains/${DOMAIN}/records`);
  console.log("\nCurrent DNS records:");
  for (const r of updated) {
    console.log(`  ${r.type.padEnd(6)} ${(r.name || "@").padEnd(20)} → ${r.data}`);
  }

  console.log("\nDone. DNS may take 5–60 minutes to propagate.");
  console.log("Railway will issue SSL once DNS is verified.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
