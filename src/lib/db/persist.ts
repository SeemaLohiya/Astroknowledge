import { isMongoEnabled } from "./connect";
import { isRedisEnabled } from "./redis-connect";

export type PersistBackend = "mongo" | "redis" | "file";

export function getPersistBackend(): PersistBackend {
  if (isMongoEnabled()) return "mongo";
  if (isRedisEnabled()) return "redis";
  return "file";
}

export function isRemotePersistEnabled(): boolean {
  return getPersistBackend() !== "file";
}
