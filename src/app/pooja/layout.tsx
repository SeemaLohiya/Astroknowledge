import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Online Pooja Services | Vedic Rituals Jaipur — ${SITE.name}`,
  description: `Book authentic Vedic pooja services online with AstroKnowledge. Traditional rituals for peace, prosperity and spiritual wellbeing guided by ${SITE.acharya} in Jaipur.`,
  path: "/pooja",
});

export default function PoojaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
