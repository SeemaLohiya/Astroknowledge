import { SavedAddress } from "./types";
import { readJsonFile, writeJsonFile } from "./json-store";

export const addressesStore = {
  getByUser: (userId: string) =>
    readJsonFile<SavedAddress[]>("addresses.json", []).filter((a) => a.userId === userId),

  create: (data: Omit<SavedAddress, "id" | "createdAt">) => {
    const list = readJsonFile<SavedAddress[]>("addresses.json", []);
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
    writeJsonFile("addresses.json", list);
    return address;
  },

  update: (id: string, userId: string, data: Partial<SavedAddress>) => {
    const list = readJsonFile<SavedAddress[]>("addresses.json", []);
    const idx = list.findIndex((a) => a.id === id && a.userId === userId);
    if (idx === -1) return null;
    if (data.isDefault) {
      list.forEach((a) => {
        if (a.userId === userId) a.isDefault = false;
      });
    }
    list[idx] = { ...list[idx], ...data, id: list[idx].id, userId, createdAt: list[idx].createdAt };
    writeJsonFile("addresses.json", list);
    return list[idx];
  },

  delete: (id: string, userId: string) => {
    const list = readJsonFile<SavedAddress[]>("addresses.json", []);
    const next = list.filter((a) => !(a.id === id && a.userId === userId));
    if (next.length === list.length) return false;
    writeJsonFile("addresses.json", next);
    return true;
  },
};
