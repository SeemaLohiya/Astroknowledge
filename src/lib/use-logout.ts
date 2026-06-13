"use client";

import { useProfile } from "@/components/profile/ProfileGate";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useLogout() {
  const { updateUser } = useProfile();
  const router = useRouter();

  return useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", cache: "no-store", credentials: "include" });
    updateUser(null);
    router.replace("/login");
  }, [updateUser, router]);
}
