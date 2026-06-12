/**
 * Creates a free Render Key Value (Redis) instance and wires REDIS_URL to the web service.
 * Usage: node scripts/provision-render-redis.mjs
 * Env: RENDER_API_KEY, RENDER_SERVICE_ID (optional), RENDER_OWNER_ID (optional)
 */
const RENDER_KEY = process.env.RENDER_API_KEY || "rnd_IQjIitAJYEdd8aBmmOLQQ43tf7FO";
const RENDER_SERVICE = process.env.RENDER_SERVICE_ID || "srv-d8lpek0g4nts73flkd8g";
const OWNER_ID = process.env.RENDER_OWNER_ID || "tea-d8lp56d7vvec73f0vea0";
const REDIS_NAME = process.env.RENDER_REDIS_NAME || "astroknowledge-kv";
const API = "https://api.render.com/v1";

async function render(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${RENDER_KEY}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

function internalRedisUrl(redis) {
  // Render internal URL is not returned by the REST API; hostname is the instance id.
  return `redis://${redis.id}:6379`;
}

async function waitRedisReady(redisId) {
  for (let i = 0; i < 40; i++) {
    const redis = await render("GET", `/redis/${redisId}`);
    if (redis.status === "available") return redis;
    console.log(`  Redis status: ${redis.status ?? "pending"}...`);
    await new Promise((r) => setTimeout(r, 10000));
  }
  throw new Error("Redis did not become available in time");
}

async function setEnvVar(key, value) {
  await render("PUT", `/services/${RENDER_SERVICE}/env-vars/${key}`, { value });
}

async function main() {
  console.log("Checking existing Render Redis instances...");
  const list = await render("GET", "/redis");
  let redis = list.find((r) => r.redis?.name === REDIS_NAME)?.redis;

  if (!redis) {
    console.log(`Creating Redis "${REDIS_NAME}" (free plan)...`);
    const created = await render("POST", "/redis", {
      name: REDIS_NAME,
      ownerId: OWNER_ID,
      plan: "free",
      region: "singapore",
      maxmemoryPolicy: "noeviction",
    });
    redis = created;
  } else {
    console.log(`Reusing existing Redis: ${redis.name} (${redis.id})`);
  }

  const ready = await waitRedisReady(redis.id);
  const redisUrl = internalRedisUrl(ready);

  console.log("Setting REDIS_URL on web service...");
  await setEnvVar("REDIS_URL", redisUrl);

  console.log("Triggering deploy...");
  await render("POST", `/services/${RENDER_SERVICE}/deploys`, { clearCache: "clear" });

  console.log("\nDone.");
  console.log(`  Redis ID: ${ready.id}`);
  console.log(`  REDIS_URL set on service ${RENDER_SERVICE}`);
  console.log(`  Health check: https://astroknowledge.onrender.com/api/health/db`);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
