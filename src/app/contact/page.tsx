"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { QuickConsultCTA } from "@/components/home/QuickConsultCTA";
import { Button } from "@/components/ui/Button";
import { PageBanner } from "@/components/ui/PageBanner";
import { SITE, telLink, whatsappLink } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { motion } from "framer-motion";
import { Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { ContactMap } from "@/components/contact/ContactMap";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

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
                  { icon: Phone, label: c.contact.phone, value: SITE.phone, href: telLink() },
                  { icon: WhatsAppIcon, label: c.contact.whatsapp, value: SITE.phone, href: whatsappLink() },
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
                  href={whatsappLink("Hello AstroKnowledge, I would like to get in touch.")}
                  variant="whatsapp"
                  size="lg"
                  className="mt-4 w-full"
                >
                  <WhatsAppIcon className="h-5 w-5" /> {c.contact.whatsappButton}
                </Button>
                <Button href={SITE.mapsUrl} variant="secondary" size="lg" className="w-full">
                  <ExternalLink className="h-5 w-5" /> {t("viewLocation")}
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <ContactMap />
            </FadeIn>
          </div>
        </div>
      </section>

      <QuickConsultCTA />
    </PageTransition>
  );
}
