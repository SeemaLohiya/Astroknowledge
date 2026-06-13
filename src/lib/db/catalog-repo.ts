import fs from "fs";
import path from "path";
import { connectDB } from "./connect";
import { CatalogModel } from "./models";
import { CatalogType } from "../types";

export interface CatalogData {
  products: unknown[];
  services: unknown[];
  courses: unknown[];
  pooja: unknown[];
  healing: unknown[];
  categories: unknown[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const CATALOG_PATH = path.join(DATA_DIR, "catalog.json");

export function readCatalogFromFile(): CatalogData | null {
  if (!fs.existsSync(CATALOG_PATH)) return null;
  try {
    return JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8")) as CatalogData;
  } catch {
    return null;
  }
}

export async function getCatalogDoc(): Promise<CatalogData> {
  await connectDB();
  let doc = await CatalogModel.findById("main").lean();
  if (!doc) {
    const fromFile = readCatalogFromFile();
    const seed = fromFile ?? {
      products: [],
      services: [],
      courses: [],
      pooja: [],
      healing: [],
      categories: [],
    };
    await CatalogModel.create({ _id: "main", ...seed });
    doc = await CatalogModel.findById("main").lean();
  }
  return {
    products: doc?.products ?? [],
    services: doc?.services ?? [],
    courses: doc?.courses ?? [],
    pooja: doc?.pooja ?? [],
    healing: doc?.healing ?? [],
    categories: doc?.categories ?? [],
  };
}

async function saveCatalog(data: CatalogData) {
  await connectDB();
  await CatalogModel.findByIdAndUpdate(
    "main",
    { $set: data },
    { upsert: true, new: true }
  );
}

export async function mongoGetAll<T extends CatalogType>(type: T): Promise<CatalogData[T]> {
  const data = await getCatalogDoc();
  return data[type] as CatalogData[T];
}

export async function mongoGetById(type: CatalogType, id: string) {
  const items = await mongoGetAll(type);
  return (items as { id: string }[]).find((item) => item.id === id);
}

export async function mongoCreate(type: CatalogType, item: Record<string, unknown>) {
  const data = await getCatalogDoc();
  const id = (item.id as string) || `${type.slice(0, 3)}-${Date.now()}`;
  const newItem = { ...item, id };
  (data[type] as unknown[]).push(newItem);
  await saveCatalog(data);
  return newItem;
}

export async function mongoUpdate(type: CatalogType, id: string, updates: Record<string, unknown>) {
  const data = await getCatalogDoc();
  const items = data[type] as { id: string }[];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...items[index], ...updates, id };
  (data[type] as unknown[])[index] = updated;
  await saveCatalog(data);
  return updated;
}

export async function mongoDelete(type: CatalogType, id: string) {
  const data = await getCatalogDoc();
  const items = data[type] as { id: string }[];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return false;
  items.splice(index, 1);
  await saveCatalog(data);
  return true;
}

export async function mongoGetCategories() {
  const data = await getCatalogDoc();
  return data.categories;
}

export async function mongoCreateCategory(cat: Record<string, unknown> & { id?: string; name: string }) {
  const data = await getCatalogDoc();
  const id =
    cat.id ||
    cat.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 48);
  const newCat = { ...cat, id };
  data.categories.push(newCat);
  await saveCatalog(data);
  return newCat;
}

export async function mongoUpdateCategory(id: string, updates: Record<string, unknown>) {
  const data = await getCatalogDoc();
  const index = (data.categories as { id: string }[]).findIndex((c) => c.id === id);
  if (index === -1) return null;
  data.categories[index] = { ...(data.categories[index] as object), ...updates, id };
  await saveCatalog(data);
  return data.categories[index];
}

export async function mongoDeleteCategory(id: string) {
  const data = await getCatalogDoc();
  data.categories = (data.categories as { id: string }[]).filter((c) => c.id !== id);
  await saveCatalog(data);
  return true;
}

export async function seedCatalogToMongo(seed: CatalogData) {
  await connectDB();
  const existing = await CatalogModel.findById("main");
  if (existing) return existing.toObject();
  await CatalogModel.create({ _id: "main", ...seed });
  return seed;
}
