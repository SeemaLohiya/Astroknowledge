/**
 * Deploy to Railway, wait for site, then ping search engines.
 * Usage: node scripts/deploy-live.mjs
 */
import { spawn } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.SITE_URL || "https://astroknowledge.in").replace(/\/$/, "");

function runNode(script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script], {
      stdio: "inherit",
      env: process.env,
      cwd: join(__dirname, ".."),
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${script} exited ${code}`))));
  });
}

async function waitForSite(maxAttempts = 24) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(SITE_URL, { signal: AbortSignal.timeout(15_000) });
      if (res.ok) {
        console.log("Site is live:", SITE_URL);
        return;
      }
    } catch {
      // retry
    }
    console.log(`Waiting for site... (${i + 1}/${maxAttempts})`);
    await new Promise((r) => setTimeout(r, 15_000));
  }
  console.warn("Site not confirmed live yet; submitting indexing anyway.");
}

await runNode(join(__dirname, "trigger-railway-deploy.mjs"));
console.log("Waiting 90s for Railway build to start...");
await new Promise((r) => setTimeout(r, 90_000));
await waitForSite();
await runNode(join(__dirname, "submit-seo-indexing.mjs"));
