"use client";

import { AdminOrdersPanel } from "@/components/admin/AdminOrdersPanel";
import { CartItemType } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

/** URL slug → CartItemType (nav uses plurals; orders use singular types). */
const SLUG_TO_TYPE: Record<string, CartItemType> = {
  product: "product",
  products: "product",
  service: "service",
  services: "service",
  course: "course",
  courses: "course",
  pooja: "pooja",
  healing: "healing",
};

export default function AdminItemsByTypePage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.type || "").toLowerCase();
  const itemType = useMemo(() => SLUG_TO_TYPE[slug] ?? null, [slug]);

  useEffect(() => {
    if (!itemType) router.replace("/admin/items/products");
  }, [itemType, router]);

  if (!itemType) {
    return <p className="py-12 text-center text-text-muted">Redirecting…</p>;
  }

  return <AdminOrdersPanel itemType={itemType} />;
}
