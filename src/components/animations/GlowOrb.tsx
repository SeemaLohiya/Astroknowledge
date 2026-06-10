"use client";

import { motion } from "framer-motion";

export function GlowOrb({
  className = "",
  color = "purple",
}: {
  className?: string;
  color?: "purple" | "gold" | "teal";
}) {
  const colors = {
    purple: "from-gold/30 via-gold-bright/15 to-transparent",
    gold: "from-gold/40 via-gold-bright/20 to-transparent",
    teal: "from-gold-bright/25 via-gold-soft/15 to-transparent",
  };

  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-radial blur-3xl ${colors[color]} ${className}`}
      animate={{
        scale: [1, 1.25, 1.1, 1],
        opacity: [0.25, 0.55, 0.4, 0.25],
        x: [0, 15, -10, 0],
        y: [0, -10, 15, 0],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
