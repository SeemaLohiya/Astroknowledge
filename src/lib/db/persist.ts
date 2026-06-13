import { isMongoEnabled } from "./connect";

export type PersistBackend = "mongo" | "file";

/** MongoDB when MONGODB_URI is set; local JSON files for dev/build without Atlas. */
export function getPersistBackend(): PersistBackend {
  return isMongoEnabled() ? "mongo" : "file";
}

export function isRemotePersistEnabled(): boolean {
  return isMongoEnabled();
}
