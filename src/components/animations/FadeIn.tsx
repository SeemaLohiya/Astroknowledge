"use client";

import { cn } from "@/lib/cn";
import { ReactNode } from "react";
import { RevealOnScroll, type RevealVariant } from "./RevealOnScroll";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  scale?: boolean;
  scroll?: boolean;
  variant?: RevealVariant;
}

export function FadeIn({
  children,
  delay = 0,
  className,
  scale,
  scroll = false,
  variant = "fade-up",
}: FadeInProps) {
  if (scroll) {
    return (
      <RevealOnScroll delay={delay} variant={scale ? "scale" : variant} className={className}>
        {children}
      </RevealOnScroll>
    );
  }

  return (
    <div
      className={cn("animate-fade-in-up", scale && "animate-scale-in", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}
