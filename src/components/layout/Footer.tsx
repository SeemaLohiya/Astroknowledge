"use client";

import { SITE, telLink, whatsappLink } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { FadeIn } from "../animations/FadeIn";
import { FounderImage } from "../animations/FounderImage";
import { motion } from "framer-motion";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/SocialIcons";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const { c } = useLanguage();

  const footerLinks = {
    services: [
      { label: c.footer.links.kundali, href: "/services#kundali-vishleshan" },
      { label: c.footer.links.kundliMilan, href: "/services#kundli-milan" },
      { label: c.footer.links.vastu, href: "/services#vastu-consultancy" },
      { label: c.footer.links.numerology, href: "/services#numerology" },
      { label: c.footer.links.courses, href: "/courses" },
      { label: c.footer.links.pooja, href: "/pooja" },
    ],
    shop: [
      { label: c.footer.links.rudraksha, href: "/products?category=rudraksha" },
      { label: c.footer.links.gemstone, href: "/products?category=gemstone" },
      { label: c.footer.links.yantra, href: "/products?category=yantra" },
      { label: c.footer.links.poojaKit, href: "/products?category=pooja-kit" },
      { label: c.footer.links.vastuItems, href: "/products?category=vastu" },
      { label: "Healing", href: "/healing" },
    ],
    quick: [
      { label: c.footer.links.bookConsultation, href: "/dashboard/slots" },
      { label: "YouTube", href: SITE.youtube },
      { label: "Instagram", href: SITE.instagram },
      { label: c.footer.links.about, href: "/about" },
      { label: c.footer.links.contact, href: "/contact" },
    ],
  };

  return (
    <footer className="relative bg-cream overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <FadeIn>
          <div className="mb-12 flex flex-col items-center gap-6 rounded-2xl border border-gold/20 bg-white p-8 backdrop-blur-sm md:flex-row shadow-sm shadow-orange/5">
            <FounderImage size="md" />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-text-primary">{SITE.acharya}</h3>
              <p className="text-gold">{c.acharyaTitle}</p>
              <p className="mt-2 text-text-body max-w-md">
                {SITE.experience} {c.hero.yearsLabel}. {SITE.clients} {c.hero.clientsLabel}.
              </p>
            </div>
            <div className="flex gap-3">
              <motion.a
                href={whatsappLink()}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
                whileHover={{ scale: 1.15 }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-[#25D366] hover:bg-[#25D366]/10"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </motion.a>
              <motion.a
                href={SITE.instagram}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                whileHover={{ scale: 1.15 }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-[#E4405F] hover:bg-[#E4405F]/10"
              >
                <InstagramIcon className="h-5 w-5" />
              </motion.a>
              <motion.a
                href={SITE.youtube}
                target="_blank"
                rel="noopener"
                aria-label="YouTube"
                whileHover={{ scale: 1.15 }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/30 text-[#FF0000] hover:bg-red-500/10"
              >
                <YouTubeIcon className="h-5 w-5" />
              </motion.a>
            </div>
          </div>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(footerLinks).map(([key, links], colIdx) => (
            <FadeIn key={key} delay={colIdx * 0.1}>
              <h4 className="mb-4 text-lg font-semibold text-gold capitalize">
                {key === "quick" ? c.footer.quickLinks : key === "shop" ? c.footer.shopByCategory : c.footer.ourServices}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-text-body hover:text-gold transition-colors text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeIn>
          ))}

          <FadeIn delay={0.3}>
            <h4 className="mb-4 text-lg font-semibold text-gold">{c.footer.contactUs}</h4>
            <div className="space-y-3 text-sm text-text-body">
              <a href={telLink()} className="flex items-center gap-2 hover:text-gold transition-colors">
                <Phone className="h-4 w-4 text-gold shrink-0" />{SITE.phone}
              </a>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" />{SITE.email}</p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold shrink-0" />{SITE.address}
              </p>
              <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex w-fit items-center gap-1.5 text-gold hover:underline font-medium"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {c.contact.openMaps}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
                <a
                  href={SITE.instagram}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex w-fit items-center gap-1.5 text-gold hover:underline font-medium"
                >
                  <InstagramIcon className="h-3.5 w-3.5 shrink-0" />
                  Instagram
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
              <p className="mt-2 text-gold text-xs">{SITE.consultationHours}</p>
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4 text-xs text-text-muted">
          {c.footer.badges.map((badge) => (
            <motion.span key={badge} whileHover={{ scale: 1.05 }} className="rounded-full border border-gold/20 px-4 py-1.5">
              {badge}
            </motion.span>
          ))}
        </div>

        <div className="mt-8 border-t border-orange/15 pt-8 text-center text-sm text-text-muted">
          <p>&copy; 2026 {SITE.name}. {c.footer.rights}</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/terms" className="hover:text-gold">{c.footer.terms}</Link>
            <Link href="/privacy" className="hover:text-gold">{c.footer.privacy}</Link>
            <Link href="/shipping" className="hover:text-gold">{c.footer.shipping}</Link>
            <Link href="/refund" className="hover:text-gold">{c.footer.refund}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
