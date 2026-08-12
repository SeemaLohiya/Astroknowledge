"use client";

import { SITE } from "@/lib/constants";
import { MapPin, Navigation } from "lucide-react";

/** Self-hosted SVG map — always renders, no external API dependency. */
function JaipurMapVisual() {
  return (
    <svg
      viewBox="0 0 800 420"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <linearGradient id="mapBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8f4e8" />
          <stop offset="50%" stopColor="#f5f0e8" />
          <stop offset="100%" stopColor="#e8eef5" />
        </linearGradient>
        <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
        <filter id="pinShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      <rect width="800" height="420" fill="url(#mapBg)" />

      {/* Parks / blocks */}
      <rect x="40" y="50" width="180" height="120" rx="8" fill="#c8e6c9" opacity="0.5" />
      <rect x="560" y="280" width="200" height="100" rx="8" fill="#c8e6c9" opacity="0.4" />
      <rect x="600" y="40" width="150" height="90" rx="8" fill="#bbdefb" opacity="0.35" />

      {/* Roads grid */}
      {[80, 160, 240, 320].map((y) => (
        <rect key={`h${y}`} x="0" y={y} width="800" height="14" fill="url(#roadGrad)" opacity="0.7" />
      ))}
      {[100, 220, 340, 460, 580, 700].map((x) => (
        <rect key={`v${x}`} x={x} y="0" width="12" height="420" fill="url(#roadGrad)" opacity="0.6" />
      ))}

      {/* Main road highlight */}
      <path d="M 0 210 Q 200 200 400 210 T 800 205" stroke="#fff" strokeWidth="20" fill="none" opacity="0.5" />
      <path d="M 350 0 Q 360 150 355 300 T 350 420" stroke="#fff" strokeWidth="16" fill="none" opacity="0.45" />

      {/* Location pin — Jaipur center ~26.9124, 75.7873 */}
      <g transform="translate(400, 195)" filter="url(#pinShadow)">
        <ellipse cx="0" cy="28" rx="14" ry="5" fill="#000" opacity="0.2" />
        <path
          d="M 0 -32 C 18 -32 28 -18 28 -4 C 28 14 0 36 0 36 C 0 36 -28 14 -28 -4 C -28 -18 -18 -32 0 -32 Z"
          fill="#EA580C"
        />
        <circle cx="0" cy="-6" r="10" fill="#fff" />
        <circle cx="0" cy="-6" r="5" fill="#EA580C" />
      </g>

      {/* Labels */}
      <text x="400" y="250" textAnchor="middle" fill="#1f2937" fontSize="15" fontWeight="700" fontFamily="system-ui,sans-serif">
        Jaipur, Rajasthan
      </text>
      <text x="400" y="272" textAnchor="middle" fill="#6b7280" fontSize="12" fontFamily="system-ui,sans-serif">
        AstroKnowledge
      </text>
    </svg>
  );
}

export function ContactMap() {
  return (
    <div className="overflow-hidden rounded-2xl glass-card shadow-lg shadow-orange/5">
      <a
        href={SITE.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block h-[min(380px,55vh)] min-h-[280px] w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-cream to-sky-50"
        aria-label="Open AstroKnowledge location in Google Maps"
      >
        <JaipurMapVisual />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/20" />

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl border border-white/30 bg-black/50 px-4 py-3 text-white backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 shrink-0 text-gold" />
            <span>{SITE.address}</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
            <Navigation className="h-3.5 w-3.5" />
            Get Directions
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
