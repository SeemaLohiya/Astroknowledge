import { AchievementPhoto } from "../types";
import type { CertificationEntry } from "../types";

export const featuredCertifications = [
  "Shastracharya in Vedic Astrology",
  "Expert in KP",
  "Shastracharya in Vastu",
  "Expert in BNN",
  "Shastracharya in Palmistry",
  "Numerology Expert",
] as const;

export const certifications = [
  { title: "Shastracharya", subtitle: "Vedic Astrology & Jyotish Shastra" },
  { title: "Certified Jyotish Acharya", subtitle: "Advanced Birth Chart & Dasha Analysis" },
  { title: "Vastu Shastra Specialist", subtitle: "Residential & Commercial Vastu" },
  { title: "Numerology Expert", subtitle: "Name Correction & Life Path Analysis" },
  { title: "Ritual & Pooja Specialist", subtitle: "Sacred Ceremony & Anushthan" },
  { title: "Kundli Milan Expert", subtitle: "Marriage Compatibility & Muhurat" },
  { title: "Expert in BNN", subtitle: "Bhrigu Nandi Nadi" },
  { title: "Expert in KP", subtitle: "Krishnamurti Paddhati — Nakshatra Jyotish" },
  { title: "Expert in Palmistry", subtitle: "Hasta Samudrik Shastra & Hand Reading" },
  { title: "Mundane Astrology", subtitle: "World Events & National Predictions" },
  { title: "Medical Astrology", subtitle: "Health & Disease Analysis via Grahas" },
  { title: "Ashtakavarga", subtitle: "Planetary Strength & Transit Analysis" },
  { title: "Prashna Kundali", subtitle: "Horary Chart & Question-Based Jyotish" },
  { title: "Tenali Padhati", subtitle: "Traditional Predictive Methodology" },
  { title: "Kabala", subtitle: "Esoteric Astrology & Mystical Sciences" },
  { title: "Hibru", subtitle: "Ancient Semitic Astrological Traditions" },
  { title: "Lal Kitab", subtitle: "Remedial Astrology & Upayas" },
  { title: "Ramal Jyotish", subtitle: "Divination & Predictive Ramal" },
  { title: "Panchang", subtitle: "Tithi, Nakshatra, Yoga & Muhurat" },
  { title: "Swar Vigyan", subtitle: "Sound & Breath-Based Predictive Science" },
];

const FEATURED_LOWER = new Set(featuredCertifications.map((t) => t.toLowerCase()));

function overlapsFeatured(title: string, subtitle?: string) {
  const lower = title.toLowerCase();
  const combined = `${title} ${subtitle || ""}`.toLowerCase();

  if (FEATURED_LOWER.has(lower)) return true;
  if (lower.includes("numerology") && lower.includes("expert")) return true;
  if (lower === "expert in kp" || lower === "expert in bnn") return true;
  if (lower.includes("palmistry") && lower.includes("expert")) return true;
  if (lower === "shastracharya") return true;
  if (lower.includes("vastu") && (lower.includes("specialist") || lower.includes("shastra"))) return true;

  return featuredCertifications.some((featured) => {
    const f = featured.toLowerCase();
    return combined.includes(f) || f.includes(lower);
  });
}

/** Default certifications list for About page and admin seed data. */
export function buildSeedCertifications(): CertificationEntry[] {
  const seen = new Set<string>();
  const items: CertificationEntry[] = [];
  let index = 0;

  for (const title of featuredCertifications) {
    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    index += 1;
    items.push({ id: `cert-${index}`, title });
  }

  for (const cert of certifications) {
    if (overlapsFeatured(cert.title, cert.subtitle)) continue;
    const key = cert.title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    index += 1;
    items.push({ id: `cert-${index}`, title: cert.title, subtitle: cert.subtitle });
  }

  return items;
}

export const achievementPhotos: AchievementPhoto[] = [
  {
    id: "p1",
    image: "/images/achievements/events/01-aiivs-conference.png",
    title: "AIIAVS World Astrology Conference",
    titleHindi: "AIIAVS विश्व ज्योतिष सम्मेलन",
    alt: "Speaking at the All India Institute for Astrological and Vedic Sciences conference",
  },
  {
    id: "p2",
    image: "/images/achievements/events/02-vedamritam-summit.png",
    title: "International Astrology Research Summit 2023",
    titleHindi: "अंतर्राष्ट्रीय ज्योतिष अनुसंधान समिट २०२३",
    alt: "Certificate of participation at Vedamritam Astro-Vastu Summit, Jaipur",
  },
  {
    id: "p3",
    image: "/images/achievements/events/03-nakshatra-2024.png",
    title: "Nakshatra 2024 — Holistic Wellness",
    titleHindi: "नक्षत्र २०२४ — समग्र कल्याण",
    alt: "Award presentation at Nakshatra 2024 holistic wellness convention",
  },
  {
    id: "p4",
    image: "/images/achievements/events/04-jaipur-jyotish-utsav.png",
    title: "Jaipur Jyotish Utsav",
    titleHindi: "जयपुर ज्योतिष उत्सव",
    alt: "Receiving certificate at Jaipur Jyotish Utsav",
  },
  {
    id: "p5",
    image: "/images/achievements/events/05-krishna-foundation-award.png",
    title: "Krishna Charitable Foundation Award",
    titleHindi: "कृष्णा चैरिटेबल फाउंडेशन पुरस्कार",
    alt: "Award presentation at Krishna Charitable Foundation, Jaipur",
  },
  {
    id: "p6",
    image: "/images/achievements/events/06-aiivs-award.png",
    title: "AIIAVS Award Presentation",
    titleHindi: "AIIAVS पुरस्कार समारोह",
    alt: "Receiving AIIAVS award at All India Institute for Astrological and Vedic Sciences",
  },
  {
    id: "p8",
    image: "/images/achievements/events/08-jaipur-jyotish-award.png",
    title: "Jaipur Jyotish Utsav Award",
    titleHindi: "जयपुर ज्योतिष उत्सव पुरस्कार",
    alt: "Award ceremony at Jaipur Jyotish Utsav with certificate and trophy",
  },
  {
    id: "p9",
    image: "/images/achievements/events/09-jaipur-jyotish-group.png",
    title: "Jaipur Jyotish Utsav 2025",
    titleHindi: "जयपुर ज्योतिष उत्सव २०२५",
    alt: "Group photo at Jaipur Jyotish Utsav, December 2025",
  },
  {
    id: "p10",
    image: "/images/achievements/events/10-vip-guest-award.png",
    title: "VIP Guest Recognition",
    titleHindi: "विशिष्ट अतिथि सम्मान",
    alt: "VIP Guest award presented to Acharya Seema Lohiya",
  },
];
