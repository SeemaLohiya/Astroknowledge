"use client";

/** Animated gradient divider between homepage sections. */
export function SectionPartition({ variant = "default" }: { variant?: "default" | "bold" | "subtle" }) {
  const height = variant === "bold" ? "h-[3px]" : variant === "subtle" ? "h-px" : "h-[2px]";

  return (
    <div className="section-partition relative mx-auto max-w-5xl px-4 py-6 md:py-8" aria-hidden>
      <div className={`relative ${height} w-full overflow-hidden rounded-full`}>
        <div className="section-partition-track absolute inset-0 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="section-partition-beam absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />
      </div>
      <div className="section-partition-ornament pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse-glow" />
        <span className="h-2 w-2 rotate-45 border border-gold/60 bg-cream animate-breathe" />
        <span className="h-1.5 w-1.5 rounded-full bg-orange animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
      </div>
    </div>
  );
}
