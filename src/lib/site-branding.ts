import { SITE } from "./constants";
import type { EditableSiteContent } from "./types";

export function defaultAcharyaImage() {
  return SITE.acharyaImage;
}

export function resolveAcharyaImage(content?: Pick<EditableSiteContent, "acharyaImage"> | null) {
  const url = content?.acharyaImage?.trim();
  return url || defaultAcharyaImage();
}

export function withBrandingDefaults(data: EditableSiteContent): EditableSiteContent {
  return {
    ...data,
    acharyaImage: resolveAcharyaImage(data),
  };
}
