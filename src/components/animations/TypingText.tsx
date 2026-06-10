"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function TypingText({ texts, className = "" }: { texts: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const current = texts[index];
    if (charIndex < current.length) {
      const timeout = setTimeout(() => {
        setDisplayed(current.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCharIndex(0);
        setDisplayed("");
        setIndex((index + 1) % texts.length);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, index, texts]);

  return (
    <motion.span className={`ai-cursor ${className}`}>
      {displayed}
    </motion.span>
  );
}
