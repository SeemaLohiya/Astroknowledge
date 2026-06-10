"use client";

import { useCallback, useEffect, useState } from "react";
import { parseResponseJson } from "./fetch-json";
import { staticContent } from "./static-data";
import { EditableSiteContent } from "./types";

type Options = { live?: boolean };

export function useEditableContent(options?: Options) {
  const live = options?.live ?? false;
  const [content, setContent] = useState<EditableSiteContent>(staticContent);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content");
      const data = await parseResponseJson<{ content?: EditableSiteContent }>(res);
      const next = data?.content || staticContent;
      setContent(next);
      return next as EditableSiteContent;
    } catch {
      setContent(staticContent);
      return staticContent;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!live) return;
    void refresh();
  }, [live, refresh]);

  return { content, loading: live ? loading : false, refresh };
}
