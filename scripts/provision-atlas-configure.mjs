/**
 * After `atlas auth login` succeeds, creates cluster (if needed) and wires Render MONGODB_URI.
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const atlas = path.join(root, "tools/atlas/bin/atlas.exe");
const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO";
const RENDER_SERVICE = "srv-d8lpek0g4nts73flkd8g";
const CLUSTER = "AstroKnowledge";
const DB_USER = "astroknowledge_admin";
const DB_PASS = process.env.MONGODB_DB_PASSWORD || `Ak${Date.now().toString(36)}!9`;
const DB_NAME = "astroknowledge";

function runAtlas(args, { json = false } = {}) {
  return execSync(`"${atlas}" ${args.join(" ")}${json ? " -o json" : ""}`, {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
    env: process.env,
  });
}

function isLoggedIn() {
  try {
    const out = runAtlas(["auth", "whoami"]);
    return !/not logged in/i.test(out);
  } catch {
    return false;
  }
}

async function main() {
  if (!fs.existsSync(atlas)) throw new Error("Atlas CLI missing. Run: npm run db:download-cli");
  if (!isLoggedIn()) throw new Error("Not logged in. Run: atlas auth login");

  try {
    runAtlas([
      "setup",
      "--force",
      "--clusterName",
      CLUSTER,
      "--provider",
      "AWS",
      "--region",
      "AP_SOUTH_1",
      "--username",
      DB_USER,
      "--password",
      DB_PASS,
      "--accessListIp",
      "0.0.0.0/0",
      "--connectWith",
      "skip",
      "--skipSampleData",
    ]);
  } catch (e) {
    console.warn("Setup note:", String(e.message || e).slice(0, 200));
  }

  const projects = JSON.parse(runAtlas(["projects", "list"], { json: true }));
  const projectId = projects.results?.[0]?.id;
  if (!projectId) throw new Error("No Atlas project found");

  const clusters = JSON.parse(runAtlas(["clusters", "list", "--projectId", projectId], { json: true }));
  const cluster = clusters.results?.find((c) => c.name === CLUSTER) || clusters.results?.[0];
  if (!cluster) throw new Error("No cluster found");

  console.log(`Cluster ${cluster.name} (${cluster.stateName})`);

  const conn = JSON.parse(
    runAtlas(["clusters", "connectionStrings", "describe", cluster.name, "--projectId", projectId], { json: true })
  );
  const srv = conn.connectionStrings?.standardSrv || conn.standardSrv;
  if (!srv) throw new Error("No SRV connection string");

  const user = encodeURIComponent(DB_USER);
  const pass = encodeURIComponent(DB_PASS);
  let uri = srv.replace("mongodb+srv://", `mongodb+srv://${user}:${pass}@`);
  if (!uri.includes(`/${DB_NAME}`)) uri = uri.replace("?", `/${DB_NAME}?`);

  execSync(
    `curl.exe -s -X DELETE "https://api.render.com/v1/services/${RENDER_SERVICE}/env-vars/REDIS_URL" -H "Authorization: Bearer ${RENDER_KEY}"`,
    { stdio: "inherit" }
  );
  const body = JSON.stringify({ value: uri });
  execSync(
    `curl.exe -s -X PUT "https://api.render.com/v1/services/${RENDER_SERVICE}/env-vars/MONGODB_URI" -H "Authorization: Bearer ${RENDER_KEY}" -H "Content-Type: application/json" -d "${body.replace(/"/g, '\\"')}"`,
    { stdio: "inherit" }
  );
  execSync(
    `curl.exe -s -X POST "https://api.render.com/v1/services/${RENDER_SERVICE}/deploys" -H "Authorization: Bearer ${RENDER_KEY}" -H "Content-Type: application/json" -d "{}"`,
    { stdio: "inherit" }
  );

  console.log("\nDone. MONGODB_URI set on Render. Check:");
  console.log("https://astroknowledge.onrender.com/api/health/db");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
