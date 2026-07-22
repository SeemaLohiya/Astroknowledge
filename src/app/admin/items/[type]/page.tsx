"use client";

import { AdminOrdersPanel } from "@/components/admin/AdminOrdersPanel";
import { CartItemType } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const VALID: CartItemType[] = ["product", "service", "pooja", "healing", "course"];

export default function AdminItemsByTypePage() {
  const params = useParams();
  const router = useRouter();
  const type = String(params.type || "") as CartItemType;

  useEffect(() => {
    if (!VALID.includes(type)) router.replace("/admin/items/products");
  }, [type, router]);

  if (!VALID.includes(type)) {
    return <p className="py-12 text-center text-text-muted">Redirecting…</p>;
  }

  return <AdminOrdersPanel itemType={type} />;
}
