"use client";

import { ZODIAC_SIGNS } from "@/lib/constants";
import { motion } from "framer-motion";

const HOUSES = Array.from({ length: 12 }, (_, i) => i + 1);

export function KundaliWheel({ size = 300 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full kundali-wheel opacity-60"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border-2 border-gold/40"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-8 rounded-full border border-gold/30 bg-cream/80 backdrop-blur-sm" />

      {HOUSES.map((house, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const r = size * 0.38;
        const x = size / 2 + r * Math.cos(angle) - 16;
        const y = size / 2 + r * Math.sin(angle) - 16;
        const sign = ZODIAC_SIGNS[i];

        return (
          <motion.div
            key={house}
            className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 text-sm border border-gold/20"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ scale: 1.3, backgroundColor: "rgba(245,200,66,0.3)" }}
          >
            {sign.symbol}
          </motion.div>
        );
      })}

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="text-center">
          <p className="text-2xl">☉</p>
          <p className="text-[10px] text-gold font-semibold">KUNDALI</p>
        </div>
      </motion.div>

      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-gold"
          style={{
            left: `${25 + i * 15}%`,
            top: `${20 + (i % 2) * 60}%`,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
        />
      ))}
    </div>
  );
}
