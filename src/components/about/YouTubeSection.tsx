"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { YOUTUBE_CHANNEL_URL } from "@/lib/data/youtube";
import { SITE } from "@/lib/constants";
import { motion } from "framer-motion";
import { ExternalLink, Play, Video } from "lucide-react";
import { useEffect, useState } from "react";

interface YtVideo {
  id: string;
  title: string;
}

export function YouTubeSection() {
  const [videos, setVideos] = useState<YtVideo[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/youtube/feed")
      .then((r) => r.json())
      .then((d: { videos?: YtVideo[] }) => {
        const list = d.videos || [];
        setVideos(list);
        if (list.length) setActive(0);
      })
      .finally(() => setLoading(false));
  }, []);

  const current = videos[active];

  return (
    <FadeIn className="mt-20">
      <div id="youtube" className="scroll-mt-24" />
      <div className="relative overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-red-50/80 via-white to-orange/5 p-6 md:p-10 shadow-xl shadow-red-500/5">
        <motion.div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-500/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="lg:w-2/5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-4 py-1.5 text-sm font-semibold text-red-600"
            >
              <Video className="h-4 w-4" />
              YouTube Channel
            </motion.div>
            <h2 className="mt-4 font-display text-2xl font-bold text-text-primary md:text-3xl">
              Learn with <span className="text-gradient-gold">{SITE.acharya}</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-body md:text-base">
              Watch Vedic wisdom, remedies, and spiritual guidance — astrology insights, healing practices, and live teachings.
            </p>
            <motion.a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/25"
            >
              <Video className="h-5 w-5" />
              Subscribe on YouTube
              <ExternalLink className="h-4 w-4 opacity-80" />
            </motion.a>
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="aspect-video animate-pulse rounded-2xl bg-gold/10" />
            ) : current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="overflow-hidden rounded-2xl border border-gold/20 shadow-2xl"
              >
                <div className="relative aspect-video w-full bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${current.id}?rel=0&modestbranding=1`}
                    title={current.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                  />
                </div>
                <p className="bg-white/90 px-4 py-3 text-sm font-medium text-text-primary line-clamp-2">
                  {current.title}
                </p>
              </motion.div>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-dashed border-gold/30 bg-white/60 p-8 text-center">
                <Play className="h-12 w-12 text-gold/50" />
                <p className="mt-3 text-sm text-text-muted">Visit our channel for the latest videos</p>
                <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener" className="mt-2 text-sm font-semibold text-red-600 hover:underline">
                  Open YouTube Channel
                </a>
              </div>
            )}

            {videos.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin">
                {videos.map((v, i) => (
                  <motion.button
                    key={v.id}
                    type="button"
                    onClick={() => setActive(i)}
                    whileHover={{ y: -3 }}
                    className={`snap-start shrink-0 w-36 overflow-hidden rounded-xl border text-left transition-all ${
                      active === i ? "border-gold ring-2 ring-gold/30" : "border-gold/15 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="relative aspect-video bg-black/80">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <p className="p-2 text-[10px] font-medium text-text-primary line-clamp-2">{v.title}</p>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

