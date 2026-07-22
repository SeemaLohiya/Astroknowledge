/** Run work after first paint — avoids blocking initial interaction. */
export function scheduleIdle(task: () => void, timeoutMs = 2000) {
  if (typeof window === "undefined") {
    return () => {};
  }

  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task, { timeout: timeoutMs });
    return () => window.cancelIdleCallback(id);
  }

  const id = globalThis.setTimeout(task, 50);
  return () => globalThis.clearTimeout(id);
}
