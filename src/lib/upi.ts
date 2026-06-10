import { SITE } from "./constants";

export function buildUpiPayUri(amount?: number, note?: string) {
  const params = new URLSearchParams({
    pa: SITE.upiId,
    pn: SITE.upiPayeeName || SITE.accountName || SITE.name,
    cu: "INR",
  });
  if (amount && amount > 0) params.set("am", amount.toFixed(2));
  if (note) params.set("tn", note.slice(0, 80));
  return `upi://pay?${params.toString()}`;
}

export function upiQrImageUrl(upiUri: string, size = 220) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&margin=8&data=${encodeURIComponent(upiUri)}`;
}
