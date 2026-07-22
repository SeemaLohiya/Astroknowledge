"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy route — purchases are split by category in the dashboard. */
export default function PurchasesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/products");
  }, [router]);
  return <p className="py-12 text-center text-text-muted">Redirecting…</p>;
}
