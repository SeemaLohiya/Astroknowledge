"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Advertisement } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { Megaphone, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

function AdFrame({ ad, lang, index }: { ad: Advertisement; lang: "en" | "hi"; index: number }) {
  const title = lang === "hi" && ad.titleHindi ? ad.titleHindi : ad.title;
  const badge = ad.badge || "Update";
  const kenVariant = index % 3;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 22 }}
      whileHover={{ y: -8 }}
      className="ad-frame-card group relative w-full"
    >
      <div className="ad-frame-outer pointer-events-none absolute -inset-[3px] rounded-[1.35rem]" />
      <div className="ad-frame-scan pointer-events-none absolute -inset-[2px] rounded-[1.3rem]" />
      <div className="ad-frame-glow pointer-events-none absolute -inset-4 rounded-[1.6rem] opacity-60 blur-xl" />

      <div className="relative overflow-hidden rounded-[1.25rem] border-2 border-gold/35 bg-gradient-to-br from-white via-cream to-orange/10 shadow-xl shadow-gold/20">
        <div className="ad-frame-shimmer pointer-events-none absolute inset-0 z-10" />
        <div className="ad-frame-corner-tl pointer-events-none absolute left-0 top-0 z-20 h-8 w-8 border-l-2 border-t-2 border-gold/60 rounded-tl-xl" />
        <div className="ad-frame-corner-br pointer-events-none absolute bottom-0 right-0 z-20 h-8 w-8 border-b-2 border-r-2 border-gold/60 rounded-br-xl" />

        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
          <div
            className={`ad-ken-burns ad-ken-burns-${kenVariant} absolute inset-0`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ad.image}
              alt={title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="ad-frame-vignette pointer-events-none absolute inset-0" />

          <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/30 bg-black/45 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            <Zap className="h-3 w-3 animate-pulse text-amber-300" />
            {badge}
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-4 md:p-5">
            <p className="font-display text-lg font-bold leading-tight text-white drop-shadow-lg md:text-xl">{title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-gold/15 bg-white/90 px-4 py-2.5 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 animate-pulse text-gold" />
          <span className="text-xs font-semibold text-gold">AstroKnowledge</span>
        </div>
      </div>
    </motion.article>
  );
}

export function AdvertisementsSection() {
  const { lang } = useLanguage();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content/advertisements", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { items?: Advertisement[] }) => {
        if (!cancelled) setAds(d.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setAds([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className="ad-section relative overflow-hidden py-16 md:py-20">
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="mx-auto h-8 w-48 animate-pulse rounded-full bg-gold/20" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[16/10] animate-pulse rounded-2xl bg-gold/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!ads.length) return null;

  return (
    <section className="ad-section relative overflow-hidden py-16 md:py-22">
      <div className="ad-section-bg pointer-events-none absolute inset-0" />
      <div className="ad-section-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="ad-section-orbs pointer-events-none absolute inset-0" />
      <div className="ad-section-rays pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-screen-2xl px-4">
        <SectionHeader
          badgeIcon={Megaphone}
          badge={lang === "hi" ? "नवीनतम अपडेट" : "Latest Updates"}
          title={<>{lang === "hi" ? "घोषणाएं और ऑफ़र" : "Announcements & Offers"}</>}
          subtitle={
            lang === "hi"
              ? "नई सेवाएं, पूजा, कोर्स और विशेष अपडेट — सीधे AstroKnowledge से"
              : "New services, pooja, courses and special updates — straight from AstroKnowledge"
          }
        />

        <FadeIn className="mt-10">
          <div
            className={`grid gap-8 ${
              ads.length === 1
                ? "mx-auto max-w-xl"
                : ads.length === 2
                  ? "mx-auto max-w-4xl sm:grid-cols-2"
                  : "sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {ads.map((ad, i) => (
              <AdFrame key={ad.id} ad={ad} lang={lang} index={i} />
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-8 flex flex-wrap justify-center gap-3">
          {ads.map((ad) => (
            <motion.span
              key={ad.id}
              whileHover={{ scale: 1.05, y: -2 }}
              className="ad-pill inline-flex items-center gap-2 rounded-full border border-gold/25 bg-white/80 px-4 py-1.5 text-xs font-semibold text-gold shadow-sm backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              {ad.badge || "Update"}: {lang === "hi" && ad.titleHindi ? ad.titleHindi : ad.title}
            </motion.span>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
