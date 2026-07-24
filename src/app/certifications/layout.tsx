import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Certifications | ${SITE.acharya} — ${SITE.name}`,
  description: `View certifications and achievements of ${SITE.acharya}, Chief Vedic Astrologer at AstroKnowledge.`,
  path: "/certifications",
});

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
