import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { services } from "@/lib/data/services";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { breadcrumbJsonLd, pageMetadata, SERVICE_KEYWORDS, servicesCatalogJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Kundali Vishleshan, Kundli Milan & Vastu — Best Astrologer Jaipur`,
  description: `Book online Vedic astrology consultancy in Jaipur with ${SITE.acharya}: Kundali Vishleshan, Kundli Milan, Vastu Shastra, Numerology, Palmistry & more. Trusted by ${SITE.clients} clients at AstroKnowledge.`,
  path: "/services",
  keywords: SERVICE_KEYWORDS,
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScript data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Consultancy Services", path: "/services" }])} />
      <SchemaScript data={servicesCatalogJsonLd(services)} />
      {children}
    </>
  );
}
