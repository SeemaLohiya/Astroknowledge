import { achievementPhotos, buildSeedCertifications } from "./data/achievements";
import { problemCategories } from "./data/content";
import { reviews } from "./data/content";
import { isRemotePersistEnabled } from "./db/persist";
import * as mongoMeta from "./db/mongo-meta-repo";
import { siteContent } from "./i18n/site-content";
import { readJsonFile, writeJsonFile } from "./json-store";
import { defaultAcharyaImage, withBrandingDefaults } from "./site-branding";
import { EditableSiteContent } from "./types";

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
}

async function save(data: EditableSiteContent) {
  if (isRemotePersistEnabled()) {
    await mongoMeta.mongoSaveContent(data);
    return;
  }
  writeJsonFile("content.json", data);
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
