"use client";

import { motion } from "framer-motion";

const SHAPES = ["✦", "◇", "○", "△", "☽", "☉"];

export function FloatingShape({
  className = "",
  shape,
  delay = 0,
  duration = 6,
}: {
  className?: string;
  shape?: string;
  delay?: number;
  duration?: number;
}) {
  const s = shape || SHAPES[Math.floor(delay * 3) % SHAPES.length];

  return (
    <motion.span
      className={`pointer-events-none absolute text-gold/20 select-none ${className}`}
      animate={{
        y: [0, -20, 0],
        x: [0, 10, -5, 0],
        rotate: [0, 180, 360],
        opacity: [0.2, 0.5, 0.2],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
      aria-hidden
    >
      {s}
    </motion.span>
  );
}
