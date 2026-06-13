"use client";

import { COUNTRIES, getCities, getStates } from "@/lib/location-data";
import { useMemo, useState } from "react";

export interface BirthPlaceValue {
  birthCountry: string;
  birthState: string;
  birthCity: string;
}

export function composeBirthPlace({ birthCountry, birthState, birthCity }: BirthPlaceValue): string {
  return [birthCity, birthState, birthCountry].filter(Boolean).join(", ");
}

export function parseBirthPlace(place?: string, user?: Partial<BirthPlaceValue> | null): BirthPlaceValue {
  if (user?.birthCountry || user?.birthState || user?.birthCity) {
    return {
      birthCountry: user.birthCountry || "India",
      birthState: user.birthState || "",
      birthCity: user.birthCity || "",
    };
  }
  if (!place?.trim()) return { birthCountry: "India", birthState: "", birthCity: "" };
  const parts = place.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 3) {
    return { birthCity: parts[0], birthState: parts[1], birthCountry: parts.slice(2).join(", ") };
  }
  if (parts.length === 2) return { birthCity: parts[0], birthState: parts[1], birthCountry: "India" };
  return { birthCity: parts[0] || "", birthState: "", birthCountry: "India" };
}

interface BirthPlacePickerProps {
  value: BirthPlaceValue;
  onChange: (next: BirthPlaceValue) => void;
  disabled?: boolean;
  inputCls?: string;
}

export function BirthPlacePicker({ value, onChange, disabled, inputCls = "" }: BirthPlacePickerProps) {
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const states = useMemo(() => getStates(value.birthCountry), [value.birthCountry]);
  const cities = useMemo(() => getCities(value.birthState), [value.birthState]);
  const filteredStates = useMemo(
    () => states.filter((s) => s.toLowerCase().includes(stateFilter.toLowerCase())),
    [states, stateFilter]
  );
  const filteredCities = useMemo(
    () => cities.filter((c) => c.toLowerCase().includes(cityFilter.toLowerCase())),
    [cities, cityFilter]
  );

  const selectCls = `w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2.5 text-sm focus:border-gold focus:outline-none disabled:opacity-50 ${inputCls}`;

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">Country *</label>
        <select
          disabled={disabled}
          value={value.birthCountry}
          onChange={(e) => onChange({ birthCountry: e.target.value, birthState: "", birthCity: "" })}
          className={selectCls}
        >
          <option value="">Select country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">State *</label>
        <input
          type="text"
          disabled={disabled || !value.birthCountry}
          placeholder="Filter states..."
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className={selectCls}
        />
        <select
          disabled={disabled || !value.birthCountry}
          value={value.birthState}
          onChange={(e) => onChange({ ...value, birthState: e.target.value, birthCity: "" })}
          className={`${selectCls} mt-2`}
        >
          <option value="">Select state</option>
          {filteredStates.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">City *</label>
        <input
          type="text"
          disabled={disabled || !value.birthState}
          placeholder="Filter cities..."
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className={selectCls}
        />
        <select
          disabled={disabled || !value.birthState}
          value={value.birthCity}
          onChange={(e) => onChange({ ...value, birthCity: e.target.value })}
          className={`${selectCls} mt-2`}
        >
          <option value="">Select city</option>
          {filteredCities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {(value.birthCity || value.birthState || value.birthCountry) && (
        <p className="text-xs text-text-muted rounded-lg bg-orange/5 px-3 py-2">
          Selected: <strong className="text-text-primary">{composeBirthPlace(value) || "—"}</strong>
        </p>
      )}
    </div>
  );
}

export function isBirthPlaceValid(value: BirthPlaceValue, unknown: boolean): boolean {
  if (unknown) return true;
  return !!(value.birthCountry && value.birthState && value.birthCity);
}
