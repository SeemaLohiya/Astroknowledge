import { achievementPhotos, buildSeedCertifications } from "./data/achievements";
import { problemCategories } from "./data/content";
import { reviews } from "./data/content";
import { isRemotePersistEnabled } from "./db/persist";
import * as mongoMeta from "./db/mongo-meta-repo";
import { siteContent } from "./i18n/site-content";
import { readJsonFile, writeJsonFile } from "./json-store";
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
  };
}

function withCertifications(data: EditableSiteContent): EditableSiteContent {
  if (data.certifications?.length) return data;
  return { ...data, certifications: buildSeedCertifications() };
}

async function load(): Promise<EditableSiteContent> {
  if (isRemotePersistEnabled()) {
    const fromMongo = await mongoMeta.mongoGetContent();
    if (fromMongo) {
      const normalized = withCertifications(fromMongo);
      if (!fromMongo.certifications?.length) {
        await mongoMeta.mongoSaveContent(normalized);
      }
      return normalized;
    }
    const seed = seedContent();
    await mongoMeta.mongoSaveContent(seed);
    return seed;
  }
  const file = readJsonFile<EditableSiteContent>("content.json", seedContent());
  const normalized = withCertifications(file);
  if (!file.certifications?.length) {
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
    await save(withCertifications(data));
    return data;
  },

  updateSection: async <K extends keyof EditableSiteContent>(key: K, value: EditableSiteContent[K]) => {
    const current = await load();
    current[key] = value;
    return contentStore.update(current);
  },
};
