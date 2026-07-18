"use client";

import { useCallback, useEffect, useState } from "react";
import { SITE } from "./constants";
import { parseResponseJson } from "./fetch-json";

/** Live Acharya portrait URL from editable site branding (falls back to SITE default). */
export function useAcharyaImage() {
  const [image, setImage] = useState(SITE.acharyaImage);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/content/branding", { cache: "no-store" });
      const data = await parseResponseJson<{ acharyaImage?: string }>(res);
      if (data?.acharyaImage) setImage(data.acharyaImage);
    } catch {
      /* keep default */
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { image, refresh };
}
