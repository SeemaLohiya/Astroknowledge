import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Vedic Astrology Courses Online | Learn with ${SITE.acharya}`,
  description: `Join astrology courses at AstroKnowledge Jaipur. Learn Kundali reading, rituals, Numerology & Vastu from ${SITE.acharya}. Certification programs for beginners and serious students.`,
  path: "/courses",
});

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
