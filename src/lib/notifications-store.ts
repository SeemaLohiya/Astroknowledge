import { isRemotePersistEnabled } from "./db/persist";
import * as redis from "./db/redis-repo";
import { readJsonFile, writeJsonFile } from "./json-store";
import { AdminNotification } from "./types";

async function load(): Promise<AdminNotification[]> {
  if (isRemotePersistEnabled()) return redis.redisGetNotifications();
  return readJsonFile<AdminNotification[]>("notifications.json", []);
}

async function save(list: AdminNotification[]) {
  if (isRemotePersistEnabled()) {
    await redis.redisSaveNotifications(list);
    return;
  }
  writeJsonFile("notifications.json", list);
}

export const notificationsStore = {
  getAll: async () =>
    (await load()).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),

  create: async (data: Omit<AdminNotification, "id" | "createdAt">) => {
    const list = await load();
    const entry: AdminNotification = {
      ...data,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(entry);
    await save(list);
    return entry;
  },
};

export async function logNotification(data: Omit<AdminNotification, "id" | "createdAt">) {
  return notificationsStore.create(data);
}
