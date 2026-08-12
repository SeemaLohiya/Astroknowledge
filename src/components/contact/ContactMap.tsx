"use client";

import { SITE } from "@/lib/constants";
import { MapPin, Navigation } from "lucide-react";
import { useState } from "react";

/** Static map image — no iframe, avoids CSP / third-party embed blocks. */
const STATIC_MAP_URL =
  "https://staticmap.openstreetmap.de/staticmap.php?center=26.9124,75.7873&zoom=14&size=800x420&markers=26.9124,75.7873,red-pushpin";

export function ContactMap() {
  const [mapError, setMapError] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl glass-card shadow-lg shadow-orange/5">
      <a
        href={SITE.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block h-[min(420px,60vh)] min-h-[320px] w-full overflow-hidden bg-gradient-to-br from-orange/10 via-cream to-gold/10"
        aria-label="Open AstroKnowledge location in Google Maps"
      >
        {!mapError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={STATIC_MAP_URL}
            alt="Map showing AstroKnowledge location in Jaipur, Rajasthan"
            className="contact-map-image absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={() => setMapError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/15">
              <MapPin className="h-8 w-8 text-gold" />
            </div>
            <p className="font-semibold text-text-primary">{SITE.address}</p>
            <p className="text-sm text-text-muted">Tap to open directions in Google Maps</p>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/15" />

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl border border-white/25 bg-black/45 px-4 py-3 text-white backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-gold" />
            <span>{SITE.address}</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold">
            <Navigation className="h-3.5 w-3.5" />
            Directions
          </span>
        </div>
      </a>

      <div className="flex flex-wrap items-center justify-center gap-3 border-t border-gold/10 bg-white/80 px-4 py-3">
        <a
          href={SITE.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold hover:underline"
        >
          <MapPin className="h-4 w-4" /> Open in Google Maps
        </a>
      </div>
    </div>
  );
}
