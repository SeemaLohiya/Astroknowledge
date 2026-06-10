"use client";

import { useEffect, useState } from "react";

/** True only after the client has mounted — use before rendering localStorage-dependent UI. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
