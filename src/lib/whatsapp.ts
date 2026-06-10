import { SITE } from "./constants";

export function buildWhatsAppUrl(message: string, phone = SITE.whatsapp) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function bookingConfirmMessage(name: string, service: string, date: string, time: string) {
  return `Namaste ${name}, your AstroKnowledge consultation for ${service} is confirmed on ${date} at ${time}. We look forward to guiding you. — Acharya Seema Lohiya`;
}
