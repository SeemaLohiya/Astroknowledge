"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { certifications } from "@/lib/data/achievements";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";

export function CertificationsList() {
  const { t } = useLanguage();

  return (
    <FadeIn className="mt-16">
      <div id="certifications" className="scroll-mt-24" />
      <div className="text-center mb-8">
        <GraduationCap className="mx-auto h-10 w-10 text-gold mb-3" />
        <h2 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
          {t("certifications")}
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => (
          <motion.div
            key={cert.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl border border-gold/20 bg-gradient-to-br from-white to-orange/5 p-5"
            whileHover={{ y: -4 }}
          >
            <Award className="h-6 w-6 text-gold mb-3" />
            <h3 className="font-semibold text-text-primary">{cert.title}</h3>
            <p className="mt-1 text-sm text-text-body">{cert.subtitle}</p>
          </motion.div>
        ))}
      </div>
    </FadeIn>
  );
}
