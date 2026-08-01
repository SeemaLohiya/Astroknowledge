"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { SupportChat } from "@/components/support/SupportChat";

export default function DashboardSupportPage() {
  return (
    <PageTransition>
      <FadeIn className="mb-4">
        <h1 className="font-display text-2xl font-bold text-text-primary">
          Support <span className="text-gradient-gold">Chat</span>
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Message our team anytime — send text, links, images, videos, PDFs, or documents.
        </p>
      </FadeIn>
      <SupportChat mode="user" />
    </PageTransition>
  );
}
