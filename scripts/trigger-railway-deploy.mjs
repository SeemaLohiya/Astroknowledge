/**
 * Trigger a Railway deploy for the linked project.
 * Usage: node scripts/trigger-railway-deploy.mjs
 */
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function railway(args) {
  const service = process.env.RAILWAY_SERVICE || "astroknowledge";
  const fullArgs = args.includes("--service") ? args : [...args, "--service", service];
  const result = spawnSync("railway", fullArgs, {
    cwd: join(__dirname, ".."),
    encoding: "utf8",
    shell: true,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`railway ${args.join(" ")} failed`);
  }
}

async function main() {
  railway(["up", "-y", "-d", "-m", "deploy-live"]);
  console.log("Deploy started. Check status: railway logs");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
