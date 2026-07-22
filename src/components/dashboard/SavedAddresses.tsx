"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { COUNTRIES, getCities, getStates } from "@/lib/location-data";
import { withSelectedOption } from "@/lib/select-options";
import { fetchJson } from "@/lib/fetch-json";
import { SavedAddress } from "@/lib/types";
import { MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
  locationLink: "",
  isDefault: false,
};

export function SavedAddresses() {
  const { c } = useLanguage();
  const d = c.dashboard;
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  const states = useMemo(() => getStates(form.country), [form.country]);
  const cities = useMemo(() => getCities(form.state), [form.state]);
  const filteredStates = useMemo(
    () => withSelectedOption(states.filter((s) => s.toLowerCase().includes(stateFilter.toLowerCase())), form.state),
    [states, stateFilter, form.state]
  );
  const filteredCities = useMemo(
    () => withSelectedOption(cities.filter((city) => city.toLowerCase().includes(cityFilter.toLowerCase())), form.city),
    [cities, cityFilter, form.city]
  );

  const load = () => {
    void fetchJson<{ addresses?: SavedAddress[] }>("/api/addresses").then((res) => {
      setAddresses(res.data?.addresses || []);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (addr: SavedAddress) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label || "Home",
      name: addr.name || "",
      phone: addr.phone || "",
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      country: addr.country || "India",
      state: addr.state || "",
      city: addr.city || "",
      pincode: addr.pincode || "",
      locationLink: addr.locationLink || "",
      isDefault: !!addr.isDefault,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.country || !form.state || !form.city) {
      toast.error("Please select country, state and city");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(editingId ? `/api/addresses/${editingId}` : "/api/addresses", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(d.addressSaved);
      setForm(emptyForm);
      setEditingId(null);
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

  const selectCls =
    "w-full min-h-[44px] rounded-xl border border-gold/20 bg-orange/5 px-3 py-2.5 text-sm focus:border-gold focus:outline-none cursor-pointer";

  return (
    <div className="rounded-2xl glass-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold text-text-primary">
          <MapPin className="h-5 w-5 text-gold" /> {d.savedAddresses}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (showForm && !editingId) setShowForm(false);
            else openCreate();
          }}
        >
          <Plus className="h-4 w-4" /> {d.addAddress}
        </Button>
      </div>

      {addresses.length === 0 && !showForm && <p className="text-sm text-text-muted">{d.noAddresses}</p>}

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div key={addr.id} className="flex justify-between gap-3 rounded-xl border border-gold/15 bg-orange/5 p-4">
            <div>
              <p className="flex items-center gap-2 font-medium text-text-primary">
                {addr.label}
                {addr.isDefault && <Star className="h-3 w-3 fill-gold text-gold" />}
              </p>
              <p className="mt-1 text-sm text-text-body">
                {addr.name} · {addr.phone}
              </p>
              <p className="text-sm text-text-muted">
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ""}
              </p>
              <p className="text-sm text-text-muted">
                {addr.city}, {addr.state}, {addr.country || "India"} — {addr.pincode}
              </p>
              {addr.locationLink ? (
                <a
                  href={addr.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs font-medium text-gold hover:underline"
                >
                  Open location link
                </a>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-2 self-start">
              <button type="button" onClick={() => openEdit(addr)} className="text-gold hover:text-gold-bright" aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => handleDelete(addr.id)} className="text-red-400 hover:text-red-600" aria-label="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="mt-4 space-y-4 border-t border-gold/10 pt-4">
          <p className="text-sm font-semibold text-text-primary">{editingId ? "Edit address" : "Add delivery address"}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder={d.addressLabel}
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm"
            />
            <input
              required
              placeholder={d.fullName}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm"
            />
            <input
              required
              placeholder={d.phone}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm"
            />
            <input
              required
              placeholder={d.pincode}
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm"
            />
          </div>
          <input
            required
            placeholder={d.addressLine1}
            value={form.line1}
            onChange={(e) => setForm({ ...form, line1: e.target.value })}
            className="w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm"
          />
          <input
            placeholder={d.addressLine2}
            value={form.line2}
            onChange={(e) => setForm({ ...form, line2: e.target.value })}
            className="w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm"
          />
          <input
            type="url"
            placeholder="Location link (Google Maps URL) — optional"
            value={form.locationLink}
            onChange={(e) => setForm({ ...form, locationLink: e.target.value })}
            className="w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm"
          />

          <div className="space-y-3 rounded-xl border border-gold/20 bg-white/60 p-4">
            <div>
              <label className="mb-1 block text-xs text-text-muted">Country *</label>
              <select
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value, state: "", city: "" })}
                className={selectCls}
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">State *</label>
              <input
                type="search"
                placeholder="Type to filter states..."
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="mb-2 w-full rounded-lg border border-gold/15 bg-white px-3 py-1.5 text-xs"
              />
              <select
                required
                value={form.state}
                onChange={(e) => {
                  setStateFilter("");
                  setForm({ ...form, state: e.target.value, city: "" });
                }}
                className={selectCls}
              >
                <option value="">Select state</option>
                {filteredStates.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">City *</label>
              <input
                type="search"
                placeholder="Type to filter cities..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="mb-2 w-full rounded-lg border border-gold/15 bg-white px-3 py-1.5 text-xs"
                disabled={!form.state}
              />
              <select
                required
                value={form.city}
                onChange={(e) => {
                  setCityFilter("");
                  setForm({ ...form, city: e.target.value });
                }}
                className={selectCls}
                disabled={!form.state}
              >
                <option value="">Select city</option>
                {filteredCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
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
