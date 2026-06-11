"use client";

import { cn } from "@/lib/cn";
import { ReactNode, useEffect, useRef, useState } from "react";
import type { RevealVariant } from "./RevealOnScroll";

interface LazySectionProps {
  children: React.ReactNode;
  minHeight?: string;
  reveal?: boolean;
  revealVariant?: RevealVariant;
}

/** Mount chil  dren near the viewport, then play a scroll-reveal entrance. */
export function LazySection({
  children,
  minHeight = "280px",
  reveal = true,
  revealVariant = "blur-up",
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const revealClass =
    revealVariant === "fade-up"
      ? "reveal-fade-up"
      : revealVariant === "fade-down"
        ? "reveal-fade-down"
        : revealVariant === "fade-left"
          ? "reveal-fade-left"
          : revealVariant === "fade-right"
            ? "reveal-fade-right"
            : revealVariant === "scale"
              ? "reveal-scale"
              : revealVariant === "zoom"
                ? "reveal-zoom"
                : "reveal-blur-up";

  return (
    <div ref={ref} style={visible ? undefined : { minHeight }}>
      <div
        className={cn(
          reveal && visible && "reveal-on-scroll reveal-visible",
          reveal && visible && revealClass
        )}
      >
        {visible ? children : null}
      </div>
    </div>
  );
}
