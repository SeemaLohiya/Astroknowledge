import fs from "fs";
import path from "path";
import { Voucher } from "./types";

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

export const vouchersStore = {
  getAll: () => readVouchers(),
  getById: (id: string) => readVouchers().find((v) => v.id === id),
  getByCode: (code: string) =>
    readVouchers().find((v) => v.code.toUpperCase() === code.trim().toUpperCase()),
  getForUser: (userId: string) =>
    readVouchers().filter((v) => v.active && v.assignedUserIds.includes(userId)),
  create: (data: Omit<Voucher, "id" | "usedCount" | "createdAt">) => {
    const vouchers = readVouchers();
    const code = data.code.trim().toUpperCase();
    if (vouchers.some((v) => v.code === code)) throw new Error("Voucher code already exists");
    const voucher: Voucher = {
      ...data,
      code,
      id: `vch-${Date.now()}`,
      usedCount: 0,
      createdAt: new Date().toISOString(),
    };
    vouchers.push(voucher);
    writeVouchers(vouchers);
    return voucher;
  },
  update: (id: string, patch: Partial<Voucher>) => {
    const vouchers = readVouchers();
    const idx = vouchers.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    if (patch.code) patch.code = patch.code.trim().toUpperCase();
    vouchers[idx] = { ...vouchers[idx], ...patch, updatedAt: new Date().toISOString() };
    writeVouchers(vouchers);
    return vouchers[idx];
  },
  delete: (id: string) => {
    const vouchers = readVouchers();
    const next = vouchers.filter((v) => v.id !== id);
    if (next.length === vouchers.length) return false;
    writeVouchers(next);
    return true;
  },
  incrementUsage: (id: string) => {
    const vouchers = readVouchers();
    const idx = vouchers.findIndex((v) => v.id === id);
    if (idx === -1) return;
    vouchers[idx].usedCount += 1;
    vouchers[idx].updatedAt = new Date().toISOString();
    writeVouchers(vouchers);
  },
};
