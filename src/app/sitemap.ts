import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemap-data";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries();
}

export const dynamic = "force-static";
