import { achievementPhotos } from "./data/achievements";
import { poojaServices, problemCategories, reviews } from "./data/content";
import { courses } from "./data/courses";
import { productCategories, products } from "./data/products";
import { services } from "./data/services";
import { siteContent } from "./i18n/site-content";
import { CatalogType, Course, EditableSiteContent, PoojaService, Product, ProductCategory, Service } from "./types";

/** In-memory catalog — instant reads, no API round-trips on public pages. */
export const staticCatalog: Record<CatalogType, Product[] | Service[] | Course[] | PoojaService[]> = {
  products: [...products],
  services: [...services],
  courses: [...courses],
  pooja: [...poojaServices],
};

export const staticCategories: ProductCategory[] = [...productCategories];

export const staticContent: EditableSiteContent = {
  faqs: {
    en: siteContent.en.faqs,
    hi: siteContent.hi.faqs,
  },
  reviews: [...reviews],
  achievementPhotos: [...achievementPhotos],
  problemCategories: [...problemCategories],
};

export function getStaticCatalog<T>(type: CatalogType): T[] {
  return staticCatalog[type] as T[];
}
