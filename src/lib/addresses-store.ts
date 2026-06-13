import { isRemotePersistEnabled } from "./db/persist";
import * as mongoMeta from "./db/mongo-meta-repo";
import { readJsonFile, writeJsonFile } from "./json-store";
import { SavedAddress } from "./types";

async function load(): Promise<SavedAddress[]> {
  if (isRemotePersistEnabled()) return mongoMeta.mongoGetAddresses();
  return readJsonFile<SavedAddress[]>("addresses.json", []);
}

async function save(list: SavedAddress[]) {
  if (isRemotePersistEnabled()) {
    await mongoMeta.mongoSaveAddresses(list);
    return;
  }
  writeJsonFile("addresses.json", list);
}

export const addressesStore = {
  getByUser: async (userId: string) => (await load()).filter((a) => a.userId === userId),

  create: async (data: Omit<SavedAddress, "id" | "createdAt">) => {
    const list = await load();
    if (data.isDefault) {
      list.forEach((a) => {
        if (a.userId === data.userId) a.isDefault = false;
      });
    }
    const address: SavedAddress = {
      ...data,
      id: `addr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    list.push(address);
    await save(list);
    return address;
  },

  update: async (id: string, userId: string, data: Partial<SavedAddress>) => {
    const list = await load();
    const idx = list.findIndex((a) => a.id === id && a.userId === userId);
    if (idx === -1) return null;
    if (data.isDefault) {
      list.forEach((a) => {
        if (a.userId === userId) a.isDefault = false;
      });
    }
    list[idx] = { ...list[idx], ...data, id: list[idx].id, userId, createdAt: list[idx].createdAt };
    await save(list);
    return list[idx];
  },

  delete: async (id: string, userId: string) => {
    const list = await load();
    const next = list.filter((a) => !(a.id === id && a.userId === userId));
    if (next.length === list.length) return false;
    await save(next);
    return true;
  },
};
