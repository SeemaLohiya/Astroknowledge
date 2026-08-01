import { isRemotePersistEnabled } from "./db/persist";
import * as mongoMeta from "./db/mongo-meta-repo";
import { readJsonFile, writeJsonFile } from "./json-store";

export interface RevenueMonthOverride {
  amount: number;
  note?: string;
}

export interface RevenueExtraRow {
  id: string;
  label: string;
  amount: number;
  note?: string;
  monthKey?: string;
}

export interface AdminRevenueData {
  overrides: Record<string, RevenueMonthOverride>;
  extraRows: RevenueExtraRow[];
  summaryNote?: string;
}

const EMPTY: AdminRevenueData = { overrides: {}, extraRows: [] };

async function load(): Promise<AdminRevenueData> {
  if (isRemotePersistEnabled()) return mongoMeta.mongoGetAdminRevenue();
  return readJsonFile<AdminRevenueData>("admin-revenue.json", EMPTY);
}

async function save(data: AdminRevenueData) {
  if (isRemotePersistEnabled()) {
    await mongoMeta.mongoSaveAdminRevenue(data);
    return;
  }
  writeJsonFile("admin-revenue.json", data);
}

export const adminRevenueStore = {
  get: load,
  save: async (data: AdminRevenueData) => {
    const normalized: AdminRevenueData = {
      overrides: data.overrides || {},
      extraRows: (data.extraRows || []).filter((r) => r.label?.trim() && r.amount >= 0),
      summaryNote: data.summaryNote?.trim() || undefined,
    };
    await save(normalized);
    return normalized;
  },
};
