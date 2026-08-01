import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Spiritual Healing Sessions | Energy Healing Jaipur`,
  description: `Book spiritual and energy healing sessions with ${SITE.acharya} at AstroKnowledge Jaipur. Holistic healing for mind, body and spiritual balance.`,
  path: "/healing",
});

export default function HealingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
