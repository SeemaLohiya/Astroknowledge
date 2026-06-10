import { formatBirthField } from "@/lib/profile";

interface BirthInfoDisplayProps {
  dob?: string;
  birthTime?: string;
  birthPlace?: string;
  dobUnknown?: boolean;
  birthTimeUnknown?: boolean;
  birthPlaceUnknown?: boolean;
  className?: string;
}

export function BirthInfoDisplay({
  dob,
  birthTime,
  birthPlace,
  dobUnknown,
  birthTimeUnknown,
  birthPlaceUnknown,
  className = "text-xs text-text-muted",
}: BirthInfoDisplayProps) {
  const hasAny =
    dob || birthTime || birthPlace ||
    dobUnknown || birthTimeUnknown || birthPlaceUnknown;

  if (!hasAny) {
    return <p className={`${className} italic`}>Birth details not provided</p>;
  }

  return (
    <p className={className}>
      {formatBirthField(dob, dobUnknown, "DOB")} · {formatBirthField(birthTime, birthTimeUnknown, "Time")} · {formatBirthField(birthPlace, birthPlaceUnknown, "Place")}
    </p>
  );
}
