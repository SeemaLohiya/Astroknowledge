"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { Marquee } from "@/components/animations/Marquee";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Advertisement } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { Megaphone, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

function AdImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

function AdFrame({ ad, lang }: { ad: Advertisement; lang: "en" | "hi" }) {
  const title = lang === "hi" && ad.titleHindi ? ad.titleHindi : ad.title;
  const badge = ad.badge || "Update";

  const inner = (
    <motion.article
      whileHover={{ y: -10, scale: 1.03, rotate: -0.5 }}
      transition={{ type: "spring", stiffness: 280, damping: 16 }}
      className="ad-frame-card group relative w-[min(88vw,360px)] shrink-0"
    >
      <div className="ad-frame-outer pointer-events-none absolute -inset-[3px] rounded-[1.35rem]" />
      <div className="ad-frame-scan pointer-events-none absolute -inset-[2px] rounded-[1.3rem]" />
      <div className="ad-frame-glow pointer-events-none absolute -inset-4 rounded-[1.6rem] opacity-70 blur-xl" />
      <div className="ad-frame-sparkle pointer-events-none absolute -right-2 -top-2 h-16 w-16 rounded-full bg-gold/30 blur-xl" />

      <div className="relative overflow-hidden rounded-[1.25rem] border border-gold/30 bg-gradient-to-br from-white via-cream to-orange/10 shadow-xl shadow-gold/20">
        <div className="ad-frame-shimmer pointer-events-none absolute inset-0 z-10" />

        <div className="relative aspect-[16/10] overflow-hidden">
          <AdImage
            src={ad.image}
            alt={title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 group-hover:saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.4),transparent_50%)] mix-blend-screen" />
          <div className="ad-frame-vignette pointer-events-none absolute inset-0" />

          <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            <Zap className="h-3 w-3 animate-pulse text-amber-300" />
            {badge}
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
            <p className="font-display text-lg font-bold leading-tight text-white drop-shadow-lg md:text-xl">{title}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-gold/15 bg-white/85 px-4 py-2.5 backdrop-blur-sm">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-gold">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            AstroKnowledge
          </span>
          {ad.link ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted transition-colors group-hover:text-gold">
              View →
            </span>
          ) : null}
        </div>
      </div>
    </motion.article>
  );

  if (ad.link?.trim()) {
    const link = ad.link.trim();
    const isExternal = link.startsWith("http");
    return isExternal ? (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    ) : (
      <Link href={link}>{inner}</Link>
    );
  }

  return inner;
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
          <div className="h-8 w-48 animate-pulse rounded-full bg-gold/20 mx-auto" />
          <div className="mt-8 flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-52 w-80 shrink-0 animate-pulse rounded-2xl bg-gold/10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!ads.length) return null;

  const track = [...ads, ...ads, ...ads];

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

        <FadeIn className="mt-10 space-y-6">
          <Marquee speed="slow">
            <div className="flex gap-6 px-3 py-4">
              {track.map((ad, i) => (
                <AdFrame key={`${ad.id}-a-${i}`} ad={ad} lang={lang} />
              ))}
            </div>
          </Marquee>
          <Marquee speed="normal" direction="right">
            <div className="flex gap-6 px-3 py-2">
              {[...ads].reverse().concat([...ads].reverse()).map((ad, i) => (
                <AdFrame key={`${ad.id}-b-${i}`} ad={ad} lang={lang} />
              ))}
            </div>
          </Marquee>
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
