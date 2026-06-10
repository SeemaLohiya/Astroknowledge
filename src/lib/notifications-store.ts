import { AdminNotification } from "./types";
import { readJsonFile, writeJsonFile } from "./json-store";

export const notificationsStore = {
  getAll: () =>
    readJsonFile<AdminNotification[]>("notifications.json", []).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    ),

  create: (data: Omit<AdminNotification, "id" | "createdAt">) => {
    const list = readJsonFile<AdminNotification[]>("notifications.json", []);
    const entry: AdminNotification = {
      ...data,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.unshift(entry);
    writeJsonFile("notifications.json", list);
    return entry;
  },
};

export function logNotification(data: Omit<AdminNotification, "id" | "createdAt">) {
  return notificationsStore.create(data);
}
