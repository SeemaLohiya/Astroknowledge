import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Contact AstroKnowledge | ${SITE.acharya} — Jaipur`,
  description: `Contact AstroKnowledge in Jaipur. Call ${SITE.phone}, WhatsApp, or email ${SITE.email}. Book a consultation with ${SITE.acharya}.`,
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
