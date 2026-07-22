"use client";

import { useCallback, useEffect, useState } from "react";
import { SITE } from "./constants";
import { parseResponseJson } from "./fetch-json";

const BRANDING_TTL_MS = 10_000;
let brandingImage = SITE.acharyaImage;
let brandingImageTime = 0;
let brandingPromise: Promise<string | null> | null = null;

async function loadAcharyaImage() {
  const now = Date.now();
  if (brandingImage && now - brandingImageTime < BRANDING_TTL_MS) return brandingImage;
  if (brandingPromise) return brandingPromise;

  brandingPromise = (async () => {
    const res = await fetch("/api/content/branding", { cache: "force-cache" });
    const data = await parseResponseJson<{ acharyaImage?: string }>(res);
    const next = data?.acharyaImage || SITE.acharyaImage;
    brandingImage = next;
    brandingImageTime = Date.now();
    return next;
  })();

  try {
    return await brandingPromise;
  } finally {
    brandingPromise = null;
  }
}

/** Live Acharya portrait URL from editable site branding (falls back to SITE default). */
export function useAcharyaImage() {
  const [image, setImage] = useState(brandingImage);

  const refresh = useCallback(async () => {
    try {
      const next = await loadAcharyaImage();
      setImage(next ?? SITE.acharyaImage);
    } catch {
      /* keep default */
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { image, refresh };
}
