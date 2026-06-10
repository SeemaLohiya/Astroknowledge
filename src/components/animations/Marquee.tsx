"use client";

import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  className?: string;
}

export function Marquee({ children, speed = "normal", direction = "left", className = "" }: MarqueeProps) {
  const speedClass = { slow: "animate-marquee-slow", normal: "animate-marquee", fast: "animate-marquee-fast" }[speed];
  const dirClass = direction === "right" ? "animate-marquee-reverse" : "";

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`flex w-max gap-8 ${speedClass} ${dirClass}`}>
        {children}
        {children}
      </div>
    </div>
  );
}
