"use client";

import { ZODIAC_DETAILS, ZodiacSignDetail } from "@/lib/data/zodiac";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/cn";
import { Star } from "lucide-react";
import { useState } from "react";

function ZodiacDetail({ sign, hi }: { sign: ZodiacSignDetail; hi: boolean }) {
  return (
    <div
      className="mt-4 rounded-2xl border bg-white/80 p-5 md:p-6"
      style={{ borderColor: `${sign.color}44`, boxShadow: `0 8px 32px ${sign.color}18` }}
    >
      <div className="flex flex-wrap items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-2xl text-white"
          style={{ background: `linear-gradient(135deg, ${sign.color}, ${sign.color}99)` }}
        >
          {sign.symbol}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-display text-xl font-bold text-text-primary">
            {hi ? sign.hindi : sign.sign}{" "}
            <span className="text-sm font-normal text-text-muted">({sign.dates})</span>
          </h4>
          <p className="mt-1 text-sm font-medium" style={{ color: sign.color }}>
            {hi ? sign.elementHindi : sign.element} · {hi ? sign.rulerHindi : sign.ruler}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-text-body">{hi ? sign.descriptionHindi : sign.description}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gold">Strengths</p>
          <ul className="space-y-1 text-sm text-text-body">
            {sign.strengths.map((s) => (
              <li key={s} className="flex gap-2">
                <Star className="mt-0.5 h-3 w-3 shrink-0 text-gold" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gold">Growth areas</p>
          <ul className="space-y-1 text-sm text-text-body">
            {sign.challenges.map((s) => (
              <li key={s} className="flex gap-2">
                <Star className="mt-0.5 h-3 w-3 shrink-0 text-orange" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1">Gem: {sign.luckyGem}</span>
        <span className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1">Day: {sign.luckyDay}</span>
      </div>
    </div>
  );
}

interface ZodiacTabsPanelProps {
  className?: string;
  compact?: boolean;
  showTitle?: boolean;
}

export function ZodiacTabsPanel({ className, compact, showTitle = true }: ZodiacTabsPanelProps) {
  const { lang } = useLanguage();
  const hi = lang === "hi";
  const [selected, setSelected] = useState<ZodiacSignDetail>(ZODIAC_DETAILS[0]);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-gold/15 bg-white/60 px-4 py-5 md:px-6", className)}>
      {showTitle && (
        <p className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
          12 Rashis · Zodiac Wheel
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2">
        {ZODIAC_DETAILS.map((sign) => {
          const active = selected.id === sign.id;
          return (
            <button
              key={sign.id}
              type="button"
              onClick={() => setSelected(sign)}
              className={cn(
                "zodiac-tab flex items-center gap-2 rounded-xl border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm",
                active
                  ? "border-gold/50 bg-white shadow-md scale-[1.02]"
                  : "border-gold/20 bg-orange/5 hover:border-gold/40 hover:bg-gold/5"
              )}
              aria-pressed={active}
              aria-label={`${sign.sign} zodiac sign`}
            >
              <span
                className={cn(
                  "flex shrink-0 items-center justify-center rounded-lg text-white",
                  compact ? "h-7 w-7 text-sm" : "h-8 w-8 text-base"
                )}
                style={{ background: sign.color }}
              >
                {sign.symbol}
              </span>
              <span className={cn("font-semibold", active ? "text-gold" : "text-text-primary")}>
                {hi ? sign.hindi : sign.sign}
              </span>
            </button>
          );
        })}
      </div>
      <ZodiacDetail sign={selected} hi={hi} />
    </div>
  );
}
