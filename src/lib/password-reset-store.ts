import { randomInt, randomBytes, createHash } from "crypto";
import { isRemotePersistEnabled } from "./db/persist";
import * as mongoMeta from "./db/mongo-meta-repo";
import { readJsonFile, writeJsonFile } from "./json-store";

export interface PasswordResetRecord {
  email: string;
  otpHash: string;
  resetTokenHash?: string;
  attempts: number;
  expiresAt: string;
  verifiedAt?: string;
  createdAt: string;
}

const FILE = "password-resets.json";
const OTP_TTL_MS = 10 * 60 * 1000;
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

async function loadAll(): Promise<PasswordResetRecord[]> {
  if (isRemotePersistEnabled()) return mongoMeta.mongoGetPasswordResets();
  return readJsonFile<PasswordResetRecord[]>(FILE, []);
}

async function saveAll(records: PasswordResetRecord[]) {
  if (isRemotePersistEnabled()) {
    await mongoMeta.mongoSavePasswordResets(records);
    return;
  }
  writeJsonFile(FILE, records);
}

function purgeExpired(records: PasswordResetRecord[]) {
  const now = Date.now();
  return records.filter((r) => new Date(r.expiresAt).getTime() > now);
}

export function generateOtp() {
  return String(randomInt(100000, 999999));
}

export function generateResetToken() {
  return randomBytes(32).toString("hex");
}

export const passwordResetStore = {
  createOtp: async (email: string) => {
    const otp = generateOtp();
    const now = Date.now();
    let records = purgeExpired(await loadAll()).filter((r) => r.email !== email);
    const record: PasswordResetRecord = {
      email,
      otpHash: hash(otp),
      attempts: 0,
      expiresAt: new Date(now + OTP_TTL_MS).toISOString(),
      createdAt: new Date(now).toISOString(),
    };
    records.push(record);
    await saveAll(records);
    return { otp, expiresAt: record.expiresAt };
  },

  verifyOtp: async (email: string, otp: string) => {
    let records = purgeExpired(await loadAll());
    const idx = records.findIndex((r) => r.email === email);
    if (idx === -1) return { ok: false as const, error: "OTP expired or not found. Request a new code." };

    const record = records[idx];
    if (record.attempts >= MAX_ATTEMPTS) {
      records.splice(idx, 1);
      await saveAll(records);
      return { ok: false as const, error: "Too many attempts. Request a new code." };
    }

    if (record.otpHash !== hash(otp.trim())) {
      record.attempts += 1;
      records[idx] = record;
      await saveAll(records);
      return { ok: false as const, error: "Invalid OTP. Please try again." };
    }

    const resetToken = generateResetToken();
    record.resetTokenHash = hash(resetToken);
    record.verifiedAt = new Date().toISOString();
    record.expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();
    record.attempts = 0;
    records[idx] = record;
    await saveAll(records);
    return { ok: true as const, resetToken };
  },

  consumeResetToken: async (email: string, resetToken: string) => {
    let records = purgeExpired(await loadAll());
    const idx = records.findIndex((r) => r.email === email);
    if (idx === -1) return { ok: false as const, error: "Reset session expired. Start again." };

    const record = records[idx];
    if (!record.resetTokenHash || !record.verifiedAt) {
      return { ok: false as const, error: "Verify OTP before resetting password." };
    }
    if (record.resetTokenHash !== hash(resetToken)) {
      return { ok: false as const, error: "Invalid reset token. Start again." };
    }

    records.splice(idx, 1);
    await saveAll(records);
    return { ok: true as const };
  },
};
