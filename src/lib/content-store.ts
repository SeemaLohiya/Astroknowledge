import { achievementPhotos } from "./data/achievements";
import { problemCategories } from "./data/content";
import { reviews } from "./data/content";
import { isRemotePersistEnabled } from "./db/persist";
import * as redis from "./db/redis-repo";
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
    problemCategories: [...problemCategories],
  };
}

async function load(): Promise<EditableSiteContent> {
  if (isRemotePersistEnabled()) {
    const fromRedis = await redis.redisGetContent();
    if (fromRedis) return fromRedis;
    const seed = seedContent();
    await redis.redisSaveContent(seed);
    return seed;
  }
  return readJsonFile<EditableSiteContent>("content.json", seedContent());
}

async function save(data: EditableSiteContent) {
  if (isRemotePersistEnabled()) {
    await redis.redisSaveContent(data);
    return;
  }
  writeJsonFile("content.json", data);
}

export const contentStore = {
  get: async () => load(),

  update: async (data: EditableSiteContent) => {
    await save(data);
    return data;
  },

  updateSection: async <K extends keyof EditableSiteContent>(key: K, value: EditableSiteContent[K]) => {
    const current = await load();
    current[key] = value;
    return contentStore.update(current);
  },
};
