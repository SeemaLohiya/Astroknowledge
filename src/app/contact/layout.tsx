import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { breadcrumbJsonLd, contactPageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Contact ${SITE.acharya} | Best Astrologer Jaipur — ${SITE.name}`,
  description: `Contact AstroKnowledge in Jaipur, Rajasthan. Call ${SITE.phone}, WhatsApp, or email ${SITE.email}. Book Vedic astrology consultation with ${SITE.acharya} today.`,
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaScript data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <SchemaScript data={contactPageJsonLd()} />
      {children}
    </>
  );
}
