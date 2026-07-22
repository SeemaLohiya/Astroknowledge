import fs from "fs";
import path from "path";
import { Voucher } from "./types";
import { isRemotePersistEnabled } from "./db/persist";
import * as mongo from "./db/app-data-repo";

const DATA_DIR = path.join(process.cwd(), "data");
const VOUCHERS_PATH = path.join(DATA_DIR, "vouchers.json");

function readVouchers(): Voucher[] {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(VOUCHERS_PATH)) {
    fs.writeFileSync(VOUCHERS_PATH, "[]", "utf-8");
    return [];
  }
  try {
    const raw = fs.readFileSync(VOUCHERS_PATH, "utf-8").trim();
    return raw ? (JSON.parse(raw) as Voucher[]) : [];
  } catch {
    return [];
  }
}

function writeVouchers(vouchers: Voucher[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(VOUCHERS_PATH, JSON.stringify(vouchers, null, 2), "utf-8");
}

async function getVouchersList(): Promise<Voucher[]> {
  if (isRemotePersistEnabled()) return mongo.mongoGetVouchers();
  return readVouchers();
}

export const vouchersStore = {
  getAll: async () => getVouchersList(),
  getById: async (id: string) => (await getVouchersList()).find((v) => v.id === id),
  getByCode: async (code: string) =>
    (await getVouchersList()).find((v) => v.code.toUpperCase() === code.trim().toUpperCase()),
  getForUser: async (userId: string) =>
    (await getVouchersList()).filter((v) => v.active && v.assignedUserIds.includes(userId)),
  create: async (data: Omit<Voucher, "id" | "usedCount" | "createdAt"> & { usageLimit?: number | null }) => {
    const vouchers = await getVouchersList();
    const code = data.code.trim().toUpperCase();
    if (vouchers.some((v) => v.code === code)) throw new Error("Voucher code already exists");
    const usageLimit =
      data.usageLimit === null || data.usageLimit === undefined || Number.isNaN(Number(data.usageLimit))
        ? undefined
        : Number(data.usageLimit);
    const voucher: Voucher = {
      ...data,
      code,
      usageLimit,
      applicableItemTypes: data.applicableItemTypes ?? [],
      applicableItemIds: data.applicableItemIds ?? [],
      id: `vch-${Date.now()}`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    if (isRemotePersistEnabled()) return mongo.mongoSaveVoucher(voucher);
    vouchers.push(voucher);
    writeVouchers(vouchers);
    return voucher;
  },
  update: async (id: string, patch: Partial<Voucher> & { usageLimit?: number | null }) => {
    const vouchers = await getVouchersList();
    const idx = vouchers.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    if (patch.code) patch.code = patch.code.trim().toUpperCase();
    const next: Voucher = {
      ...vouchers[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    if ("usageLimit" in patch) {
      next.usageLimit =
        patch.usageLimit === null || patch.usageLimit === undefined || Number.isNaN(Number(patch.usageLimit))
          ? undefined
          : Number(patch.usageLimit);
    }
    if ("applicableItemTypes" in patch) {
      next.applicableItemTypes = patch.applicableItemTypes ?? [];
    }
    vouchers[idx] = next;
    if (isRemotePersistEnabled()) return mongo.mongoSaveVoucher(vouchers[idx]);
    writeVouchers(vouchers);
    return vouchers[idx];
  },
  delete: async (id: string) => {
    if (isRemotePersistEnabled()) return mongo.mongoDeleteVoucher(id);
    const vouchers = readVouchers();
    const next = vouchers.filter((v) => v.id !== id);
    if (next.length === vouchers.length) return false;
    writeVouchers(next);
    return true;
  },
  incrementUsage: async (id: string) => {
    const vouchers = await getVouchersList();
    const idx = vouchers.findIndex((v) => v.id === id);
    if (idx === -1) return;
    vouchers[idx].usedCount += 1;
    vouchers[idx].updatedAt = new Date().toISOString();
    if (isRemotePersistEnabled()) await mongo.mongoSaveVoucher(vouchers[idx]);
    else writeVouchers(vouchers);
  },
};
