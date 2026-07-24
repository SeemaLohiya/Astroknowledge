import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { PUBLIC_ROUTES, absoluteUrl } from "@/lib/seo";
import { products } from "@/lib/data/products";

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
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}

/** Ensure sitemap uses production host even if env is missing at build. */
export const dynamic = "force-static";
void SITE;
