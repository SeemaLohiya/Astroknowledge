import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Spiritual Products | Rudraksha & Remedies — ${SITE.name}`,
  description: `Shop energized spiritual products from AstroKnowledge — Rudraksha, yantras and Vedic remedies recommended by ${SITE.acharya}.`,
  path: "/products",
});

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
