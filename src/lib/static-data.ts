import { achievementPhotos, buildSeedCertifications } from "./data/achievements";
import { poojaServices, problemCategories, reviews } from "./data/content";
import { courses } from "./data/courses";
import { healingServices } from "./data/healing";
import { productCategories, products } from "./data/products";
import { services } from "./data/services";
import { siteContent } from "./i18n/site-content";
import { defaultAcharyaImage } from "./site-branding";
import { CatalogType, Course, EditableSiteContent, HealingService, PoojaService, Product, ProductCategory, Service } from "./types";

/** In-memory catalog — instant reads, no API round-trips on public pages. */
export const staticCatalog: Record<CatalogType, Product[] | Service[] | Course[] | PoojaService[] | HealingService[]> = {
  products: [...products],
  services: [...services],
  courses: [...courses],
  pooja: [...poojaServices],
  healing: [...healingServices],
};

export const staticCategories: ProductCategory[] = [...productCategories];

export const staticContent: EditableSiteContent = {
  faqs: {
    en: siteContent.en.faqs,
    hi: siteContent.hi.faqs,
  },
  reviews: [...reviews],
  achievementPhotos: [...achievementPhotos],
  certifications: buildSeedCertifications(),
  problemCategories: [...problemCategories],
  acharyaImage: defaultAcharyaImage(),
};

export function getStaticCatalog<T>(type: CatalogType): T[] {
  return staticCatalog[type] as T[];
}
