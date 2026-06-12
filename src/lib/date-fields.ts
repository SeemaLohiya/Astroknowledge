export const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
] as const;

export const MIN_BIRTH_YEAR = 1940;
export const MAX_BIRTH_YEAR = new Date().getFullYear();

export function yearsList(from = MIN_BIRTH_YEAR, to = MAX_BIRTH_YEAR): number[] {
  const years: number[] = [];
  for (let y = to; y >= from; y--) years.push(y);
  return years;
}

export function daysInMonth(year: number, month: number): number {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}

export interface DobParts {
  day: string;
  month: string;
  year: string;
}

export interface TimeParts {
  hour: string;
  minute: string;
  period: "AM" | "PM";
}

export function parseDob(iso: string): DobParts {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return { day: "", month: "", year: "" };
  }
  const [year, month, day] = iso.split("-");
  return { year, month, day };
}

export function composeDob(parts: DobParts): string {
  const { year, month, day } = parts;
  if (!year || !month || !day) return "";
  const maxDay = daysInMonth(Number(year), Number(month));
  const safeDay = Math.min(Number(day), maxDay);
  return `${year}-${month}-${String(safeDay).padStart(2, "0")}`;
}

export function parseBirthTime(time: string): TimeParts {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) {
    return { hour: "", minute: "", period: "AM" };
  }
  const [h24, minute] = time.split(":");
  let h = Number(h24);
  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return { hour: String(h), minute, period };
}

export function composeBirthTime(parts: TimeParts): string {
  const { hour, minute, period } = parts;
  if (!hour || minute === "") return "";
  let h = Number(hour);
  if (period === "AM") {
    if (h === 12) h = 0;
  } else if (h !== 12) {
    h += 12;
  }
  return `${String(h).padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

export function dayOptions(year: string, month: string): string[] {
  const max = daysInMonth(Number(year) || 2000, Number(month) || 1);
  return Array.from({ length: max }, (_, i) => String(i + 1).padStart(2, "0"));
}

export const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(i + 1));
export const MINUTE_OPTIONS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
