"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/services");
  }, [router]);
  return <p className="py-12 text-center text-text-muted">Redirecting…</p>;
}
