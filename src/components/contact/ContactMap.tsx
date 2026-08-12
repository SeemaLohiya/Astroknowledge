"use client";

import { SITE } from "@/lib/constants";
import { MapPin } from "lucide-react";

/** Reliable map embed — OpenStreetMap works without API keys (Google embed often fails). */
export function ContactMap() {
  return (
    <div className="overflow-hidden rounded-2xl glass-card shadow-lg shadow-orange/5">
      <div className="relative h-[min(420px,60vh)] min-h-[320px] w-full bg-gradient-to-br from-cream via-white to-orange/5">
        <iframe
          title="AstroKnowledge — Jaipur, Rajasthan"
          src={SITE.mapsOsmEmbedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/10" />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gold/10 bg-white/80 px-4 py-3">
        <p className="flex items-center gap-2 text-sm text-text-body">
          <MapPin className="h-4 w-4 shrink-0 text-gold" />
          {SITE.address}
        </p>
        <a
          href={SITE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
        >
          Open in Google Maps →
        </a>
      </div>
    </div>
  );
}
