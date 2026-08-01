/**
 * Copy production env vars from Render to Railway.
 *
 * Usage:
 *   RENDER_API_KEY=... node scripts/configure-railway.mjs
 *
 * Requires Railway CLI logged in and project linked in this directory.
 */
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_6AxAtft4gmkbRhXV3Wnnkww68mG3";
const RENDER_SERVICE = process.env.RENDER_SERVICE_ID || "srv-d8lpek0g4nts73flkd8g";

const SKIP_KEYS = new Set(["PORT"]);

async function fetchRenderEnv() {
  const res = await fetch(`https://api.render.com/v1/services/${RENDER_SERVICE}/env-vars`, {
    headers: { Authorization: `Bearer ${RENDER_KEY}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Render env fetch failed ${res.status}: ${text.slice(0, 300)}`);
  const rows = JSON.parse(text);
  const vars = {};
  for (const row of rows) {
    const { key, value } = row.envVar;
    if (!SKIP_KEYS.has(key)) vars[key] = value;
  }
  return vars;
}

function railway(args, input) {
  const service = process.env.RAILWAY_SERVICE || "astroknowledge";
  const fullArgs = args.includes("--service") ? args : [...args, "--service", service];
  const result = spawnSync("railway", fullArgs, {
    cwd: join(__dirname, ".."),
    input,
    encoding: "utf8",
    shell: true,
    stdio: input ? ["pipe", "pipe", "pipe"] : "inherit",
  });
  if (result.status !== 0) {
    const err = result.stderr || result.stdout || `railway ${args.join(" ")} failed`;
    throw new Error(err.trim());
  }
  return result.stdout?.trim() || "";
}

async function main() {
  console.log("Fetching env vars from Render...");
  const vars = await fetchRenderEnv();
  const keys = Object.keys(vars);
  console.log(`Found ${keys.length} vars: ${keys.join(", ")}`);

  console.log("\nSetting vars on Railway (skip-deploys)...");
  for (const [key, value] of Object.entries(vars)) {
    railway(["variable", "set", key, "--stdin", "--skip-deploys"], value);
    console.log(`  ✓ ${key}`);
  }

  console.log("\nTriggering redeploy...");
  railway(["up", "-y", "-d"]);
  console.log("Done. Check: railway logs");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
