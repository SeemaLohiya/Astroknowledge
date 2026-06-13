"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { buildSeedCertifications } from "@/lib/data/achievements";
import { fetchJson } from "@/lib/fetch-json";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { CertificationEntry } from "@/lib/types";
import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

const fallbackCertifications = buildSeedCertifications();

export function CertificationsList() {
  const { t, lang } = useLanguage();
  const [certifications, setCertifications] = useState<CertificationEntry[]>(fallbackCertifications);

  useEffect(() => {
    void fetchJson<{ items?: CertificationEntry[] }>("/api/content/certifications").then((res) => {
      if (res.data?.items?.length) setCertifications(res.data.items);
    });
  }, []);

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
        {certifications.map((cert, i) => {
          const title = lang === "hi" && cert.titleHindi ? cert.titleHindi : cert.title;
          return (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl border border-gold/20 bg-gradient-to-br from-white to-orange/5 p-5"
              whileHover={{ y: -4 }}
            >
              <Award className="h-6 w-6 text-gold mb-3" />
              <h3 className="font-semibold text-text-primary">{title}</h3>
              {cert.subtitle ? <p className="mt-1 text-sm text-text-body">{cert.subtitle}</p> : null}
            </motion.div>
          );
        })}
      </div>
    </FadeIn>
  );
}
