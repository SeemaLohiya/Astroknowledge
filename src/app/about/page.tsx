"use client";

import dynamic from "next/dynamic";
import { AboutHero } from "@/components/about/AboutHero";
import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { PageBanner } from "@/components/ui/PageBanner";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { SITE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { YouTubeSection } from "@/components/about/YouTubeSection";
import { CertificationsList } from "@/components/about/CertificationsList";
import { Award, Heart, Sparkles, Users } from "lucide-react";

const AchievementsSection = dynamic(
  () => import("@/components/home/AchievementsSection").then((m) => ({ default: m.AchievementsSection })),
  { loading: () => <div className="h-40 animate-pulse rounded-2xl bg-gold/5" /> }
);

const stats = [
  { icon: Users, value: 75000, suffix: "+", labelKey: "happyClients" as const },
  { icon: Award, value: 12, suffix: "", labelKey: "yearsExp" as const },
];

export default function AboutPage() {
  const { c } = useLanguage();
  const bioParagraphs = [c.about.bio1, c.about.bio2, c.about.bio3];

  return (
    <PageTransition>
      <PageBanner
        title={SITE.acharya}
        subtitle={c.acharyaTitle}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: c.about.journeyTitle }]}
      />
      <AboutHero />

      <section className="pb-12 md:pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn className="mt-8 md:mt-12">
            <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-cream via-white to-orange/5 p-8 md:p-12 shadow-lg shadow-orange/5">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl motion-safe:animate-pulse-glow" />
              <div className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-gold-bright/10 blur-3xl motion-safe:animate-pulse-glow" />

              <div className="relative">
                <div className="mb-8 flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                    {c.about.journeyTitle} <span className="text-gradient-gold">{c.about.journeyTitleAccent}</span>
                  </h2>
                  <Sparkles className="h-5 w-5 text-gold" />
                </div>

                <div className="space-y-6">
                  {bioParagraphs.map((paragraph, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 }}
                      className="relative rounded-2xl border border-gold/15 bg-white/80 p-6 backdrop-blur-sm md:p-8"
                    >
                      <span className="absolute -left-1 top-4 font-display text-5xl leading-none text-gold/20 select-none">&ldquo;</span>
                      <p className="relative text-text-body leading-relaxed md:text-lg md:leading-relaxed pl-6">
                        {paragraph}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="mt-16">
            <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
              {stats.map((stat, i) => (
                <motion.div key={i} className="rounded-2xl glass-card p-6 text-center" whileHover={{ y: -5 }}>
                  <stat.icon className="mx-auto h-8 w-8 text-gold mb-3" />
                  <p className="text-3xl font-bold text-text-primary"><AnimatedCounter value={stat.value} suffix={stat.suffix} /></p>
                  <p className="text-sm text-text-muted">{c.about[stat.labelKey]}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>

          <CertificationsList />

          <YouTubeSection />

          <AchievementsSection />

          <FadeIn className="mt-20 text-center">
            <Heart className="mx-auto h-10 w-10 text-gold mb-4" />
            <h2 className="font-display text-2xl font-bold text-text-primary">{c.about.missionTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-text-body">{c.about.missionText}</p>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
