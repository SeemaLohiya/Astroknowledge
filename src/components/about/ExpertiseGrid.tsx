"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { ShimmerText } from "@/components/animations/ShimmerText";
import { expertiseAreas, headlineCertifications } from "@/lib/data/expertise";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Award, GraduationCap, Sparkles } from "lucide-react";
import { useRef } from "react";

function ExpertiseCard({
  title,
  titleHindi,
  description,
  descriptionHindi,
  icon,
  accent,
  index,
}: {
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  icon: string;
  accent: string;
  index: number;
}) {
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-80, 80], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-80, 80], [-8, 8]), { stiffness: 300, damping: 30 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 6) * 0.06, duration: 0.5 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className={`group relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br ${accent} p-5 shadow-sm transition-shadow hover:shadow-xl hover:shadow-gold/10`}
    >
      <motion.div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/15 blur-2xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4 + (index % 3), repeat: Infinity }}
      />
      <div className="relative flex items-start gap-3">
        <motion.span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/90 text-xl shadow-md"
          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text-primary leading-snug">
            {lang === "hi" ? titleHindi : title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-text-body md:text-sm">
            {lang === "hi" ? descriptionHindi : description}
          </p>
        </div>
      </div>
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-gold to-orange group-hover:w-full transition-all duration-500"
        layout
      />
    </motion.div>
  );
}

export function ExpertiseGrid() {
  const { t } = useLanguage();

  return (
    <FadeIn className="mt-16">
      <div id="certifications" className="scroll-mt-24" />

      <div className="mb-10 text-center">
        <GraduationCap className="mx-auto h-10 w-10 text-gold mb-3" />
        <h2 className="font-display text-2xl font-bold text-text-primary md:text-4xl">
          <ShimmerText>{t("certifications")}</ShimmerText>
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-body md:text-base">
          Mastery across classical and modern Jyotish systems — each specialization backed by years of practice and teaching.
        </p>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {headlineCertifications.map((cert, i) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="relative overflow-hidden rounded-2xl border-2 border-gold/30 bg-gradient-to-br from-gold/15 via-white to-orange/10 p-6 text-center shadow-lg"
          >
            <Sparkles className="absolute right-3 top-3 h-5 w-5 text-gold/40" />
            <Award className="mx-auto h-8 w-8 text-gold" />
            <h3 className="mt-3 font-bold text-text-primary">{cert.title}</h3>
            <p className="mt-1 text-sm text-text-body">{cert.subtitle}</p>
          </motion.div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
        <span className="text-xs font-bold uppercase tracking-widest text-gold">Expertise In</span>
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ perspective: 1200 }}>
        {expertiseAreas.map((area, i) => (
          <ExpertiseCard key={area.id} {...area} index={i} />
        ))}
      </div>
    </FadeIn>
  );
}
