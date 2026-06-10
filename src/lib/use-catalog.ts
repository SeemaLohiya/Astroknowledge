"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCatalogItems, invalidateCatalogCache } from "./catalog-cache";
import { getStaticCatalog } from "./static-data";
import { CatalogType } from "./types";

type Options = { live?: boolean };

export function useCatalog<T>(type: CatalogType, options?: Options) {
  const live = options?.live ?? true;
  const [items, setItems] = useState<T[]>(() => getStaticCatalog<T>(type));
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    invalidateCatalogCache(type);
    setLoading(true);
    try {
      const data = await fetchCatalogItems<T>(type);
      setItems(data);
    } catch {
      setItems(getStaticCatalog<T>(type));
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    setLoading(true);
    fetchCatalogItems<T>(type)
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [type, live]);

  return { items, loading: live ? loading : false, refresh };
}
