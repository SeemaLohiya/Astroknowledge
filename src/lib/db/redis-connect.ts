import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var redisCache: Redis | null | undefined;
}

export function isRedisEnabled(): boolean {
  return Boolean(process.env.REDIS_URL?.trim());
}

export function getRedisClient(): Redis {
  const url = process.env.REDIS_URL?.trim();
  if (!url) throw new Error("REDIS_URL is not configured");

  if (!global.redisCache) {
    global.redisCache = new Redis(url, {
      maxRetriesPerRequest: 3,
      tls: url.startsWith("rediss://") ? {} : undefined,
    });
  }

  return global.redisCache;
}

export async function connectRedis(): Promise<Redis> {
  const client = getRedisClient();
  await client.ping();
  return client;
}
