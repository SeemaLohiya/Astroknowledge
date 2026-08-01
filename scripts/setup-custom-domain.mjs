/**
 * Wire astroknowledge.in (GoDaddy) to Railway.
 * Usage: node scripts/setup-custom-domain.mjs
 *
 * Automated DNS (if GoDaddy API keys are set):
 *   node scripts/configure-godaddy-dns.mjs
 *
 * GoDaddy DNS (manual — required once):
 *   1. Go to https://dcc.godaddy.com/manage/astroknowledge.in/dns
 *   2. Delete A/AAAA records for @ and www pointing to Render or parking
 *   3. Add CNAME:  Host @   →  xxd3id76.up.railway.app   TTL 600
 *   4. Add CNAME:  Host www →  xxd3id76.up.railway.app   TTL 600
 *   5. Add TXT:    Host _railway-verify → railway-verify=... (see Railway dashboard)
 */
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const APEX = process.env.CUSTOM_DOMAIN || "astroknowledge.in";
const WWW = `www.${APEX}`;
const RAILWAY_CNAME = process.env.RAILWAY_CNAME_TARGET || "xxd3id76.up.railway.app";

function railway(args) {
  const result = spawnSync("railway", [...args, "--service", "astroknowledge", "--json"], {
    cwd: join(__dirname, ".."),
    encoding: "utf8",
    shell: true,
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || "railway command failed");
  }
  return result.stdout;
}

async function main() {
  console.log("=== AstroKnowledge custom domain (Railway) ===\n");

  try {
    const out = railway(["domain", "status", APEX]);
    const data = JSON.parse(out);
    const dns = data?.domain?.dnsRecords || [];
    console.log(`Railway custom domain: ${APEX}`);
    for (const r of dns) {
      console.log(`  ${r.recordType || r.name}: ${r.fqdn} → ${r.requiredValue} (${r.status})`);
    }
    const verify = data?.domain?.verification;
    if (verify?.token) {
      console.log(`\nTXT _railway-verify → ${verify.token}`);
    }
  } catch {
    console.log(`Add domain in Railway: railway domain ${APEX}`);
  }

  console.log("\n--- GoDaddy DNS records (required) ---");
  console.log(`CNAME @    ${RAILWAY_CNAME}`);
  console.log(`CNAME www  ${RAILWAY_CNAME}`);
  console.log("\nGoDaddy: https://dcc.godaddy.com/manage/astroknowledge.in/dns");
  console.log("\nOr run: node scripts/configure-godaddy-dns.mjs");
  console.log(`\nLive URLs (after DNS): https://${APEX}  https://${WWW}`);
  console.log(`Railway URL (live now): https://astroknowledge-production.up.railway.app`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
