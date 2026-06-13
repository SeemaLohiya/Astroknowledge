"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { COUNTRIES, getCities, getStates } from "@/lib/location-data";
import { fetchJson } from "@/lib/fetch-json";
import { SavedAddress } from "@/lib/types";
import { MapPin, Plus, Star, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const emptyForm = {
  label: "Home",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  country: "India",
  state: "",
  city: "",
  pincode: "",
  isDefault: false,
};

export function SavedAddresses() {
  const { c } = useLanguage();
  const d = c.dashboard;
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const states = useMemo(() => getStates(form.country), [form.country]);
  const cities = useMemo(() => getCities(form.state), [form.state]);
  const filteredStates = useMemo(
    () => states.filter((s) => s.toLowerCase().includes(stateFilter.toLowerCase())),
    [states, stateFilter]
  );
  const filteredCities = useMemo(
    () => cities.filter((c) => c.toLowerCase().includes(cityFilter.toLowerCase())),
    [cities, cityFilter]
  );

  const load = () => {
    void fetchJson<{ addresses?: SavedAddress[] }>("/api/addresses").then((res) => {
      setAddresses(res.data?.addresses || []);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.country || !form.state || !form.city) {
      toast.error("Please select country, state and city");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(d.addressSaved);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch {
      toast.error(d.failedSave);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    load();
  };

  const selectCls = "w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2.5 text-sm focus:border-gold focus:outline-none";

  return (
    <div className="rounded-2xl glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-text-primary flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gold" /> {d.savedAddresses}
        </h2>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> {d.addAddress}
        </Button>
      </div>

      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-text-muted">{d.noAddresses}</p>
      )}

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="rounded-xl border border-gold/15 bg-orange/5 p-4 flex justify-between gap-3">
            <div>
              <p className="font-medium text-text-primary flex items-center gap-2">
                {addr.label}
                {addr.isDefault && <Star className="h-3 w-3 fill-gold text-gold" />}
              </p>
              <p className="text-sm text-text-body mt-1">{addr.name} · {addr.phone}</p>
              <p className="text-sm text-text-muted">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
              <p className="text-sm text-text-muted">{addr.city}, {addr.state}, {addr.country || "India"} — {addr.pincode}</p>
            </div>
            <button type="button" onClick={() => handleDelete(addr.id)} className="text-red-400 hover:text-red-600 self-start">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mt-4 border-t border-gold/10 pt-4 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder={d.addressLabel} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
            <input required placeholder={d.fullName} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
            <input required placeholder={d.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
            <input required placeholder={d.pincode} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
          </div>
          <input required placeholder={d.addressLine1} value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />
          <input placeholder={d.addressLine2} value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm" />

          <div className="rounded-xl border border-gold/20 bg-white/60 p-4 space-y-3">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Country *</label>
              <select
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value, state: "", city: "" })}
                className={selectCls}
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-text-muted">State *</label>
              <input
                placeholder="Filter states..."
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="mb-2 w-full rounded-lg border border-gold/15 bg-orange/5 px-3 py-1.5 text-xs"
              />
              <select
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value, city: "" })}
                className={selectCls}
              >
                <option value="">Select state</option>
                {filteredStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-text-muted">City *</label>
              <input
                placeholder="Filter cities..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="mb-2 w-full rounded-lg border border-gold/15 bg-orange/5 px-3 py-1.5 text-xs"
                disabled={!form.state}
              />
              <select
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={selectCls}
                disabled={!form.state}
              >
                <option value="">Select city</option>
                {filteredCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <p className="text-xs text-text-muted">
              Selected: {form.country || "—"} · {form.state || "—"} · {form.city || "—"}
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
            {d.setDefaultAddress}
          </label>
          <Button type="submit" variant="secondary" size="sm" disabled={saving} className="w-full sm:w-auto">
            {saving ? c.pleaseWait : d.saveAddress}
          </Button>
        </form>
      )}
    </div>
  );
}
