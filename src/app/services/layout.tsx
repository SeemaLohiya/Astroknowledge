import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Consultancy Services | Online Vedic Astrology — ${SITE.name}`,
  description: `Book consultancy services with ${SITE.acharya}: Kundali Vishleshan, Kundli Milan, Vastu, Numerology, Palmistry and more. Trusted AstroKnowledge consultations online.`,
  path: "/services",
});

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
