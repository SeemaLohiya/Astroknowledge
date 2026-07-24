import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Healing Sessions | Energy & Spiritual Healing — ${SITE.name}`,
  description: `Book spiritual healing sessions with AstroKnowledge. Energy balance and holistic healing guided by ${SITE.acharya}.`,
  path: "/healing",
});

export default function HealingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
