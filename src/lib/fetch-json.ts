/** Safe JSON fetch — never throws on empty or invalid responses. */
export type FetchJsonResult<T> = {
  data: T | null;
  ok: boolean;
  status: number;
  error?: string;
};

export async function parseResponseJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<FetchJsonResult<T>> {
  try {
    const res = await fetch(url, { credentials: "include", ...init });
    const data = await parseResponseJson<T>(res);
    if (data === null) {
      return {
        data: null,
        ok: false,
        status: res.status,
        error: res.ok ? "Empty response from server" : `Request failed (${res.status})`,
      };
    }
    if (!res.ok) {
      const message = (data as { error?: string }).error;
      return { data, ok: false, status: res.status, error: message || `Request failed (${res.status})` };
    }
    return { data, ok: true, status: res.status };
  } catch (err) {
    return {
      data: null,
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}
