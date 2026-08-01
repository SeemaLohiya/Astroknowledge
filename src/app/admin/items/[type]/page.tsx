"use client";

import { AdminCourseResourceBroadcast } from "@/components/admin/AdminCourseResourceBroadcast";
import { AdminOrdersPanel } from "@/components/admin/AdminOrdersPanel";
import { FadeIn } from "@/components/animations/FadeIn";
import { fetchJson } from "@/lib/fetch-json";
import { cn } from "@/lib/cn";
import { Course } from "@/lib/types";
import { BookOpen, Link2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/** URL slug → CartItemType (nav uses plurals; orders use singular types). */
const SLUG_TO_TYPE = {
  product: "product",
  products: "product",
  service: "service",
  services: "service",
  course: "course",
  courses: "course",
  pooja: "pooja",
  healing: "healing",
} as const;

type CourseTab = "orders" | "resources";

export default function AdminItemsByTypePage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.type || "").toLowerCase();
  const itemType = useMemo(() => SLUG_TO_TYPE[slug as keyof typeof SLUG_TO_TYPE] ?? null, [slug]);
  const [courseTab, setCourseTab] = useState<CourseTab>("orders");
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!itemType) router.replace("/admin/items/products");
  }, [itemType, router]);

  useEffect(() => {
    if (itemType === "course") {
      void fetchJson<{ items?: Course[] }>("/api/catalog/courses", { cache: "no-store" }).then((res) => {
        setCourses(res.data?.items || []);
      });
    }
  }, [itemType]);

  if (!itemType) {
    return <p className="py-12 text-center text-text-muted">Redirecting…</p>;
  }

  if (itemType === "course") {
    return (
      <div>
        <FadeIn className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCourseTab("orders")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              courseTab === "orders" ? "bg-gold text-white shadow-md shadow-gold/20" : "glass-card text-text-body hover:text-gold"
            )}
          >
            <BookOpen className="h-4 w-4" />
            Course orders
          </button>
          <button
            type="button"
            onClick={() => setCourseTab("resources")}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              courseTab === "resources" ? "bg-gold text-white shadow-md shadow-gold/20" : "glass-card text-text-body hover:text-gold"
            )}
          >
            <Link2 className="h-4 w-4" />
            Send resources
          </button>
        </FadeIn>
        {courseTab === "orders" ? <AdminOrdersPanel itemType="course" /> : <AdminCourseResourceBroadcast courses={courses} />}
      </div>
    );
  }

  return <AdminOrdersPanel itemType={itemType} />;
}
