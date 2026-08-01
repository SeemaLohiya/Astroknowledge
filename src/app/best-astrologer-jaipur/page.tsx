import type { Metadata } from "next";
import Link from "next/link";
import { PageTransition } from "@/components/animations/PageTransition";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { Button } from "@/components/ui/Button";
import { SITE, telLink, whatsappLink } from "@/lib/constants";
import { services } from "@/lib/data/services";
import { siteContent } from "@/lib/i18n/site-content";
import {
  breadcrumbJsonLd,
  pageMetadata,
  SERVICE_KEYWORDS,
} from "@/lib/seo";
import { Award, MapPin, Phone, Star, Users } from "lucide-react";

export const metadata: Metadata = pageMetadata({
  title: `Best Astrologer in Jaipur | ${SITE.acharya} — Vedic Expert`,
  description: `Looking for the best astrologer in Jaipur? ${SITE.acharya} offers Kundali Vishleshan, Kundli Milan, Vastu & Numerology with ${SITE.experience}+ years experience and ${SITE.clients} clients. Book online at AstroKnowledge.`,
  path: "/best-astrologer-jaipur",
  keywords: [
    ...SERVICE_KEYWORDS,
    "best astrologer Jaipur",
    "famous astrologer Jaipur",
    "top astrologer in Jaipur Rajasthan",
    "Seema Lohiya Jaipur",
  ],
  image: SITE.acharyaImage,
});

function faqJsonLd() {
  const faqs = siteContent.en.faqs.slice(0, 6);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default function BestAstrologerJaipurPage() {
  return (
    <PageTransition>
      <SchemaScript
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Best Astrologer Jaipur", path: "/best-astrologer-jaipur" },
        ])}
      />
      <SchemaScript data={faqJsonLd()} />

      <article className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-gold">Jaipur, Rajasthan · Vedic Astrology</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-text-primary md:text-4xl lg:text-5xl">
          Best Vedic Astrologer in <span className="text-gradient-gold">Jaipur</span>
        </h1>
        <p className="mt-4 text-lg text-text-body">
          {SITE.acharya} — Chief Vedic Astrologer at <strong>AstroKnowledge</strong> — trusted by{" "}
          {SITE.clients} clients across India for accurate Kundali analysis, marriage compatibility, Vastu
          consultancy and spiritual guidance.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {[
            { icon: Star, label: `${SITE.rating}/5 Rated` },
            { icon: Users, label: `${SITE.clients} Clients` },
            { icon: Award, label: `${SITE.experience}+ Years` },
            { icon: MapPin, label: "Jaipur, Rajasthan" },
          ].map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/5 px-4 py-2 text-sm font-medium text-text-primary"
            >
              <item.icon className="h-4 w-4 text-gold" />
              {item.label}
            </span>
          ))}
        </div>

        <section className="mt-10 rounded-2xl glass-card p-6 md:p-8">
          <h2 className="text-xl font-bold text-text-primary">Why choose AstroKnowledge in Jaipur?</h2>
          <ul className="mt-4 space-y-3 text-sm text-text-body md:text-base">
            <li>✓ Authentic Vedic astrology — Kundali Vishleshan, Kundli Milan, Vastu Shastra & Numerology</li>
            <li>✓ Online consultations for clients across India and abroad</li>
            <li>✓ Pooja services, spiritual healing, Rudraksha & remedial products</li>
            <li>✓ Structured astrology courses for serious learners</li>
            <li>✓ Secure online booking and payment on astroknowledge.in</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-text-primary">Popular astrology services in Jaipur</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {services.slice(0, 6).map((s) => (
              <Link
                key={s.id}
                href={`/services#${s.id}`}
                className="rounded-xl border border-gold/15 bg-orange/5 p-4 transition-colors hover:border-gold/40 hover:bg-gold/5"
              >
                <p className="font-semibold text-text-primary">{s.title}</p>
                <p className="mt-1 text-xs text-text-muted line-clamp-2">{s.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Button href="/services" variant="secondary">
              View all services
            </Button>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 to-orange/5 p-6 md:p-8">
          <h2 className="text-xl font-bold text-text-primary">Book your consultation today</h2>
          <p className="mt-2 text-sm text-text-body">
            Call, WhatsApp or book online — {SITE.consultationHours}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/booking" variant="secondary" size="lg">
              Book online
            </Button>
            <Button href={telLink()} variant="outline">
              <Phone className="h-4 w-4" /> Call {SITE.phone}
            </Button>
            <Button href={whatsappLink()} variant="outline">
              WhatsApp
            </Button>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-bold text-text-primary">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {siteContent.en.faqs.slice(0, 5).map((f) => (
              <div key={f.q} className="rounded-xl border border-gold/10 bg-white/80 p-4">
                <h3 className="font-semibold text-text-primary">{f.q}</h3>
                <p className="mt-2 text-sm text-text-body">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </PageTransition>
  );
}
