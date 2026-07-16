"use client";

import { COUNTRIES, getCities, getStates } from "@/lib/location-data";
import { withSelectedOption } from "@/lib/select-options";
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

function applyFilterMatch(
  options: string[],
  filter: string,
  current: string
): { list: string[]; autoSelect?: string } {
  const q = filter.trim().toLowerCase();
  const filtered = q ? options.filter((s) => s.toLowerCase().includes(q)) : options;
  const list = withSelectedOption(filtered, current);
  if (!q) return { list };
  const exact = options.find((s) => s.toLowerCase() === q);
  if (exact && exact !== current) return { list, autoSelect: exact };
  if (filtered.length === 1 && filtered[0] !== current) return { list, autoSelect: filtered[0] };
  return { list };
}

export function BirthPlacePicker({ value, onChange, disabled, inputCls = "" }: BirthPlacePickerProps) {
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const states = useMemo(() => getStates(value.birthCountry), [value.birthCountry]);
  const cities = useMemo(() => getCities(value.birthState), [value.birthState]);

  const stateResult = useMemo(
    () => applyFilterMatch(states, stateFilter, value.birthState),
    [states, stateFilter, value.birthState]
  );
  const cityResult = useMemo(
    () => applyFilterMatch(cities, cityFilter, value.birthCity),
    [cities, cityFilter, value.birthCity]
  );

  const selectCls =
    "w-full min-h-[44px] rounded-xl border border-gold/20 bg-orange/5 px-3 py-2.5 text-sm focus:border-gold focus:outline-none disabled:opacity-50 cursor-pointer";
  const filterCls =
    "mb-2 w-full rounded-lg border border-gold/15 bg-white px-3 py-1.5 text-xs text-text-body placeholder:text-text-muted focus:border-gold focus:outline-none disabled:opacity-50";

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">Country *</label>
        <select
          disabled={disabled}
          value={value.birthCountry}
          onChange={(e) => {
            setStateFilter("");
            setCityFilter("");
            onChange({ birthCountry: e.target.value, birthState: "", birthCity: "" });
          }}
          className={`${selectCls} ${inputCls}`}
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
          type="search"
          disabled={disabled || !value.birthCountry}
          placeholder="Type to filter states (e.g. Rajasthan)..."
          value={stateFilter}
          onChange={(e) => {
            const next = e.target.value;
            setStateFilter(next);
            const match = applyFilterMatch(states, next, value.birthState);
            if (match.autoSelect) {
              setCityFilter("");
              onChange({ ...value, birthState: match.autoSelect, birthCity: "" });
            }
          }}
          className={filterCls}
          autoComplete="address-level1"
        />
        <select
          disabled={disabled || !value.birthCountry}
          value={value.birthState}
          onChange={(e) => {
            setStateFilter("");
            setCityFilter("");
            onChange({ ...value, birthState: e.target.value, birthCity: "" });
          }}
          className={`${selectCls} ${inputCls}`}
          size={Math.min(6, Math.max(3, stateResult.list.length + 1))}
        >
          <option value="">Select state</option>
          {stateResult.list.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {stateFilter && stateResult.list.length === 0 && (
          <p className="mt-1 text-xs text-red-500">No states match “{stateFilter}”</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">City *</label>
        <input
          type="search"
          disabled={disabled || !value.birthState}
          placeholder="Type to filter cities..."
          value={cityFilter}
          onChange={(e) => {
            const next = e.target.value;
            setCityFilter(next);
            const match = applyFilterMatch(cities, next, value.birthCity);
            if (match.autoSelect) {
              onChange({ ...value, birthCity: match.autoSelect });
            }
          }}
          className={filterCls}
          autoComplete="address-level2"
        />
        <select
          disabled={disabled || !value.birthState}
          value={value.birthCity}
          onChange={(e) => {
            setCityFilter("");
            onChange({ ...value, birthCity: e.target.value });
          }}
          className={`${selectCls} ${inputCls}`}
          size={Math.min(6, Math.max(3, cityResult.list.length + 1))}
        >
          <option value="">Select city</option>
          {cityResult.list.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {cityFilter && cityResult.list.length === 0 && (
          <p className="mt-1 text-xs text-red-500">No cities match “{cityFilter}”</p>
        )}
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
