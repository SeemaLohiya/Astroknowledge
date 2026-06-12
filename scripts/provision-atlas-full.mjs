import pty from "node-pty";
import path from "path";
import { fileURLToPath } from "url";
import { execSync, spawn as nodeSpawn } from "child_process";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const atlas = path.join(root, "tools/atlas/bin/atlas.exe");
const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO";
const RENDER_SERVICE = "srv-d8lpek0g4nts73flkd8g";
const CLUSTER = "AstroKnowledge";
const DB_USER = "astroknowledge_admin";
const DB_PASS = `Ak${Date.now().toString(36)}!9`;
const DB_NAME = "astroknowledge";
const ORG_ID = "6a2bbe01ad6f8544cdc11316";

function runAtlas(args, { json = false } = {}) {
  const cmd = [atlas, ...args, ...(json ? ["-o", "json"] : [])];
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

async function loginWithDeviceCode() {
  return new Promise((resolve, reject) => {
    const term = pty.spawn(atlas, ["auth", "login", "--noBrowser"], {
      name: "xterm-color",
      cols: 120,
      rows: 30,
      cwd: path.dirname(atlas),
    });

    let buf = "";
    let opened = false;
    const timer = setTimeout(() => {
      term.kill();
      reject(new Error("Atlas login timed out"));
    }, 300000);

    term.onData((data) => {
      buf += data;
      if (buf.includes("Select authentication type") && !buf.includes("UserAccount\n")) {
        term.write("\r");
      }
      const codeMatch = buf.match(/To verify your account, copy your one-time verification code:\s*\r?\n\s*([A-Z0-9]{4}-[A-Z0-9]{4})/);
      if (codeMatch && !opened) {
        opened = true;
        const code = codeMatch[1];
        console.log("\nAtlas verification code:", code);
        try {
          execSync(`powershell -Command "Set-Clipboard -Value '${code}'"`);
          console.log("Code copied to clipboard.");
        } catch {}
        nodeSpawn("cmd", ["/c", "start", "https://account.mongodb.com/account/connect"], {
          detached: true,
          stdio: "ignore",
        }).unref();
        console.log("Browser opened — paste the code if prompted (logged in as astroknowledge01@gmail.com).");
      }
      if (/logged in|Success|authenticated/i.test(buf)) {
        clearTimeout(timer);
        term.kill();
        resolve();
      }
    });

    term.onExit(({ exitCode }) => {
      clearTimeout(timer);
      if (isLoggedIn()) resolve();
      else reject(new Error(`Atlas login failed (exit ${exitCode})`));
    });
  });
}

async function main() {
  console.log("=== AstroKnowledge Atlas + Render provisioner ===");

  if (!fs.existsSync(atlas)) {
    throw new Error("Atlas CLI missing. Run: npm run db:download-cli");
  }

  if (!isLoggedIn()) {
    console.log("Starting Atlas device-code login...");
    await loginWithDeviceCode();
    console.log("Atlas login OK.");
  }

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
    console.warn("Setup note:", e.message?.slice(0, 200) || e);
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
  const srv = conn.connectionStrings?.standardSrv;
  if (!srv) throw new Error("No SRV connection string");

  const user = encodeURIComponent(DB_USER);
  const pass = encodeURIComponent(DB_PASS);
  let uri = srv.replace("mongodb+srv://", `mongodb+srv://${user}:${pass}@`);
  if (!uri.includes(`/${DB_NAME}`)) uri = uri.replace("?", `/${DB_NAME}?`);

  const body = JSON.stringify({ value: uri });
  execSync(
    `curl.exe -s -X PUT "https://api.render.com/v1/services/${RENDER_SERVICE}/env-vars/MONGODB_URI" -H "Authorization: Bearer ${RENDER_KEY}" -H "Content-Type: application/json" -d "${body.replace(/"/g, '\\"')}"`,
    { stdio: "inherit" }
  );
  execSync(
    `curl.exe -s -X POST "https://api.render.com/v1/services/${RENDER_SERVICE}/deploys" -H "Authorization: Bearer ${RENDER_KEY}" -H "Content-Type: application/json" -d "{}"`,
    { stdio: "inherit" }
  );

  const credPath = path.join(root, "data/atlas-credentials.local.json");
  fs.writeFileSync(
    credPath,
    JSON.stringify({ orgId: ORG_ID, projectId, cluster: cluster.name, dbUser: DB_USER, dbName: DB_NAME, at: new Date().toISOString() }, null, 2)
  );

  console.log("\nDone.");
  console.log("Render MONGODB_URI set and redeploy triggered.");
  console.log("Check: https://astroknowledge.onrender.com/api/health/db");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
