/**
 * Fully headless Atlas provisioning using Organization API keys.
 * Set before running:
 *   MONGODB_ATLAS_PUBLIC_API_KEY
 *   MONGODB_ATLAS_PRIVATE_API_KEY
 *   MONGODB_ATLAS_ORG_ID=6a2bbe01ad6f8544cdc11316
 *   RENDER_API_KEY (optional)
 */
import crypto from "crypto";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const API = "https://cloud.mongodb.com/api/atlas/v2";
const API_VERSION = "2024-10-23";
const ORG_ID = process.env.MONGODB_ATLAS_ORG_ID || "6a2bbe01ad6f8544cdc11316";
const PUBLIC_KEY = process.env.MONGODB_ATLAS_PUBLIC_API_KEY;
const PRIVATE_KEY = process.env.MONGODB_ATLAS_PRIVATE_API_KEY;
const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO";
const RENDER_SERVICE = "srv-d8lpek0g4nts73flkd8g";
const PROJECT_NAME = "AstroKnowledge";
const CLUSTER_NAME = "AstroKnowledge";
const DB_USER = "astroknowledge_admin";
const DB_PASS = process.env.MONGODB_DB_PASSWORD || `Ak${Date.now().toString(36)}!9`;
const DB_NAME = "astroknowledge";

function digestAuth(method, uri) {
  const nonce = crypto.randomBytes(16).toString("hex");
  const ha1 = crypto.createHash("md5").update(`${PUBLIC_KEY}:MMS:${PRIVATE_KEY}`).digest("hex");
  const ha2 = crypto.createHash("md5").update(`${method}:${uri}`).digest("hex");
  const nc = "00000001";
  const cnonce = crypto.randomBytes(8).toString("hex");
  const response = crypto
    .createHash("md5")
    .update(`${ha1}:${nonce}:${nc}:${cnonce}:auth:${ha2}`)
    .digest("hex");
  return `Digest username="${PUBLIC_KEY}", realm="MMS", nonce="${nonce}", uri="${uri}", algorithm=MD5, qop=auth, nc=${nc}, cnonce="${cnonce}", response="${response}"`;
}

async function atlas(method, pathSuffix, body) {
  const uri = `/api/atlas/v2${pathSuffix}`;
  const url = `${API}${pathSuffix}`;
  const headers = {
    Authorization: digestAuth(method, uri),
    Accept: `application/vnd.atlas.${API_VERSION}+json`,
    "Content-Type": `application/vnd.atlas.${API_VERSION}+json`,
  };
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${pathSuffix} -> ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

async function waitCluster(projectId) {
  for (let i = 0; i < 60; i++) {
    const list = await atlas("GET", `/groups/${projectId}/clusters`);
    const cluster = list.results?.find((c) => c.name === CLUSTER_NAME);
    if (cluster?.stateName === "IDLE") return cluster;
    await new Promise((r) => setTimeout(r, 15000));
  }
  throw new Error("Cluster did not become IDLE in time");
}

async function main() {
  if (!PUBLIC_KEY || !PRIVATE_KEY) {
    throw new Error("Set MONGODB_ATLAS_PUBLIC_API_KEY and MONGODB_ATLAS_PRIVATE_API_KEY");
  }

  let projectId;
  const projects = await atlas("GET", `/orgs/${ORG_ID}/groups`);
  const existing = projects.results?.find((p) => p.name === PROJECT_NAME);
  if (existing) {
    projectId = existing.id;
  } else {
    const created = await atlas("POST", `/orgs/${ORG_ID}/groups`, { name: PROJECT_NAME, orgId: ORG_ID });
    projectId = created.id;
  }

  try {
    await atlas("POST", `/groups/${projectId}/clusters`, {
      name: CLUSTER_NAME,
      clusterType: "REPLICASET",
      providerSettings: {
        providerName: "TENANT",
        backingProviderName: "AWS",
        regionName: "AP_SOUTH_1",
        instanceSizeName: "M0",
      },
    });
  } catch (e) {
    if (!/already exists|409/i.test(String(e.message))) throw e;
  }

  await atlas("POST", `/groups/${projectId}/accessList`, [{ cidrBlock: "0.0.0.0/0", comment: "Render" }]).catch(() => {});

  try {
    await atlas("POST", `/groups/${projectId}/databaseUsers`, {
      databaseName: "admin",
      username: DB_USER,
      password: DB_PASS,
      roles: [{ roleName: "readWrite", databaseName: DB_NAME }],
    });
  } catch (e) {
    if (!/already exists|409/i.test(String(e.message))) throw e;
  }

  await waitCluster(projectId);
  const conn = await atlas("GET", `/groups/${projectId}/clusters/${CLUSTER_NAME}/connectionStrings`);
  const srv = conn.standardSrv;
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

  fs.writeFileSync(
    path.join(root, "data/atlas-credentials.local.json"),
    JSON.stringify({ projectId, cluster: CLUSTER_NAME, dbUser: DB_USER, dbName: DB_NAME, at: new Date().toISOString() }, null, 2)
  );

  console.log("Atlas cluster ready. Render MONGODB_URI updated.");
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
