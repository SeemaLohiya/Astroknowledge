import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Payment",
  description: "Complete payment for your AstroKnowledge order.",
  path: "/payment",
  noIndex: true,
});

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
