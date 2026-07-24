import type { Metadata } from "next";
import { SITE } from "@/lib/constants";

const SITE_URL = SITE.url.replace(/\/$/, "");

/** Brand + service keywords — includes common misspellings for brand search. */
export const SEO_KEYWORDS = [
  "AstroKnowledge",
  "Astro Knowledge",
  "Astroknowledge",
  "Astrokonwledge",
  "astroknowledge.in",
  "Acharya Seema Lohiya",
  "Seema Lohiya",
  "Seema Lohiya astrologer",
  "best vedic astrologer Jaipur",
  "vedic astrology",
  "kundali analysis",
  "kundali vishleshan",
  "kundli milan",
  "horoscope",
  "vastu shastra",
  "numerology",
  "online astrology consultation",
  "pooja services",
  "spiritual healing",
  "rudraksha",
  "astrology courses",
  "Jaipur astrologer",
];

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path = "/",
  keywords = SEO_KEYWORDS,
  image = SITE.logo,
  noIndex = false,
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article" | "profile";
}): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image);
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(", "),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      locale: "en_IN",
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${SITE.name} — ${SITE.acharya}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export const DEFAULT_DESCRIPTION = `AstroKnowledge by ${SITE.acharya} — expert Vedic astrology in Jaipur. Kundali analysis, Kundli Milan, Vastu, Numerology, Pooja, healing & courses. ${SITE.experience}+ years · ${SITE.clients} clients · ${SITE.rating}/5 rated.`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE.name,
    alternateName: ["Astro Knowledge", "Astroknowledge", "Astrokonwledge"],
    url: SITE_URL,
    logo: absoluteUrl(SITE.logo),
    image: absoluteUrl(SITE.acharyaImage),
    description: DEFAULT_DESCRIPTION,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    sameAs: [SITE.youtube, SITE.instagram, SITE.facebook].filter(Boolean),
    founder: {
      "@type": "Person",
      name: SITE.acharya,
      jobTitle: SITE.acharyaTitle,
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE.name,
    image: absoluteUrl(SITE.acharyaImage),
    url: SITE_URL,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "₹₹",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      addressCountry: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: SITE.rating,
      bestRating: "5",
      ratingCount: "75000",
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: SITE.acharya,
    alternateName: "Seema Lohiya",
    jobTitle: SITE.acharyaTitle,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    url: absoluteUrl("/about"),
    image: absoluteUrl(SITE.acharyaImage),
    sameAs: [SITE.youtube, SITE.instagram, SITE.facebook].filter(Boolean),
    description: `${SITE.acharya}, ${SITE.acharyaTitle} at ${SITE.name} with ${SITE.experience}+ years of Vedic astrology experience and ${SITE.clients} happy clients.`,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE.name,
    alternateName: ["Astro Knowledge", "Astroknowledge", "Astrokonwledge"],
    url: SITE_URL,
    description: SITE.tagline,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["en-IN", "hi-IN"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/services?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export const PUBLIC_ROUTES: {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/about", changeFrequency: "weekly", priority: 0.9 },
  { path: "/services", changeFrequency: "weekly", priority: 0.95 },
  { path: "/courses", changeFrequency: "weekly", priority: 0.85 },
  { path: "/products", changeFrequency: "weekly", priority: 0.85 },
  { path: "/pooja", changeFrequency: "weekly", priority: 0.85 },
  { path: "/healing", changeFrequency: "weekly", priority: 0.8 },
  { path: "/booking", changeFrequency: "weekly", priority: 0.9 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/certifications", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund", changeFrequency: "yearly", priority: 0.3 },
  { path: "/shipping", changeFrequency: "yearly", priority: 0.3 },
];
