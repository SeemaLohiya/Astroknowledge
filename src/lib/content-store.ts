import { achievementPhotos } from "./data/achievements";
import { problemCategories } from "./data/content";
import { reviews } from "./data/content";
import { siteContent } from "./i18n/site-content";
import { EditableSiteContent } from "./types";
import { readJsonFile, writeJsonFile } from "./json-store";

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

export const contentStore = {
  get: () => readJsonFile<EditableSiteContent>("content.json", seedContent()),

  update: (data: EditableSiteContent) => {
    writeJsonFile("content.json", data);
    return data;
  },

  updateSection: <K extends keyof EditableSiteContent>(key: K, value: EditableSiteContent[K]) => {
    const current = contentStore.get();
    current[key] = value;
    return contentStore.update(current);
  },
};
