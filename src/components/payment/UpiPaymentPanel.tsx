"use client";

import { SITE } from "@/lib/constants";
import { buildUpiPayUri } from "@/lib/upi";
import { Copy, QrCode, Smartphone } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface UpiPaymentPanelProps {
  amount?: number;
  note?: string;
  compact?: boolean;
  showScannerHint?: boolean;
}

export function UpiPaymentPanel({ amount, note, compact = false, showScannerHint = true }: UpiPaymentPanelProps) {
  const [copied, setCopied] = useState(false);
  const upiUri = useMemo(() => buildUpiPayUri(amount, note), [amount, note]);
  const highAmount = (amount ?? 0) > SITE.upiGalleryLimit;

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(SITE.upiId);
      setCopied(true);
      toast.success("UPI ID copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <div className={`rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/8 via-cream to-orange/5 ${compact ? "p-4" : "p-5"}`}>
      <div className={`flex gap-4 ${compact ? "flex-col sm:flex-row items-center" : "flex-col sm:flex-row"}`}>
        <div className="shrink-0 text-center">
          <div className="relative mx-auto inline-block rounded-2xl border-2 border-gold/30 bg-white p-2 shadow-md shadow-gold/10">
            <Image
              src={SITE.upiQrImage}
              alt={`Scan to pay ${SITE.upiPayeeName} via UPI`}
              width={compact ? 180 : 220}
              height={compact ? 180 : 220}
              className="rounded-xl"
              priority
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-white shadow">
              <QrCode className="h-3 w-3" /> Scan & Pay
            </div>
          </div>
          {showScannerHint && (
            <p className="mt-3 text-[11px] text-text-muted max-w-[220px]">
              Scan with PhonePe, GPay, Paytm or any UPI app
            </p>
          )}
        </div>

        <div className="flex-1 space-y-3 min-w-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Payee</p>
            <p className="text-sm font-bold text-text-primary">{SITE.upiPayeeName}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">UPI ID</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <code className="rounded-lg bg-white/80 px-3 py-2 text-sm font-bold text-gold border border-gold/20">{SITE.upiId}</code>
              <button
                type="button"
                onClick={copyUpi}
                className="inline-flex items-center gap-1 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-semibold text-gold hover:bg-gold/10"
              >
                <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy UPI ID"}
              </button>
            </div>
          </div>

          {amount != null && amount > 0 && (
            <p className="text-sm text-text-body">
              <span className="text-text-muted">Amount:</span>{" "}
              <strong className="text-text-primary">₹{amount.toLocaleString("en-IN")}</strong>
            </p>
          )}

          <div className="rounded-xl border border-amber-300/40 bg-amber-50/90 px-3 py-2.5 text-xs text-amber-900 leading-relaxed">
            <strong>Note:</strong> If you use the <strong>Gallery</strong> option on the scanner, you can pay up to{" "}
            <strong>₹{SITE.upiGalleryLimit.toLocaleString("en-IN")}</strong>. For higher amounts, enter the UPI ID{" "}
            <strong>{SITE.upiId}</strong> manually in your UPI app.
            {highAmount && (
              <span className="mt-1 block font-semibold text-amber-800">
                Your order exceeds ₹{SITE.upiGalleryLimit.toLocaleString("en-IN")} — please pay using the UPI ID above.
              </span>
            )}
          </div>

          <p className="text-xs text-text-body">
            <span className="text-text-muted">Phone:</span> {SITE.phone}
          </p>

          <a
            href={upiUri}
            className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-xs font-semibold text-gold hover:bg-gold/25 transition-colors"
          >
            <Smartphone className="h-4 w-4" /> Open UPI App
          </a>
        </div>
      </div>
    </div>
  );
}
