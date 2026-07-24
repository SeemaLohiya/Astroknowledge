import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Pooja Services | Vedic Rituals Online — ${SITE.name}`,
  description: `Book authentic Vedic pooja services with AstroKnowledge. ${SITE.acharya} guides traditional rituals for peace, prosperity and spiritual wellbeing.`,
  path: "/pooja",
});

export default function PoojaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
