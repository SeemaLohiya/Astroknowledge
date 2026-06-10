"use client";

import { cn } from "@/lib/cn";
import { ReactNode, useEffect, useRef, useState } from "react";

export type RevealVariant = "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "blur-up" | "zoom";

const VARIANT_CLASS: Record<RevealVariant, string> = {
  "fade-up": "reveal-fade-up",
  "fade-down": "reveal-fade-down",
  "fade-left": "reveal-fade-left",
  "fade-right": "reveal-fade-right",
  scale: "reveal-scale",
  "blur-up": "reveal-blur-up",
  zoom: "reveal-zoom",
};

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  once?: boolean;
  threshold?: number;
}

/** Plays a one-shot entrance animation when the element enters the viewport. */
export function RevealOnScroll({
  children,
  className,
  delay = 0,
  variant = "fade-up",
  once = true,
  threshold = 0.12,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      className={cn("reveal-on-scroll", visible && "reveal-visible", visible && VARIANT_CLASS[variant], className)}
      style={{ "--reveal-delay": `${delay}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
