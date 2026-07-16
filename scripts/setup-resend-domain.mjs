/**
 * Add + verify astroknowledge.in on Resend and write DNS records to GoDaddy.
 *
 * Needs a FULL ACCESS Resend API key (not "Sending access" only):
 *   https://resend.com/api-keys
 *
 * Usage (PowerShell):
 *   $env:RESEND_API_KEY='re_full_access_...'
 *   $env:GODADDY_API_KEY='...'
 *   $env:GODADDY_API_SECRET='...'
 *   node scripts/setup-resend-domain.mjs
 */
const DOMAIN = process.env.RESEND_DOMAIN || "astroknowledge.in";
const REGION = process.env.RESEND_REGION || "us-east-1";
const RESEND_KEY = process.env.RESEND_API_KEY;
const GODADDY_KEY = process.env.GODADDY_API_KEY;
const GODADDY_SECRET = process.env.GODADDY_API_SECRET;
const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO";
const RENDER_SERVICE = process.env.RENDER_SERVICE_ID || "srv-d8lpek0g4nts73flkd8g";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || `AstroKnowledge <noreply@${DOMAIN}>`;

async function resend(method, path, body) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 400)}`);
  }
  return data;
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
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function hostName(recordName) {
  // Resend may return "send", "xxx._domainkey", or "send.astroknowledge.in"
  const raw = String(recordName || "").replace(/\.$/, "");
  if (!raw || raw === DOMAIN || raw === "@") return "@";
  if (raw.endsWith(`.${DOMAIN}`)) return raw.slice(0, -(DOMAIN.length + 1));
  return raw;
}

function recordValue(rec) {
  let value = String(rec.value || "").replace(/^"|"$/g, "");
  if (rec.type === "CNAME" || (rec.type === "MX" && value.endsWith("."))) {
    value = value.replace(/\.$/, "");
  }
  return value;
}

async function ensureDomain() {
  const listed = await resend("GET", "/domains");
  const existing = (listed?.data || listed || []).find((d) => d.name === DOMAIN);
  if (existing) {
    console.log(`Domain already on Resend: ${existing.id} (${existing.status})`);
    const full = await resend("GET", `/domains/${existing.id}`);
    return full;
  }
  console.log(`Creating Resend domain ${DOMAIN} (${REGION})...`);
  return resend("POST", "/domains", { name: DOMAIN, region: REGION });
}

async function applyDns(records) {
  if (!Array.isArray(records) || !records.length) {
    throw new Error("No DNS records returned by Resend");
  }

  console.log(`\nApplying ${records.length} DNS records to GoDaddy...\n`);
  for (const rec of records) {
    const type = rec.type;
    const name = hostName(rec.name);
    const data = recordValue(rec);
    if (!type || !data) continue;

    if (type === "MX") {
      const priority = Number(rec.priority || 10);
      console.log(`MX ${name} -> ${priority} ${data}`);
      await godaddy("PUT", `/domains/${DOMAIN}/records/MX/${encodeURIComponent(name)}`, [
        { data, ttl: 600, priority },
      ]);
    } else if (type === "TXT") {
      console.log(`TXT ${name} -> ${data}`);
      // Merge carefully: replace only this host's TXT if it's SPF/Resend related, else append
      const existing = await godaddy("GET", `/domains/${DOMAIN}/records/TXT/${encodeURIComponent(name)}`).catch(() => []);
      const kept = (existing || []).filter((r) => {
        const v = String(r.data || "");
        if (name === "send" && v.includes("amazonses.com")) return false;
        if (name === "@" && v.startsWith("v=spf1") && v.includes("amazonses.com")) return false;
        return true;
      });
      kept.push({ data, ttl: 600 });
      await godaddy("PUT", `/domains/${DOMAIN}/records/TXT/${encodeURIComponent(name)}`, kept);
    } else if (type === "CNAME") {
      console.log(`CNAME ${name} -> ${data}`);
      await godaddy("PUT", `/domains/${DOMAIN}/records/CNAME/${encodeURIComponent(name)}`, [
        { data, ttl: 600 },
      ]);
    } else {
      console.log(`Skip unsupported ${type} ${name}`);
    }
  }
}

async function updateRenderFrom() {
  const res = await fetch(
    `https://api.render.com/v1/services/${RENDER_SERVICE}/env-vars/RESEND_FROM_EMAIL`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${RENDER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: FROM_EMAIL }),
    }
  );
  console.log(`\nRender RESEND_FROM_EMAIL -> ${res.status}`);
  if (RESEND_KEY) {
    await fetch(`https://api.render.com/v1/services/${RENDER_SERVICE}/env-vars/RESEND_API_KEY`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${RENDER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: RESEND_KEY }),
    });
  }
  const deploy = await fetch(`https://api.render.com/v1/services/${RENDER_SERVICE}/deploys`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RENDER_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clearCache: "clear" }),
  }).then((r) => r.json());
  console.log("Deploy:", deploy.id, deploy.status);
}

async function main() {
  if (!RESEND_KEY) {
    console.error("Missing RESEND_API_KEY (must be Full access, not Sending-only).");
    process.exit(1);
  }
  if (!GODADDY_KEY || !GODADDY_SECRET) {
    console.error("Missing GODADDY_API_KEY / GODADDY_API_SECRET.");
    process.exit(1);
  }

  const domain = await ensureDomain();
  const id = domain.id;
  const records = domain.records || (await resend("GET", `/domains/${id}`)).records || [];
  console.log(`Domain id=${id} status=${domain.status}`);
  console.log("Records:", JSON.stringify(records, null, 2));

  await applyDns(records);

  console.log("\nTriggering Resend verification...");
  await resend("POST", `/domains/${id}/verify`);

  // Poll briefly
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const latest = await resend("GET", `/domains/${id}`);
    console.log(`Verify poll: ${latest.status}`);
    if (latest.status === "verified" || latest.status === "failed") break;
  }

  await updateRenderFrom();
  console.log(`\nDone. From address will be: ${FROM_EMAIL}`);
  console.log("If status is still pending, wait 5–30 min for DNS propagation, then re-run verify.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
