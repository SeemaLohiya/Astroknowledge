"use client";

import { fetchJson } from "@/lib/fetch-json";
import { isBirthProfileComplete } from "@/lib/profile";
import { User } from "@/lib/types";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface ProfileContextValue {
  user: Omit<User, "password"> | null;
  loading: boolean;
  isComplete: boolean;
  refresh: () => Promise<void>;
  updateUser: (user: Omit<User, "password"> | null) => void;
}

const ProfileContext = createContext<ProfileContextValue>({
  user: null,
  loading: false,
  isComplete: true,
  refresh: async () => {},
  updateUser: () => {},
});

export function useProfile() {
  return useContext(ProfileContext);
}

/** Auth loads after first paint so the UI is not blocked. */
export function ProfileGate({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetchJson<{ user: Omit<User, "password"> | null }>("/api/auth/me", { cache: "no-store" });
    setUser(res.data?.user ?? null);
    setLoading(false);
  }, []);

  const updateUser = useCallback((next: Omit<User, "password"> | null) => {
    setUser(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    const run = () => void refresh();
    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(run, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(run, 300);
    return () => clearTimeout(t);
  }, [refresh]);

  const isComplete = !user || user.role === "admin" || isBirthProfileComplete(user);

  return (
    <ProfileContext.Provider value={{ user, loading, isComplete, refresh, updateUser }}>
      {children}
    </ProfileContext.Provider>
  );
}
