"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { QuickConsultCTA } from "@/components/home/QuickConsultCTA";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";
import { SITE } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

export default function ContactPage() {
  const { t, c } = useLanguage();

  return (
    <PageTransition>
      <PageBanner
        title={c.contact.title}
        subtitle={c.contact.subtitle}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: c.contact.title }]}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <FadeIn>
              <div className="space-y-4">
                {[
                  { icon: Phone, label: c.contact.phone, value: SITE.phone, href: `tel:${SITE.phone}` },
                  { icon: MessageCircle, label: c.contact.whatsapp, value: SITE.phone, href: `https://wa.me/${SITE.whatsapp}` },
                  { icon: Mail, label: c.contact.email, value: SITE.email, href: `mailto:${SITE.email}` },
                  { icon: MapPin, label: c.contact.address, value: SITE.address, href: SITE.mapsUrl },
                  { icon: Clock, label: c.contact.hours, value: SITE.consultationHours },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    className="flex items-start gap-4 rounded-xl glass-card glass-card-hover p-5"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/10">
                      <item.icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.label === c.contact.address ? "_blank" : undefined}
                          rel="noopener"
                          className="font-medium text-text-primary transition-colors hover:text-gold"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium text-text-primary">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}

                <Button
                  href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hello AstroKnowledge, I would like to get in touch.")}`}
                  variant="whatsapp"
                  size="lg"
                  className="mt-4 w-full"
                >
                  <MessageCircle className="h-5 w-5" /> {c.contact.whatsappButton}
                </Button>
                <Button href={SITE.mapsUrl} variant="secondary" size="lg" className="w-full">
                  <ExternalLink className="h-5 w-5" /> {t("viewLocation")}
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="overflow-hidden rounded-2xl glass-card shadow-lg shadow-orange/5">
                <iframe
                  title="AstroKnowledge Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.5!2d75.7873!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzQ0LjciTiA3NcKwNDcnMTQuMyJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="h-80 w-full border-0 lg:min-h-[420px] lg:h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="border-t border-gold/10 p-4 text-center">
                  <a
                    href={SITE.mapsUrl}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:underline"
                  >
                    <MapPin className="h-4 w-4" /> {c.contact.openMaps}
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <QuickConsultCTA />
    </PageTransition>
  );
}
