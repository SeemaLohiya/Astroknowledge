import { whatsappLink } from "./constants";

export function buildWhatsAppUrl(message: string, phoneDigits?: string) {
  if (phoneDigits) {
    const base = `https://wa.me/${phoneDigits.replace(/\D/g, "")}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }
  return whatsappLink(message);
}

export function bookingConfirmMessage(name: string, service: string, date: string, time: string) {
  return `Namaste ${name}, your AstroKnowledge consultation for ${service} is confirmed on ${date} at ${time}. We look forward to guiding you. — Acharya Seema Lohiya`;
}
