"use client";

import { FounderImage } from "@/components/animations/FounderImage";
import { ShimmerText } from "@/components/animations/ShimmerText";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";
import { YOUTUBE_CHANNEL_URL } from "@/lib/data/youtube";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion, useReducedMotion } from "framer-motion";
import { Award, ExternalLink, Sparkles, Star, Video } from "lucide-react";
import Link from "next/link";

export function AboutHero() {
  const { c } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="pointer-events-none absolute inset-0">
        {!reduceMotion && (
          <>
            <motion.div
              className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
              animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-orange/15 blur-3xl"
              animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
          </>
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(255,248,240,0.9)_100%)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-[minmax(280px,380px)_1fr] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-full max-w-sm lg:mx-0"
        >
          {!reduceMotion && (
            <>
              <motion.div
                className="absolute -inset-4 rounded-[2rem] border border-gold/20"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -inset-8 rounded-[2.5rem] border border-dashed border-gold/15"
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
              />
            </>
          )}
          <div className="relative">
            <FounderImage size="xl" showGlow showRing className="mx-auto" />
            {!reduceMotion && (
              <motion.div
                className="absolute -bottom-4 -right-4 hidden rounded-2xl border-2 border-gold/40 bg-white p-2 shadow-xl lg:block"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <Award className="h-8 w-8 text-gold" />
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gradient-to-r from-gold/15 to-orange/10 px-4 py-1.5 text-sm font-semibold text-gold"
          >
            <Star className="h-4 w-4" />
            {c.about.shastracharya}
            <Sparkles className="h-4 w-4 animate-pulse" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl"
          >
            <ShimmerText>{SITE.acharya}</ShimmerText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-base text-text-body md:text-lg"
          >
            {c.acharyaTitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 max-w-xl text-sm leading-relaxed text-text-muted md:text-base"
          >
            {c.about.bio1.slice(0, 180)}…
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start"
          >
            <Button href="/dashboard/slots" variant="secondary" size="lg">
              {c.about.bookConsultation}
            </Button>
            <Button href={YOUTUBE_CHANNEL_URL} variant="outline" size="lg" className="gap-2">
              <Video className="h-4 w-4" />
              YouTube
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </Button>
          </motion.div>

          <Link
            href="#youtube"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline"
          >
            Watch teachings below <span aria-hidden>↓</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
