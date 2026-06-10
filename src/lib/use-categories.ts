"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchCategories, invalidateCatalogCache } from "./catalog-cache";
import { staticCategories } from "./static-data";
import { ProductCategory } from "./types";

type Options = { live?: boolean };

export function useCategories(options?: Options) {
  const live = options?.live ?? true;
  const [categories, setCategories] = useState<ProductCategory[]>(staticCategories);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    invalidateCatalogCache("categories");
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch {
      setCategories(staticCategories);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    setLoading(true);
    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [live]);

  return { categories, loading: live ? loading : false, refresh };
}
