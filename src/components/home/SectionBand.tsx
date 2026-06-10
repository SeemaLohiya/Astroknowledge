import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const VARIANTS = {
  cream: "section-band-cream",
  peach: "section-band-peach",
  lavender: "section-band-lavender",
  sky: "section-band-sky",
  gold: "section-band-gold",
  coral: "section-band-coral",
  mint: "section-band-mint",
} as const;

type Variant = keyof typeof VARIANTS;

/** Alternating colorful section backgrounds on the homepage. */
export function SectionBand({ children, variant = "cream" }: { children: ReactNode; variant?: Variant }) {
  return <div className={cn("section-band relative", VARIANTS[variant])}>{children}</div>;
}
