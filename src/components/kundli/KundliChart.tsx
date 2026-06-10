"use client";

import { KundliData } from "@/lib/kundli";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

/** North-Indian diamond kundli — 12 houses in classic layout */
const HOUSE_POSITIONS: { house: number; x: number; y: number }[] = [
  { house: 1, x: 50, y: 12 },
  { house: 2, x: 75, y: 25 },
  { house: 3, x: 88, y: 50 },
  { house: 4, x: 75, y: 75 },
  { house: 5, x: 50, y: 88 },
  { house: 6, x: 25, y: 75 },
  { house: 7, x: 12, y: 50 },
  { house: 8, x: 25, y: 25 },
  { house: 9, x: 50, y: 38 },
  { house: 10, x: 62, y: 50 },
  { house: 11, x: 50, y: 62 },
  { house: 12, x: 38, y: 50 },
];

interface KundliChartProps {
  data: KundliData;
  compact?: boolean;
}

export function KundliChart({ data, compact }: KundliChartProps) {
  return (
    <div className={compact ? "" : "relative"}>
      {!compact && (
        <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-gold/20 via-orange/10 to-transparent blur-2xl animate-pulse-glow" />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 0.68, 0.2, 1] }}
        className="relative overflow-hidden rounded-2xl border-2 border-gold/40 bg-gradient-to-br from-amber-50 via-cream to-orange/10 p-4 shadow-xl shadow-gold/15"
      >
        <div className="absolute inset-0 kundli-cosmic-bg opacity-40" />
        <Sparkles className="absolute right-3 top-3 h-5 w-5 text-gold animate-pulse" />

        <div className="relative mb-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">जन्म कुंडली</p>
          <h3 className="font-display text-lg font-bold text-text-primary">{data.name}</h3>
          {data.fatherName && <p className="text-xs text-text-muted">पिता: {data.fatherName}</p>}
          {data.gotra && <p className="text-xs text-gold font-medium">गोत्र: {data.gotra}</p>}
        </div>

        <div className="relative mx-auto aspect-square max-w-sm">
          <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-md">
            <defs>
              <linearGradient id="kundliGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            <polygon points="50,2 98,50 50,98 2,50" fill="url(#kundliGrad)" stroke="#d97706" strokeWidth="0.8" />
            <line x1="50" y1="2" x2="50" y2="98" stroke="#d97706" strokeWidth="0.4" opacity="0.6" />
            <line x1="2" y1="50" x2="98" y2="50" stroke="#d97706" strokeWidth="0.4" opacity="0.6" />
            <line x1="26" y1="26" x2="74" y2="74" stroke="#d97706" strokeWidth="0.3" opacity="0.4" />
            <line x1="74" y1="26" x2="26" y2="74" stroke="#d97706" strokeWidth="0.3" opacity="0.4" />

            {HOUSE_POSITIONS.map((pos, i) => {
              const house = data.houses.find((h) => h.house === pos.house);
              return (
                <motion.g
                  key={pos.house}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                >
                  <text x={pos.x} y={pos.y - 2} textAnchor="middle" className="fill-gold text-[2.5px] font-bold">
                    {pos.house}
                  </text>
                  {house?.planets.map((p, pi) => (
                    <text
                      key={p}
                      x={pos.x}
                      y={pos.y + 3 + pi * 3.5}
                      textAnchor="middle"
                      className="fill-orange-700 text-[3px] font-bold"
                    >
                      {p}
                    </text>
                  ))}
                </motion.g>
              );
            })}
          </svg>

          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          >
            <div className="h-[85%] w-[85%] rounded-full border border-dashed border-gold/25" />
          </motion.div>
        </div>

        <div className="relative mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          {[
            { label: "Lagna", value: data.lagnaHindi, sub: data.lagna },
            { label: "Rashi", value: data.rashiHindi, sub: data.rashi },
            { label: "Nakshatra", value: data.nakshatra, sub: "Janma" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-xl border border-gold/20 bg-white/70 px-2 py-2 backdrop-blur-sm"
            >
              <p className="text-[10px] uppercase tracking-wide text-text-muted">{item.label}</p>
              <p className="font-bold text-gold">{item.value}</p>
              <p className="text-[9px] text-text-body truncate">{item.sub}</p>
            </motion.div>
          ))}
        </div>

        {(data.dob || data.birthPlace) && (
          <p className="relative mt-3 text-center text-[10px] text-text-muted">
            {data.dob}{data.birthTime ? ` · ${data.birthTime}` : ""}{data.birthPlace ? ` · ${data.birthPlace}` : ""}
          </p>
        )}
      </motion.div>
    </div>
  );
}
