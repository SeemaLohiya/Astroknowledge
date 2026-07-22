"use client";

import { fetchJson } from "@/lib/fetch-json";
import { isBirthProfileComplete } from "@/lib/profile";
import { scheduleIdle } from "@/lib/schedule-idle";
import { User } from "@/lib/types";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface RefreshOptions {
  silent?: boolean;
}

interface ProfileContextValue {
  user: Omit<User, "password"> | null;
  loading: boolean;
  authReady: boolean;
  isComplete: boolean;
  refresh: (options?: RefreshOptions) => Promise<void>;
  updateUser: (user: Omit<User, "password"> | null) => void;
}

const ProfileContext = createContext<ProfileContextValue>({
  user: null,
  loading: false,
  authReady: false,
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
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const authReadyRef = useRef(false);
  const refreshGeneration = useRef(0);

  const refresh = useCallback(async (options?: RefreshOptions) => {
    const silent = options?.silent || authReadyRef.current;
    const generation = ++refreshGeneration.current;
    if (!silent) setLoading(true);

    const res = await fetchJson<{ user: Omit<User, "password"> | null }>("/api/auth/me", {
      cache: "no-store",
    });

    if (generation !== refreshGeneration.current) return;

    if (res.ok) {
      setUser(res.data?.user ?? null);
    } else if (res.status === 401) {
      setUser(null);
    }

    authReadyRef.current = true;
    setAuthReady(true);
    setLoading(false);
  }, []);

  const updateUser = useCallback((next: Omit<User, "password"> | null) => {
    refreshGeneration.current += 1;
    setUser(next);
    authReadyRef.current = true;
    setAuthReady(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    return scheduleIdle(() => {
      void refresh();
    });
  }, [refresh]);

  useEffect(() => {
    if (!user) return;

    const renewSession = async () => {
      const generation = refreshGeneration.current;
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          cache: "no-store",
          credentials: "include",
        });
        if (generation !== refreshGeneration.current) return;

        if (res.ok) {
          const data = (await res.json()) as { user?: Omit<User, "password"> };
          if (data.user) setUser(data.user);
          return;
        }

        if (res.status === 401) {
          setUser(null);
        }
      } catch {
        // Keep existing session on transient network errors.
      }
    };

    void renewSession();
    const interval = setInterval(() => void renewSession(), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const isComplete = !user || user.role === "admin" || isBirthProfileComplete(user);

  return (
    <ProfileContext.Provider value={{ user, loading, authReady, isComplete, refresh, updateUser }}>
      {children}
    </ProfileContext.Provider>
  );
}
