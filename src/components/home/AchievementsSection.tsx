"use client";

import { achievementPhotos as staticPhotos } from "@/lib/data/achievements";
import { AchievementPhoto } from "@/lib/types";
import { useEditableContent } from "@/lib/use-editable-content";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { FadeIn } from "../animations/FadeIn";
import { Marquee } from "../animations/Marquee";
import { SectionHeader } from "../ui/SectionHeader";
import { SafeImage } from "@/components/ui/SafeImage";
import { Award } from "lucide-react";

function AchievementSlide({ photo, lang }: { photo: AchievementPhoto; lang: "en" | "hi" }) {
  return (
    <figure className="w-[min(85vw,320px)] shrink-0 overflow-hidden rounded-2xl glass-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage
          src={photo.image}
          alt={photo.alt}
          fill
          sizes="320px"
          className="object-cover"
        />
      </div>
      <figcaption className="px-3 py-2.5 text-xs font-medium text-text-body leading-snug">
        {lang === "hi" ? photo.titleHindi : photo.title}
      </figcaption>
    </figure>
  );
}

export function AchievementsSection() {
  const { t, lang, c } = useLanguage();
  const a = c.achievements;
  const { content } = useEditableContent();
  const achievementPhotos = content?.achievementPhotos || staticPhotos;
  const firstHalf = achievementPhotos.slice(0, 5);
  const secondHalf = achievementPhotos.slice(5);

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-25" />
      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeader
          badgeIcon={Award}
          badge={a.badge}
          title={<>{t("achievements")}</>}
          subtitle={a.subtitle}
        />

        <FadeIn>
          <Marquee speed="slow">
            <div className="flex gap-5 px-2">
              {firstHalf.map((photo) => (
                <AchievementSlide key={photo.id} photo={photo} lang={lang} />
              ))}
            </div>
          </Marquee>

          <Marquee speed="slow" direction="right" className="mt-5">
            <div className="flex gap-5 px-2">
              {secondHalf.map((photo) => (
                <AchievementSlide key={photo.id} photo={photo} lang={lang} />
              ))}
            </div>
          </Marquee>
        </FadeIn>
      </div>
    </section>
  );
}
