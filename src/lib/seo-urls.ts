import { courses } from "@/lib/data/courses";
import { products } from "@/lib/data/products";
import { services } from "@/lib/data/services";
import { absoluteUrl, PUBLIC_ROUTES } from "@/lib/seo";

/** All indexable public URLs — shared by sitemap and search-engine ping scripts. */
export function getAllPublicUrls(): string[] {
  const urls = new Set<string>();

  for (const route of PUBLIC_ROUTES) {
    urls.add(absoluteUrl(route.path));
  }

  for (const product of products) {
    urls.add(absoluteUrl(`/products/${product.id}`));
  }

  for (const service of services) {
    urls.add(absoluteUrl(`/services#${service.id}`));
  }

  for (const course of courses) {
    urls.add(absoluteUrl(`/courses#${course.id}`));
  }

  return [...urls];
}
