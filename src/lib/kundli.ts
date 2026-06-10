import { User } from "./types";

export const RASHIS = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
  "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
  "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
] as const;

export const RASHIS_HINDI = [
  "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
  "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन",
] as const;

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
] as const;

export const PLANETS = ["Su", "Mo", "Ma", "Me", "Ju", "Ve", "Sa", "Ra", "Ke"] as const;
export const PLANET_NAMES: Record<string, string> = {
  Su: "Surya", Mo: "Chandra", Ma: "Mangal", Me: "Budh", Ju: "Guru",
  Ve: "Shukra", Sa: "Shani", Ra: "Rahu", Ke: "Ketu",
};

export interface KundliData {
  name: string;
  fatherName?: string;
  gotra?: string;
  dob: string;
  birthTime?: string;
  birthPlace?: string;
  lagna: string;
  lagnaHindi: string;
  rashi: string;
  rashiHindi: string;
  nakshatra: string;
  houses: { house: number; planets: string[]; sign: string }[];
  summary: string;
}

function hashSeed(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

export function canGenerateKundli(user: Partial<User> | null | undefined): boolean {
  if (!user?.name?.trim()) return false;
  if (!user.dobUnknown && !user.dob?.trim()) return false;
  if (!user.birthPlaceUnknown && !user.birthPlace?.trim()) return false;
  return true;
}

export function generateKundli(user: Partial<User>): KundliData | null {
  if (!canGenerateKundli(user)) return null;

  const dob = user.dob || "2000-01-01";
  const [y, m, d] = dob.split("-").map(Number);
  const time = user.birthTime || "12:00";
  const [hh] = time.split(":").map(Number);

  const seed = hashSeed(`${dob}|${time}|${user.birthPlace}|${user.name}`);
  const rashiIdx = ((m - 1) + Math.floor(d / 3)) % 12;
  const nakshatraIdx = (d + m + (y % 27)) % 27;
  const lagnaIdx = (hh + d + m) % 12;

  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    const signIdx = (lagnaIdx + i) % 12;
    const planets: string[] = [];
    PLANETS.forEach((p, pi) => {
      if ((seed + pi * 7 + houseNum * 3) % 12 === i) planets.push(p);
    });
    if (houseNum === 1 && !planets.includes("Mo")) planets.unshift("Mo");
    if (houseNum === ((rashiIdx % 12) + 1) && !planets.includes("Su")) planets.push("Su");
    return { house: houseNum, planets: planets.slice(0, 3), sign: RASHIS[signIdx] };
  });

  const rashi = RASHIS[rashiIdx];
  const lagna = RASHIS[lagnaIdx];

  return {
    name: user.name || "",
    fatherName: user.fatherName,
    gotra: user.gotra,
    dob,
    birthTime: user.birthTimeUnknown ? undefined : user.birthTime,
    birthPlace: user.birthPlaceUnknown ? undefined : user.birthPlace,
    lagna,
    lagnaHindi: RASHIS_HINDI[lagnaIdx],
    rashi,
    rashiHindi: RASHIS_HINDI[rashiIdx],
    nakshatra: NAKSHATRAS[nakshatraIdx],
    houses,
    summary: `${user.name}'s Janma Kundli — Lagna ${lagna}, Chandra Rashi ${rashi}, Nakshatra ${NAKSHATRAS[nakshatraIdx]}${user.gotra ? `, Gotra ${user.gotra}` : ""}.`,
  };
}
