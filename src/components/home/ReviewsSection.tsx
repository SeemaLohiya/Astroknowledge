"use client";

import { reviews as staticReviews } from "@/lib/data/content";
import { Review } from "@/lib/types";
import { useEditableContent } from "@/lib/use-editable-content";
import { SITE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { FadeIn } from "../animations/FadeIn";
import { Marquee } from "../animations/Marquee";
import { SectionBackdrop } from "../animations/SectionBackdrop";
import { SectionHeader } from "../ui/SectionHeader";
import { Quote, Star } from "lucide-react";

function ReviewCard({ review, lang }: { review: Review; lang: "en" | "hi" }) {
  const comment = lang === "hi" && review.commentHindi ? review.commentHindi : review.comment;
  return (
    <div className="hover-lift-card w-[320px] shrink-0 rounded-2xl glass-card p-6 border border-orange/10 animate-border-glow">
      <Quote className="h-5 w-5 text-gold mb-2" />
      <div className="flex gap-1 mb-3">
        {[...Array(review.rating)].map((_, j) => (
          <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
        ))}
      </div>
      <p className="text-text-body text-sm leading-relaxed line-clamp-4">&ldquo;{comment}&rdquo;</p>
      <div className="mt-4 flex items-center justify-between border-t border-gold/10 pt-3">
        <span className="font-semibold text-gold-bright text-sm">{review.name}</span>
        <span className="text-xs text-text-muted">{review.date}</span>
      </div>
    </div>
  );
}

export function ReviewsSection() {
  const { c, lang } = useLanguage();
  const { content } = useEditableContent();
  const reviews = content?.reviews || staticReviews;
  const titleParts = c.sections.reviewsTitle.split(" ");
  const accent = titleParts.pop() || "";
  const main = titleParts.join(" ");

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-30" />
      <SectionBackdrop variant="warm" />

      <div className="relative mx-auto max-w-7xl px-4">
        <SectionHeader
          title={<>{main} <span className="text-gradient-gold">{accent}</span></>}
          subtitle={c.sections.reviewsSubtitle}
        />

        <FadeIn className="mb-10 flex items-center justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-7 w-7 fill-gold text-gold" />
          ))}
          <span className="ml-3 text-2xl font-bold text-gradient-gold">{SITE.rating}/5</span>
        </FadeIn>

        <Marquee speed="slow">
          <div className="flex gap-6 px-4">
            {[...reviews, ...reviews].map((review, i) => (
              <ReviewCard key={`${review.id}-${i}`} review={review} lang={lang} />
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
}
