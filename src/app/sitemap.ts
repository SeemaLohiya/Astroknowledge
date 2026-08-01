import type { MetadataRoute } from "next";
import { courses } from "@/lib/data/courses";
import { products } from "@/lib/data/products";
import { services } from "@/lib/data/services";
import { absoluteUrl, PUBLIC_ROUTES } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/products/${p.id}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  const serviceAnchors: MetadataRoute.Sitemap = services.map((s) => ({
    url: absoluteUrl(`/services#${s.id}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const courseAnchors: MetadataRoute.Sitemap = courses.map((c) => ({
    url: absoluteUrl(`/courses#${c.id}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  return [...staticPages, ...productPages, ...serviceAnchors, ...courseAnchors];
}

export const dynamic = "force-static";
