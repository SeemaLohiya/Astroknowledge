"use client";

import { useEffect, useRef, useState } from "react";
import {
  composeBirthTime,
  composeDob,
  dayOptions,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  MONTHS,
  parseBirthTime,
  parseDob,
  yearsList,
  type DobParts,
  type TimeParts,
} from "@/lib/date-fields";

const selectCls =
  "w-full min-h-[44px] rounded-xl border border-gold/20 bg-orange/5 px-3 py-3 text-sm text-text-primary transition-all focus:border-gold focus:ring-2 focus:ring-gold/15 focus:outline-none disabled:opacity-50 cursor-pointer";

interface DobFieldsProps {
  value: string;
  disabled?: boolean;
  onChange: (iso: string) => void;
}

export function DobFields({ value, disabled, onChange }: DobFieldsProps) {
  const [parts, setParts] = useState<DobParts>(() => parseDob(value));
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setParts(parseDob(value));
    }
  }, [value]);

  const update = (patch: Partial<DobParts>) => {
    const next = { ...parts, ...patch };
    if (patch.year || patch.month) {
      const max = dayOptions(next.year, next.month).length;
      if (next.day && Number(next.day) > max) next.day = String(max).padStart(2, "0");
    }
    setParts(next);
    const composed = composeDob(next);
    lastEmitted.current = composed;
    onChange(composed);
  };

  const days = dayOptions(parts.year, parts.month);

  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">Day</label>
        <select
          value={parts.day}
          disabled={disabled}
          onChange={(e) => update({ day: e.target.value })}
          className={selectCls}
        >
          <option value="">Day</option>
          {days.map((d) => (
            <option key={d} value={d}>
              {Number(d)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">Month</label>
        <select
          value={parts.month}
          disabled={disabled}
          onChange={(e) => update({ month: e.target.value })}
          className={selectCls}
        >
          <option value="">Month</option>
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">Year</label>
        <select
          value={parts.year}
          disabled={disabled}
          onChange={(e) => update({ year: e.target.value })}
          className={selectCls}
        >
          <option value="">Year</option>
          {yearsList().map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

interface BirthTimeFieldsProps {
  value: string;
  disabled?: boolean;
  onChange: (time: string) => void;
}

export function BirthTimeFields({ value, disabled, onChange }: BirthTimeFieldsProps) {
  const [parts, setParts] = useState<TimeParts>(() => parseBirthTime(value));
  const lastEmitted = useRef(value);

  useEffect(() => {
    if (value !== lastEmitted.current) {
      lastEmitted.current = value;
      setParts(parseBirthTime(value));
    }
  }, [value]);

  const update = (patch: Partial<TimeParts>) => {
    const next = { ...parts, ...patch };
    setParts(next);
    const composed = composeBirthTime(next);
    lastEmitted.current = composed;
    onChange(composed);
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">Hour</label>
        <select
          value={parts.hour}
          disabled={disabled}
          onChange={(e) => update({ hour: e.target.value })}
          className={selectCls}
        >
          <option value="">Hour</option>
          {HOUR_OPTIONS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">Minute</label>
        <select
          value={parts.minute}
          disabled={disabled}
          onChange={(e) => update({ minute: e.target.value })}
          className={selectCls}
        >
          <option value="">Min</option>
          {MINUTE_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-text-muted">AM/PM</label>
        <select
          value={parts.period}
          disabled={disabled}
          onChange={(e) => update({ period: e.target.value as "AM" | "PM" })}
          className={selectCls}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
}
