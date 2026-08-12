"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Advertisement } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { Megaphone, Sparkles, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";

function SideDecor({ side }: { side: "left" | "right" }) {
  const items = [
    { icon: Star, text: "New Updates" },
    { icon: Sparkles, text: "Special Offers" },
    { icon: Zap, text: "Latest News" },
  ];
  const ordered = side === "left" ? items : [...items].reverse();

  return (
    <div
      className={`hidden flex-col justify-center gap-3 lg:flex ${
        side === "left" ? "items-end pr-2" : "items-start pl-2"
      }`}
    >
      {ordered.map((item, i) => (
        <motion.div
          key={item.text}
          initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12 }}
          className={`ad-side-pill flex items-center gap-2 rounded-full border border-gold/20 bg-white/70 px-3 py-1.5 text-[11px] font-semibold text-gold shadow-sm backdrop-blur-sm ${
            side === "left" ? "flex-row-reverse" : ""
          }`}
        >
          <item.icon className="h-3.5 w-3.5 shrink-0" />
          {item.text}
        </motion.div>
      ))}
      <div className={`ad-side-line mt-2 h-24 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent ${side === "right" ? "ml-4" : "mr-4 self-end"}`} />
    </div>
  );
}

function AdFrame({ ad, lang, compact }: { ad: Advertisement; lang: "en" | "hi"; compact?: boolean }) {
  const title = lang === "hi" && ad.titleHindi ? ad.titleHindi : ad.title;
  const badge = ad.badge || "Update";

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 280, damping: 20 }}
      className="ad-frame-card group relative w-full"
    >
      <div className="ad-frame-outer pointer-events-none absolute -inset-[2px] rounded-2xl" />
      <div className="ad-frame-scan pointer-events-none absolute -inset-[1px] rounded-[0.9rem]" />

      <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-white via-cream to-orange/10 shadow-lg shadow-gold/15">
        <div className="ad-frame-shimmer pointer-events-none absolute inset-0 z-10" />

        <div className={`relative overflow-hidden ${compact ? "aspect-[21/9] sm:aspect-[2.4/1]" : "aspect-[16/9]"}`}>
          <div className="ad-ken-burns ad-ken-burns-0 absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ad.image} alt={title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

          <div className="absolute left-3 top-3 z-20 flex items-center gap-1 rounded-full border border-white/25 bg-black/40 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            <Zap className="h-2.5 w-2.5 animate-pulse text-amber-300" />
            {badge}
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4">
            <p className="font-display text-base font-bold leading-tight text-white drop-shadow-md sm:text-lg">{title}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 border-t border-gold/10 bg-white/90 px-3 py-2">
          <Sparkles className="h-3 w-3 text-gold" />
          <span className="text-[10px] font-semibold text-gold">AstroKnowledge</span>
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
      <section className="ad-section relative overflow-hidden py-8 md:py-10">
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="mx-auto h-6 w-40 animate-pulse rounded-full bg-gold/20" />
          <div className="mt-5 h-40 animate-pulse rounded-2xl bg-gold/10" />
        </div>
      </section>
    );
  }

  if (!ads.length) return null;

  const singleAd = ads.length === 1;

  return (
    <section className="ad-section relative overflow-hidden py-8 md:py-10">
      <div className="ad-section-bg pointer-events-none absolute inset-0" />
      <div className="ad-section-grid pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-screen-2xl px-4">
        <SectionHeader
          badgeIcon={Megaphone}
          badge={lang === "hi" ? "नवीनतम अपडेट" : "Latest Updates"}
          title={<>{lang === "hi" ? "घोषणाएं और ऑफ़र" : "Announcements & Offers"}</>}
          subtitle={
            lang === "hi"
              ? "नई सेवाएं, पूजा, कोर्स और विशेष अपडेट"
              : "New services, pooja, courses and special updates"
          }
        />

        <FadeIn className="mt-6">
          {singleAd ? (
            <>
              <div className="mb-3 flex flex-wrap justify-center gap-2 lg:hidden">
                {["New Updates", "Special Offers", "Latest News"].map((t) => (
                  <span key={t} className="ad-side-pill rounded-full border border-gold/20 bg-white/70 px-3 py-1 text-[10px] font-semibold text-gold">
                    {t}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_minmax(0,2.2fr)_1fr]">
                <SideDecor side="left" />
                <AdFrame ad={ads[0]} lang={lang} compact />
                <SideDecor side="right" />
              </div>
            </>
          ) : (
            <div
              className={`grid gap-4 ${
                ads.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {ads.map((ad) => (
                <AdFrame key={ad.id} ad={ad} lang={lang} />
              ))}
            </div>
          )}
        </FadeIn>

        <FadeIn delay={0.1} className="mt-4 flex flex-wrap justify-center gap-2">
          {ads.map((ad) => (
            <span
              key={ad.id}
              className="ad-pill inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-white/75 px-3 py-1 text-[11px] font-semibold text-gold"
            >
              <span className="h-1 w-1 animate-pulse rounded-full bg-gold" />
              {ad.badge || "Update"}: {lang === "hi" && ad.titleHindi ? ad.titleHindi : ad.title}
            </span>
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
