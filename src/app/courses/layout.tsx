import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Astrology Courses | Learn Vedic Wisdom — ${SITE.name}`,
  description: `Learn Vedic astrology with ${SITE.acharya} at AstroKnowledge. Structured courses on Kundali, remedies and spiritual practice for beginners and enthusiasts.`,
  path: "/courses",
});

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
