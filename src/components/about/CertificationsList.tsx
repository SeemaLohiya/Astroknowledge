"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { certifications, featuredCertifications } from "@/lib/data/achievements";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { Award, GraduationCap } from "lucide-react";

const FEATURED_LOWER = new Set(featuredCertifications.map((t) => t.toLowerCase()));

function overlapsFeatured(title: string, subtitle?: string) {
  const lower = title.toLowerCase();
  const combined = `${title} ${subtitle || ""}`.toLowerCase();

  if (FEATURED_LOWER.has(lower)) return true;
  if (lower.includes("numerology") && lower.includes("expert")) return true;
  if (lower === "expert in kp" || lower === "expert in bnn") return true;
  if (lower.includes("palmistry") && lower.includes("expert")) return true;
  if (lower === "shastracharya") return true;
  if (lower.includes("vastu") && (lower.includes("specialist") || lower.includes("shastra"))) return true;

  return featuredCertifications.some((featured) => {
    const f = featured.toLowerCase();
    return combined.includes(f) || f.includes(lower);
  });
}

function buildCertificationList() {
  const seen = new Set<string>();
  const items: { key: string; title: string; subtitle?: string }[] = [];

  for (const title of featuredCertifications) {
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ key, title });
  }

  for (const cert of certifications) {
    if (overlapsFeatured(cert.title, cert.subtitle)) continue;
    const key = cert.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ key, title: cert.title, subtitle: cert.subtitle });
  }

  return items;
}

const allCertifications = buildCertificationList();

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
        {allCertifications.map((cert, i) => (
          <motion.div
            key={cert.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-2xl border border-gold/20 bg-gradient-to-br from-white to-orange/5 p-5"
            whileHover={{ y: -4 }}
          >
            <Award className="h-6 w-6 text-gold mb-3" />
            <h3 className="font-semibold text-text-primary">{cert.title}</h3>
            {cert.subtitle ? <p className="mt-1 text-sm text-text-body">{cert.subtitle}</p> : null}
          </motion.div>
        ))}
      </div>
    </FadeIn>
  );
}
