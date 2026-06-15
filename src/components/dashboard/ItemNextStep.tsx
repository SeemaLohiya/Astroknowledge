"use client";

import { Button } from "@/components/ui/Button";
import { SITE, telLink, whatsappLink } from "@/lib/constants";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatMsg } from "@/lib/i18n/ui-strings";
import { getDisplayStatus } from "@/lib/purchase-display";
import { CartItemType, PaymentStatus } from "@/lib/types";
import { Calendar, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

interface ItemNextStepProps {
  itemType: CartItemType;
  itemId: string;
  paymentStatus: PaymentStatus;
  paymentId?: string;
}

export function ItemNextStep({ itemType, itemId, paymentStatus, paymentId }: ItemNextStepProps) {
  const { lang, c } = useLanguage();
  const n = c.nextStep;
  const d = c.dashboard;
  const itemTypeLabel = (c.cart.itemTypes as Record<string, string>)[itemType] || itemType;
  const isPaid = paymentStatus === "paid";
  const isPending = paymentStatus === "pending";
  const isAwaiting = paymentStatus === "awaiting_approval";

  if (isPending && paymentId) {
    return (
      <div className="rounded-xl bg-orange/5 border border-orange/20 px-4 py-3 text-sm text-text-body">
        {n.paymentIncomplete}{" "}
        <Link href={`/payment?id=${paymentId}`} className="font-semibold text-gold hover:underline">
          {n.completePayment}
        </Link>
      </div>
    );
  }

  if (isAwaiting) {
    return (
      <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/20 px-4 py-3 text-sm text-yellow-800">
        <p className="font-semibold text-yellow-900 mb-1">{n.pendingTitle}</p>
        <p>
          {itemType === "service" ? n.pendingService : n.pendingOther}
        </p>
      </div>
    );
  }

  if (itemType === "service") {
    if (isPaid) {
      return (
        <div className="rounded-xl bg-gold/5 border border-gold/25 px-4 py-3">
          <p className="text-sm font-medium text-text-primary mb-2">{n.bookNext}</p>
          <Button href={`/dashboard/slots?service=${itemId}`} variant="secondary" size="sm">
            <Calendar className="h-4 w-4" /> {d.bookConsultation}
          </Button>
        </div>
      );
    }
    return (
      <p className="text-xs text-text-muted">{n.unlockSlot}</p>
    );
  }

  if (isPaid || isAwaiting) {
    return (
      <div className="rounded-xl bg-orange/5 border border-gold/15 px-4 py-3 text-sm text-text-body">
        <p className="font-medium text-text-primary mb-1">{n.teamReachOut}</p>
        <p className="text-xs text-text-muted mb-3">
          {formatMsg(n.contactRegarding, { type: itemTypeLabel })}
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href={telLink()}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-white px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10"
          >
            <Phone className="h-3.5 w-3.5" /> {SITE.phone}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-3 py-1.5 text-xs font-semibold text-[#25D366] hover:bg-[#25D366]/20"
          >
            <MessageCircle className="h-3.5 w-3.5" /> {c.contact.whatsapp}
          </a>
        </div>
      </div>
    );
  }

  return (
    <p className="text-xs text-text-muted">{n.status} {getDisplayStatus(paymentStatus, undefined, itemType, lang)}</p>
  );
}
