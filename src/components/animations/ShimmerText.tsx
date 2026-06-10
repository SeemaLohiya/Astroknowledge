import { cn } from "@/lib/cn";

/** Visible gold text with animated shimmer — never transparent. */
export function ShimmerText({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={cn("relative inline-block font-bold text-gold animate-text-shimmer", className)}>
      {children}
    </span>
  );
}
