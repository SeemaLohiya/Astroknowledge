"use client";

import { useProfile } from "@/components/profile/ProfileGate";

export function useIsAdmin() {
  const { user } = useProfile();
  return user?.role === "admin";
}
