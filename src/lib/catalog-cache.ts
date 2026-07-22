import { parseResponseJson } from "./fetch-json";
import { getStaticCatalog } from "./static-data";
import type { CatalogType } from "./types";
import type { ProductCategory } from "./types";

const STALE_MS = 300_000;
const CATALOG_TYPES: CatalogType[] = ["products", "services", "courses", "pooja", "healing"];

type CacheEntry<T> = { data: T; ts: number; promise?: Promise<T> };

const catalogCache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = catalogCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > STALE_MS) return null;
  return entry.data as T;
}

function setCached<T>(key: string, data: T) {
  catalogCache.set(key, { data, ts: Date.now() });
}

export function peekCatalogCache<T>(type: CatalogType | "categories"): T[] | null {
  return getCached<T[]>(type);
}

export function invalidateCatalogCache(type?: CatalogType | "categories") {
  if (type) catalogCache.delete(type);
  else catalogCache.clear();
  catalogCache.delete("snapshot-warm");
}

export async function prefetchCatalogSnapshot(): Promise<void> {
  if (getCached<boolean>("snapshot-warm")) return;

  const existing = catalogCache.get("snapshot");
  if (existing?.promise) {
    await existing.promise;
    return;
  }

  const promise = (async () => {
    try {
      const res = await fetch("/api/catalog/snapshot");
      const data = await parseResponseJson<{
        catalog?: Record<string, unknown[]>;
      }>(res);
      const catalog = data?.catalog;
      if (!catalog) return;

      for (const type of CATALOG_TYPES) {
        if (Array.isArray(catalog[type])) {
          setCached(type, catalog[type]);
        }
      }
      if (Array.isArray(catalog.categories)) {
        setCached("categories", catalog.categories as ProductCategory[]);
      }
      setCached("snapshot-warm", true);
    } catch {
      // Static fallbacks remain in hooks.
    }
  })();

  catalogCache.set("snapshot", { data: null, ts: 0, promise });
  try {
    await promise;
  } finally {
    const entry = catalogCache.get("snapshot");
    if (entry) delete entry.promise;
  }
}

export async function fetchCatalogItems<T>(type: CatalogType): Promise<T[]> {
  const cached = getCached<T[]>(type);
  if (cached) return cached;

  const existing = catalogCache.get(type);
  if (existing?.promise) return existing.promise as Promise<T[]>;

  const promise = (async () => {
    try {
      const res = await fetch(`/api/catalog/${type}`);
      const data = await parseResponseJson<{ items?: T[] }>(res);
      const items = data?.items ?? getStaticCatalog<T>(type);
      setCached(type, items);
      return items;
    } catch {
      return getStaticCatalog<T>(type);
    } finally {
      const entry = catalogCache.get(type);
      if (entry) delete entry.promise;
    }
  })();

  catalogCache.set(type, { data: getStaticCatalog<T>(type), ts: 0, promise });
  return promise;
}

export async function fetchCategories(): Promise<ProductCategory[]> {
  const key = "categories";
  const cached = getCached<ProductCategory[]>(key);
  if (cached) return cached;

  const existing = catalogCache.get(key);
  if (existing?.promise) return existing.promise as Promise<ProductCategory[]>;

  const promise = (async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await parseResponseJson<{ categories?: ProductCategory[] }>(res);
      const categories = data?.categories ?? [];
      setCached(key, categories);
      return categories;
    } catch {
      const { staticCategories } = await import("./static-data");
      return staticCategories;
    } finally {
      const entry = catalogCache.get(key);
      if (entry) delete entry.promise;
    }
  })();

  const { staticCategories } = await import("./static-data");
  catalogCache.set(key, { data: staticCategories, ts: 0, promise });
  return promise;
}
