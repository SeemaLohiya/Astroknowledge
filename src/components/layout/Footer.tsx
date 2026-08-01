"use client";

import { SITE, telLink, whatsappLink } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { FadeIn } from "../animations/FadeIn";
import { FounderImage } from "../animations/FounderImage";
import { motion } from "framer-motion";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/ui/SocialIcons";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "Consultancy Services", href: "/services", icon: Sparkles },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Book Consultation", href: "/dashboard/services?tab=book", icon: Calendar },
  { label: "About Us", href: "/about", icon: ArrowRight },
  { label: "Contact", href: "/contact", icon: Mail },
];

export function Footer() {
  const { c } = useLanguage();

  return (
    <footer className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/12 via-transparent to-orange/5" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="relative mx-auto max-w-screen-2xl px-4 py-16">
        <FadeIn>
          <div className="relative mb-12 overflow-hidden rounded-3xl border border-gold/25 bg-gradient-to-br from-white via-cream to-orange/10 p-8 shadow-lg shadow-gold/10 md:p-10">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-orange/10 blur-3xl" />
            <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col items-center gap-5 md:flex-row md:items-center">
                <FounderImage size="lg" />
                <div className="text-center md:text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Meet Your Guide</p>
                  <h3 className="mt-1 font-display text-3xl font-bold text-text-primary">{SITE.acharya}</h3>
                  <p className="text-lg font-medium text-gold">{c.acharyaTitle}</p>
                  <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-body">
                    {SITE.experience} years of expertise · {SITE.clients} happy clients
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                    {[
                      `${SITE.experience}+ Years`,
                      `${SITE.clients} Clients`,
                      `${SITE.rating}★ Rated`,
                    ].map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full border border-gold/25 bg-white/80 px-3 py-1 text-xs font-semibold text-gold"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col">
                <div className="flex gap-3">
                  {[
                    { href: whatsappLink(), label: "WhatsApp", icon: WhatsAppIcon, color: "text-[#25D366] hover:bg-[#25D366]/10" },
                    { href: SITE.instagram, label: "Instagram", icon: InstagramIcon, color: "text-[#E4405F] hover:bg-[#E4405F]/10" },
                    { href: SITE.youtube, label: "YouTube", icon: YouTubeIcon, color: "text-[#FF0000] hover:bg-red-500/10" },
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener"
                      aria-label={social.label}
                      whileHover={{ scale: 1.12, y: -2 }}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-white/90 shadow-sm transition-colors ${social.color}`}
                    >
                      <social.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
                <Link
                  href="/dashboard/services?tab=book"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-bright px-6 py-3 text-sm font-bold text-white shadow-md shadow-gold/25 transition-transform hover:scale-[1.02]"
                >
                  {c.footer.links.bookConsultation}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="grid gap-10 lg:grid-cols-2">
          <FadeIn delay={0.1}>
            <h4 className="mb-4 text-lg font-semibold text-gold">{c.footer.quickLinks}</h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {QUICK_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-3 rounded-xl border border-gold/15 bg-white/70 px-4 py-3 text-sm text-text-body transition-all hover:border-gold/35 hover:bg-gold/5 hover:text-gold"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/5"
              >
                YouTube <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/5"
              >
                Instagram <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h4 className="mb-4 text-lg font-semibold text-gold">{c.footer.contactUs}</h4>
            <div className="space-y-3 rounded-2xl border border-gold/15 bg-white/70 p-5 text-sm text-text-body">
              <a href={telLink()} className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-gold/5 hover:text-gold">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                {SITE.phone}
              </a>
              <p className="flex items-center gap-3 px-2 py-2">
                <Mail className="h-4 w-4 text-gold" />
                {SITE.email}
              </p>
              <p className="flex items-start gap-3 px-2 py-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {SITE.address}
              </p>
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/20 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/5"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {c.contact.openMaps}
                <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              <p className="border-t border-gold/10 pt-3 text-xs text-gold">{SITE.consultationHours}</p>
            </div>
          </FadeIn>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs text-text-muted">
          {c.footer.badges.map((badge) => (
            <motion.span
              key={badge}
              whileHover={{ scale: 1.05, y: -1 }}
              className="cursor-default rounded-full border border-gold/20 bg-white/80 px-4 py-1.5 shadow-sm"
            >
              {badge}
            </motion.span>
          ))}
        </div>

        <div className="mt-8 border-t border-orange/15 pt-8 text-center text-sm text-text-muted">
          <p>&copy; 2026 {SITE.name}. {c.footer.rights}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            <Link href="/terms" className="hover:text-gold">
              {c.footer.terms}
            </Link>
            <Link href="/privacy" className="hover:text-gold">
              {c.footer.privacy}
            </Link>
            <Link href="/shipping" className="hover:text-gold">
              {c.footer.shipping}
            </Link>
            <Link href="/refund" className="hover:text-gold">
              {c.footer.refund}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
