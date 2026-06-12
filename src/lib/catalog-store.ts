import fs from "fs";
import path from "path";
import { poojaServices } from "./data/content";
import { courses } from "./data/courses";
import { healingServices } from "./data/healing";
import { productCategories, products } from "./data/products";
import { services } from "./data/services";
import { CatalogType, Course, HealingService, PoojaService, Product, ProductCategory, Service } from "./types";

interface CatalogData {
  products: Product[];
  services: Service[];
  courses: Course[];
  pooja: PoojaService[];
  healing: HealingService[];
  categories: ProductCategory[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const CATALOG_PATH = path.join(DATA_DIR, "catalog.json");

let memoryCache: CatalogData | null = null;
let memoryMtime = 0;

function seedCatalog(): CatalogData {
  return {
    products: JSON.parse(JSON.stringify(products)),
    services: JSON.parse(JSON.stringify(services)),
    courses: JSON.parse(JSON.stringify(courses)),
    pooja: JSON.parse(JSON.stringify(poojaServices)),
    healing: JSON.parse(JSON.stringify(healingServices)),
    categories: JSON.parse(JSON.stringify(productCategories)),
  };
}

function readCatalog(): CatalogData {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(CATALOG_PATH)) {
    const seed = seedCatalog();
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(seed, null, 2), "utf-8");
    memoryCache = seed;
    memoryMtime = fs.statSync(CATALOG_PATH).mtimeMs;
    return seed;
  }
  try {
    const mtime = fs.statSync(CATALOG_PATH).mtimeMs;
    if (memoryCache && mtime === memoryMtime) return memoryCache;

    const data = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf-8")) as CatalogData;
    if (!data.categories) data.categories = JSON.parse(JSON.stringify(productCategories));
    if (!data.healing) data.healing = JSON.parse(JSON.stringify(healingServices));
    for (const course of data.courses) {
      if (!course.sessionDescription) {
        const seed = courses.find((s) => s.id === course.id);
        if (seed?.sessionDescription) course.sessionDescription = seed.sessionDescription;
      }
    }
    memoryCache = data;
    memoryMtime = mtime;
    return data;
  } catch {
    const seed = seedCatalog();
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(seed, null, 2), "utf-8");
    memoryCache = seed;
    memoryMtime = fs.statSync(CATALOG_PATH).mtimeMs;
    return seed;
  }
}

function writeCatalog(data: CatalogData) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(data, null, 2), "utf-8");
  memoryCache = data;
  memoryMtime = fs.statSync(CATALOG_PATH).mtimeMs;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export const catalogStore = {
  getAll<T extends CatalogType>(type: T): CatalogData[T] {
    const data = readCatalog();
    return data[type];
  },

  getById(type: CatalogType, id: string) {
    return this.getAll(type).find((item) => item.id === id);
  },

  create(type: CatalogType, item: Record<string, unknown>) {
    const data = readCatalog();
    const id = (item.id as string) || `${type.slice(0, 3)}-${Date.now()}`;
    const newItem = { ...item, id };
    (data[type] as unknown[]).push(newItem);
    writeCatalog(data);
    return newItem;
  },

  update(type: CatalogType, id: string, updates: Record<string, unknown>) {
    const data = readCatalog();
    const items = data[type] as { id: string }[];
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated = { ...items[index], ...updates, id };
    (data[type] as unknown[])[index] = updated;
    writeCatalog(data);
    return updated;
  },

  delete(type: CatalogType, id: string) {
    const data = readCatalog();
    const items = data[type] as { id: string }[];
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    items.splice(index, 1);
    writeCatalog(data);
    return true;
  },

  newItemDefaults(type: CatalogType) {
    if (type === "products") {
      return {
        id: `p-${Date.now()}`,
        name: "New Product",
        nameHindi: "नया उत्पाद",
        description: "Product description",
        price: 1000,
        category: "rudraksha",
        image: "/images/products/p1.jpg",
        rating: 4.5,
        reviews: 0,
        inStock: true,
        energized: true,
      } satisfies Partial<Product>;
    }
    if (type === "healing") {
      return {
        id: `heal-${Date.now()}`,
        title: "New Healing Session",
        titleHindi: "नई हीलिंग सेवा",
        description: "Healing session description",
        price: 2500,
        duration: "60 min",
        benefits: ["Energy balance"],
        image: "/images/healing/reiki.jpg",
      } satisfies Partial<HealingService>;
    }
    if (type === "pooja") {
      return {
        id: `pu-${Date.now()}`,
        title: "New Pooja Service",
        titleHindi: "नई पूजा सेवा",
        description: "Pooja description",
        price: 5000,
        duration: "2 hours",
        benefits: ["Divine blessings"],
        image: "/images/astro/pooja.jpg",
      } satisfies Partial<PoojaService>;
    }
    const base = {
      id: slugify(type) + `-${Date.now()}`,
      title: type === "courses" ? "New Course" : "New Service",
      titleHindi: "नया",
      description: "Description",
      ...(type === "courses"
        ? {
            sessionDescription:
              "Describe each session in detail — topics covered, learning outcomes, practice exercises, and what students will achieve by the end of the course.",
          }
        : {}),
      duration: "1 hour",
      price: 2000,
      image: "/images/astro/kundali.jpg",
      features: ["Feature 1"],
      popular: false,
    };
    return base;
  },

  getCategories: () => readCatalog().categories || [],

  createCategory: (cat: Omit<ProductCategory, "id"> & { id?: string }) => {
    const data = readCatalog();
    const id = cat.id || slugify(cat.name);
    const newCat = { ...cat, id };
    data.categories.push(newCat);
    writeCatalog(data);
    return newCat;
  },

  updateCategory: (id: string, updates: Partial<ProductCategory>) => {
    const data = readCatalog();
    const index = data.categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    data.categories[index] = { ...data.categories[index], ...updates, id };
    writeCatalog(data);
    return data.categories[index];
  },

  deleteCategory: (id: string) => {
    const data = readCatalog();
    data.categories = data.categories.filter((c) => c.id !== id);
    writeCatalog(data);
    return true;
  },
};
