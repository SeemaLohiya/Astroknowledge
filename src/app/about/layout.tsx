import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `About ${SITE.acharya} | Best Vedic Astrologer in Jaipur`,
  description: `Meet ${SITE.acharya}, Chief Vedic Astrologer at AstroKnowledge Jaipur. ${SITE.experience}+ years experience, ${SITE.clients} happy clients. Expert in Kundali, Vastu, Numerology & spiritual guidance across India.`,
  path: "/about",
  image: SITE.acharyaImage,
  type: "profile",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
