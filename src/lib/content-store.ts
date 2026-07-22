import { achievementPhotos, buildSeedCertifications } from "./data/achievements";
import { problemCategories } from "./data/content";
import { reviews } from "./data/content";
import { isRemotePersistEnabled } from "./db/persist";
import * as mongoMeta from "./db/mongo-meta-repo";
import { siteContent } from "./i18n/site-content";
import { readJsonFile, writeJsonFile } from "./json-store";
import { defaultAcharyaImage, withBrandingDefaults } from "./site-branding";
import { EditableSiteContent } from "./types";

const CONTENT_TTL_MS = 120_000;

let contentCache: EditableSiteContent | null = null;
let contentCacheTime = 0;
let contentPromise: Promise<EditableSiteContent> | null = null;

function seedContent(): EditableSiteContent {
  return {
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
}

function normalizeContent(data: EditableSiteContent): EditableSiteContent {
  const withCerts = data.certifications?.length
    ? data
    : { ...data, certifications: buildSeedCertifications() };
  return withBrandingDefaults(withCerts);
}

async function load(): Promise<EditableSiteContent> {
  const now = Date.now();
  if (contentCache && now - contentCacheTime < CONTENT_TTL_MS) return contentCache;
  if (contentPromise) return contentPromise;

  contentPromise = (async () => {
    if (isRemotePersistEnabled()) {
      const fromMongo = await mongoMeta.mongoGetContent();
      if (fromMongo) {
        const normalized = normalizeContent(fromMongo);
        if (!fromMongo.certifications?.length || !fromMongo.acharyaImage) {
          await mongoMeta.mongoSaveContent(normalized);
        }
        return normalized;
      }
      const seed = seedContent();
      await mongoMeta.mongoSaveContent(seed);
      return seed;
    }
    const file = readJsonFile<EditableSiteContent>("content.json", seedContent());
    const normalized = normalizeContent(file);
    if (!file.certifications?.length || !file.acharyaImage) {
      writeJsonFile("content.json", normalized);
    }
    return normalized;
  })();

  try {
    const resolved = await contentPromise;
    contentCache = resolved;
    contentCacheTime = Date.now();
    return resolved;
  } finally {
    contentPromise = null;
  }
}

async function save(data: EditableSiteContent) {
  if (isRemotePersistEnabled()) {
    await mongoMeta.mongoSaveContent(data);
  } else {
    writeJsonFile("content.json", data);
  }
  contentCache = data;
  contentCacheTime = Date.now();
}

export const contentStore = {
  get: async () => load(),

  update: async (data: EditableSiteContent) => {
    const normalized = normalizeContent(data);
    await save(normalized);
    return normalized;
  },

  updateSection: async <K extends keyof EditableSiteContent>(key: K, value: EditableSiteContent[K]) => {
    const current = await load();
    current[key] = value;
    return contentStore.update(current);
  },
};
