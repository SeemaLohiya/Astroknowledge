"use client";

import { BookingSlot } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

function toDateKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function parseDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

interface SlotCalendarProps {
  slots: BookingSlot[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  mode?: "admin" | "user";
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function SlotCalendar({ slots, selectedDate, onSelectDate, mode = "user" }: SlotCalendarProps) {
  const initial = selectedDate ? parseDateKey(selectedDate) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const slotsByDate = useMemo(() => {
    const map = new Map<string, BookingSlot[]>();
    slots.forEach((s) => {
      const list = map.get(s.date) || [];
      list.push(s);
      map.set(s.date, list);
    });
    return map;
  }, [slots]);

  const todayKey = toDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthLabel = new Date(viewYear, viewMonth).toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl border border-gold/20 bg-white/80 p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={prevMonth} className="rounded-lg p-1.5 text-text-body hover:bg-orange/10 hover:text-gold" aria-label="Previous month">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="font-semibold text-text-primary text-sm">{monthLabel}</h3>
        <button type="button" onClick={nextMonth} className="rounded-lg p-1.5 text-text-body hover:bg-orange/10 hover:text-gold" aria-label="Next month">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold uppercase text-text-muted py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const dateKey = toDateKey(viewYear, viewMonth, day);
          const daySlots = slotsByDate.get(dateKey) || [];
          const hasSlots = daySlots.length > 0;
          const isSelected = selectedDate === dateKey;
          const isToday = dateKey === todayKey;
          const isPast = parseDateKey(dateKey) < parseDateKey(todayKey);

          const available = daySlots.filter((s) => s.status === "available").length;
          const pending = daySlots.filter((s) => s.status === "pending").length;
          const booked = daySlots.filter((s) => s.status === "booked").length;

          const showDay = mode === "admin" ? hasSlots : available > 0;

          return (
            <button
              key={dateKey}
              type="button"
              disabled={mode === "user" && (!showDay || isPast)}
              onClick={() => onSelectDate(isSelected ? "" : dateKey)}
              className={cn(
                "relative flex flex-col items-center rounded-lg py-1.5 text-xs transition-all min-h-[44px]",
                isSelected ? "bg-gold text-white font-bold shadow-md" :
                isToday ? "border border-gold/50 text-gold font-semibold" :
                showDay ? "bg-orange/10 text-text-primary hover:bg-gold/20 hover:text-gold" :
                "text-text-muted hover:bg-orange/5",
                mode === "user" && isPast && "opacity-40 cursor-not-allowed"
              )}
            >
              <span>{day}</span>
              {hasSlots && mode === "admin" && (
                <div className="mt-0.5 flex gap-0.5">
                  {available > 0 && <span className={cn("h-1.5 w-1.5 rounded-full", isSelected ? "bg-white" : "bg-green-500")} title={`${available} open`} />}
                  {pending > 0 && <span className={cn("h-1.5 w-1.5 rounded-full", isSelected ? "bg-white/80" : "bg-yellow-500")} title={`${pending} pending`} />}
                  {booked > 0 && <span className={cn("h-1.5 w-1.5 rounded-full", isSelected ? "bg-white/60" : "bg-gold")} title={`${booked} booked`} />}
                </div>
              )}
              {mode === "user" && available > 0 && (
                <span className={cn("mt-0.5 text-[9px] font-medium", isSelected ? "text-white/90" : "text-green-600")}>
                  {available} slot{available > 1 ? "s" : ""}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {mode === "admin" && (
        <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-text-muted border-t border-gold/10 pt-3">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Open</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-yellow-500" /> Pending</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold" /> Booked</span>
        </div>
      )}

      {selectedDate && (
        <button
          type="button"
          onClick={() => onSelectDate("")}
          className="mt-3 w-full text-center text-xs text-gold hover:underline"
        >
          Clear date filter
        </button>
      )}
    </div>
  );
}
