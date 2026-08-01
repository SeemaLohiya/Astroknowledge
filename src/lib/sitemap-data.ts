import type { MetadataRoute } from "next";
import { courses } from "@/lib/data/courses";
import { poojaServices } from "@/lib/data/content";
import { healingServices } from "@/lib/data/healing";
import { products } from "@/lib/data/products";
import { services } from "@/lib/data/services";
import { absoluteUrl, PUBLIC_ROUTES } from "@/lib/seo";

export type SitemapEntry = MetadataRoute.Sitemap[number];

/** Single source of truth for /sitemap.xml and SEO ping scripts */
export function getSitemapEntries(now = new Date()): SitemapEntry[] {
  const staticPages: SitemapEntry[] = PUBLIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productPages: SitemapEntry[] = products.map((p) => ({
    url: absoluteUrl(`/products/${p.id}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const servicePages: SitemapEntry[] = services.map((s) => ({
    url: absoluteUrl(`/services#${s.id}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.72,
  }));

  const coursePages: SitemapEntry[] = courses.map((c) => ({
    url: absoluteUrl(`/courses#${c.id}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.68,
  }));

  const poojaPages: SitemapEntry[] = poojaServices.map((p) => ({
    url: absoluteUrl(`/pooja#${p.id}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.66,
  }));

  const healingPages: SitemapEntry[] = healingServices.map((h) => ({
    url: absoluteUrl(`/healing#${h.id}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.64,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...servicePages,
    ...coursePages,
    ...poojaPages,
    ...healingPages,
  ];
}

export function getAllPublicUrls(): string[] {
  return getSitemapEntries().map((entry) => entry.url);
}
