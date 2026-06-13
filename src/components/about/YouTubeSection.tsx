"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { YOUTUBE_CHANNEL_URL } from "@/lib/data/youtube";
import { SITE } from "@/lib/constants";
import { YouTubeIcon } from "@/components/ui/SocialIcons";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export function YouTubeSection() {
  return (
    <FadeIn className="mt-20">
      <div id="youtube" className="scroll-mt-24" />
      <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-red-50/80 via-white to-orange/5 p-8 md:p-12 shadow-xl shadow-red-500/5">
        <motion.div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-600"
          >
            <YouTubeIcon className="h-4 w-4" />
            YouTube Channel
          </motion.div>

          <h2 className="mt-5 font-display text-2xl font-bold text-text-primary md:text-3xl">
            Learn with <span className="text-gradient-gold">{SITE.acharya}</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-text-body md:text-base">
            Subscribe to our YouTube channel for Vedic astrology insights, spiritual remedies, healing practices,
            mantra wisdom, and live teachings from {SITE.acharya}. New videos on Kundali analysis, planetary remedies,
            and practical Jyotish guidance are shared regularly for seekers across India and worldwide.
          </p>

          <p className="mt-3 text-sm text-text-muted">
            Watch detailed explanations on serpent power, third eye activation, mantras, and scientific Vedic perspectives
            — all shared directly on our official channel.
          </p>

          <motion.a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25"
          >
            <YouTubeIcon className="h-5 w-5" />
            Visit YouTube Channel
            <ExternalLink className="h-4 w-4 opacity-80" />
          </motion.a>
        </div>
      </div>
    </FadeIn>
  );
}
