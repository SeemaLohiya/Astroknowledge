"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { FounderImage } from "@/components/animations/FounderImage";
import { PageTransition } from "@/components/animations/PageTransition";
import { PageBanner } from "@/components/ui/PageBanner";
import { AnimatedCounter } from "@/components/animations/AnimatedCounter";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { AchievementsSection } from "@/components/home/AchievementsSection";
import { ExpertiseGrid } from "@/components/about/ExpertiseGrid";
import { YouTubeSection } from "@/components/about/YouTubeSection";
import { Award, Heart, Sparkles, Star, Users } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

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
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
            <div className="relative">
              <FounderImage size="xl" />
              <motion.div className="absolute -bottom-6 -right-6 hidden h-32 w-32 overflow-hidden rounded-2xl border-2 border-gold/30 lg:block" animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <SafeImage src={SITE.acharyaImage} alt={SITE.acharya} fill className="object-cover object-center" />
              </motion.div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-sm text-gold"
              >
                <Star className="h-4 w-4" /> {c.about.shastracharya}
              </motion.div>
              <Button href="/booking" variant="secondary" size="lg" className="mt-4">{c.about.bookConsultation}</Button>
            </div>
          </FadeIn>

          <FadeIn className="mt-16">
            <div className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-cream via-white to-orange/5 p-8 md:p-12 shadow-lg shadow-orange/5">
              <motion.div
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
              />
              <motion.div
                className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-gold-bright/10 blur-3xl"
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              />

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

          <ExpertiseGrid />

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
