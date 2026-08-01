"use client";

import { fetchJson, parseResponseJson } from "@/lib/fetch-json";
import { AdminRevenueData, RevenueExtraRow } from "@/lib/admin-revenue-store";
import { Plus, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type MonthRow = {
  key: string;
  month: string;
  amount: number;
  computedAmount: number;
  note?: string;
  isOverride?: boolean;
};

interface MonthlyRevenueEditorProps {
  months: MonthRow[];
  summaryNote?: string;
  onSaved?: () => void;
}

export function MonthlyRevenueEditor({ months, summaryNote, onSaved }: MonthlyRevenueEditorProps) {
  const [overrides, setOverrides] = useState<AdminRevenueData["overrides"]>({});
  const [extraRows, setExtraRows] = useState<RevenueExtraRow[]>([]);
  const [note, setNote] = useState(summaryNote || "");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadSaved = useCallback(async () => {
    const res = await fetchJson<{ revenue?: AdminRevenueData }>("/api/admin/revenue", { cache: "no-store" });
    if (res.ok && res.data?.revenue) {
      setOverrides(res.data.revenue.overrides || {});
      setExtraRows(res.data.revenue.extraRows || []);
      setNote(res.data.revenue.summaryNote || summaryNote || "");
    } else {
      const initial: AdminRevenueData["overrides"] = {};
      months.forEach((m) => {
        if (m.isOverride && m.note) {
          initial[m.key] = { amount: m.amount, note: m.note };
        }
      });
      setOverrides(initial);
    }
    setLoaded(true);
  }, [months, summaryNote]);

  useEffect(() => {
    void loadSaved();
  }, [loadSaved]);

  const displayAmount = (row: MonthRow) => {
    const o = overrides[row.key];
    return o !== undefined ? o.amount : row.computedAmount;
  };

  const displayNote = (row: MonthRow) => overrides[row.key]?.note ?? row.note ?? "";

  const setMonthOverride = (key: string, patch: Partial<{ amount: number; note: string }>) => {
    setOverrides((prev) => {
      const row = months.find((m) => m.key === key);
      const base = row?.computedAmount ?? 0;
      const current = prev[key] ?? { amount: base, note: "" };
      const next = { ...current, ...patch };
      if (next.amount === base && !next.note?.trim()) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: next };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/revenue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides, extraRows, summaryNote: note }),
      });
      const data = await parseResponseJson<{ error?: string }>(res);
      if (!res.ok) throw new Error(data?.error || "Save failed");
      toast.success("Monthly revenue saved");
      onSaved?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) {
    return <p className="py-4 text-center text-sm text-text-muted">Loading revenue editor…</p>;
  }

  const chartTotal = months.reduce((s, m) => s + displayAmount(m), 0) + extraRows.reduce((s, r) => s + r.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-text-muted">
          Edit amounts to include offline/cash revenue. Chart total:{" "}
          <span className="font-semibold text-gold">₹{chartTotal.toLocaleString("en-IN")}</span>
        </p>
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving…" : "Save revenue"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gold/15">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-gold/10 bg-orange/5 text-left text-xs text-text-muted">
              <th className="px-3 py-2">Month</th>
              <th className="px-3 py-2">System</th>
              <th className="px-3 py-2">Displayed ₹</th>
              <th className="px-3 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {months.map((row) => (
              <tr key={row.key} className="border-b border-gold/5">
                <td className="px-3 py-2 font-medium text-text-primary">{row.month}</td>
                <td className="px-3 py-2 text-text-muted">₹{row.computedAmount.toLocaleString("en-IN")}</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={displayAmount(row)}
                    onChange={(e) => setMonthOverride(row.key, { amount: Number(e.target.value) || 0 })}
                    className="w-28 rounded-lg border border-gold/20 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    value={displayNote(row)}
                    onChange={(e) => setMonthOverride(row.key, { note: e.target.value })}
                    placeholder="Optional note"
                    className="w-full min-w-[120px] rounded-lg border border-gold/20 px-2 py-1 text-xs"
                  />
                </td>
              </tr>
            ))}
            {extraRows.map((row, i) => (
              <tr key={row.id} className="border-b border-gold/5 bg-gold/5">
                <td className="px-3 py-2">
                  <input
                    value={row.label}
                    onChange={(e) => {
                      const next = [...extraRows];
                      next[i] = { ...next[i], label: e.target.value };
                      setExtraRows(next);
                    }}
                    placeholder="Label"
                    className="w-full rounded-lg border border-gold/20 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2 text-text-muted">—</td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    value={row.amount}
                    onChange={(e) => {
                      const next = [...extraRows];
                      next[i] = { ...next[i], amount: Number(e.target.value) || 0 };
                      setExtraRows(next);
                    }}
                    className="w-28 rounded-lg border border-gold/20 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <input
                      value={row.note || ""}
                      onChange={(e) => {
                        const next = [...extraRows];
                        next[i] = { ...next[i], note: e.target.value };
                        setExtraRows(next);
                      }}
                      placeholder="Note"
                      className="flex-1 rounded-lg border border-gold/20 px-2 py-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setExtraRows(extraRows.filter((_, j) => j !== i))}
                      className="rounded-lg p-1 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            setExtraRows([
              ...extraRows,
              { id: `extra-${Date.now()}`, label: "Extra revenue", amount: 0, note: "" },
            ])
          }
          className="inline-flex items-center gap-1 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-semibold text-gold"
        >
          <Plus className="h-3.5 w-3.5" /> Add row
        </button>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-text-muted">Summary note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="e.g. Includes offline consultations and workshop fees"
          className="w-full rounded-xl border border-gold/20 px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
