import { User } from "./types";

export function isBirthProfileComplete(user: Partial<User> | null | undefined): boolean {
  if (!user) return false;
  const hasDob = !!(user.dobUnknown || user.dob?.trim());
  const hasTime = !!(user.birthTimeUnknown || user.birthTime?.trim());
  const hasPlace = !!(
    user.birthPlaceUnknown ||
    user.birthPlace?.trim() ||
    (user.birthCountry?.trim() && user.birthState?.trim() && user.birthCity?.trim())
  );
  return hasDob && hasTime && hasPlace;
}

export function formatBirthField(
  value: string | undefined,
  unknown: boolean | undefined,
  label: string
): string {
  if (unknown) return `${label}: Not known`;
  if (value?.trim()) return `${label}: ${value}`;
  return `${label}: —`;
}

export function formatBirthSummary(user: Partial<User>): string {
  return [
    formatBirthField(user.dob, user.dobUnknown, "DOB"),
    formatBirthField(user.birthTime, user.birthTimeUnknown, "Time"),
    formatBirthField(user.birthPlace, user.birthPlaceUnknown, "Place"),
  ].join(" · ");
}
