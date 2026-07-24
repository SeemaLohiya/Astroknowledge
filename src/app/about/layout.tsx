import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `About ${SITE.acharya} | ${SITE.name}`,
  description: `Meet ${SITE.acharya}, Chief Vedic Astrologer at AstroKnowledge. ${SITE.experience}+ years experience, ${SITE.clients} happy clients in Jaipur. Kundali, Vastu, Numerology & spiritual guidance.`,
  path: "/about",
  image: SITE.acharyaImage,
  type: "profile",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
