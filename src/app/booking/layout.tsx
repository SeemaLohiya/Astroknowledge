import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Book Consultation | AstroKnowledge Online Slot Booking`,
  description: `Book an online Vedic astrology consultation with ${SITE.acharya} at AstroKnowledge. Choose a service, pay securely, and reserve your slot.`,
  path: "/booking",
});

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
