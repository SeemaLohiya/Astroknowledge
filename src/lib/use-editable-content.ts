"use client";

import { useCallback, useEffect, useState } from "react";
import { parseResponseJson } from "./fetch-json";
import { staticContent } from "./static-data";
import { EditableSiteContent } from "./types";

type Options = { live?: boolean };

const CONTENT_TTL_MS = 300_000;
let editableContentCache: EditableSiteContent | null = null;
let editableContentCacheTime = 0;
let editableContentPromise: Promise<EditableSiteContent> | null = null;

async function loadEditableContent() {
  const now = Date.now();
  if (editableContentCache && now - editableContentCacheTime < CONTENT_TTL_MS) {
    return editableContentCache;
  }
  if (editableContentPromise) return editableContentPromise;

  editableContentPromise = (async () => {
    const res = await fetch("/api/content", { cache: "force-cache" });
    const data = await parseResponseJson<{ content?: EditableSiteContent }>(res);
    const next = data?.content || staticContent;
    editableContentCache = next;
    editableContentCacheTime = Date.now();
    return next;
  })();

  try {
    return await editableContentPromise;
  } finally {
    editableContentPromise = null;
  }
}

export function prefetchEditableContent() {
  return loadEditableContent();
}

export function useEditableContent(options?: Options) {
  const live = options?.live ?? false;
  const [content, setContent] = useState<EditableSiteContent>(editableContentCache ?? staticContent);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const next = await loadEditableContent();
      setContent(next);
      return next;
    } catch {
      setContent(staticContent);
      return staticContent;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!live) return;
    if (editableContentCache) {
      setContent(editableContentCache);
      return;
    }
    void refresh();
  }, [live, refresh]);

  return { content, loading: live ? loading : false, refresh };
}
