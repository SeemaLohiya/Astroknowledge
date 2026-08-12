"use client";

import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  CITY_OTHERS_VALUE,
  isValidIndianPhone,
  isValidIndianPincode,
  normalizePhoneInput,
  normalizePincodeInput,
} from "@/lib/address-validation";
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

export function SavedAddresses({
  selectable = false,
  selectedId,
  onSelect,
  onAddressesChange,
}: {
  selectable?: boolean;
  selectedId?: string;
  onSelect?: (id: string) => void;
  onAddressesChange?: (addresses: SavedAddress[]) => void;
} = {}) {
  const { c } = useLanguage();
  const d = c.dashboard;
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [cityIsOther, setCityIsOther] = useState(false);
  const [customCity, setCustomCity] = useState("");

  const states = useMemo(() => getStates(form.country), [form.country]);
  const cities = useMemo(() => getCities(form.state), [form.state]);
  const stateOptions = useMemo(
    () => withSelectedOption(states, form.state),
    [states, form.state]
  );
  const cityOptions = useMemo(() => {
    const list = withSelectedOption(cities, cityIsOther ? "" : form.city);
    return list.includes("Others") ? list : [...list, "Others"];
  }, [cities, form.city, cityIsOther]);

  const load = () => {
    void fetchJson<{ addresses?: SavedAddress[] }>("/api/addresses").then((res) => {
      const list = res.data?.addresses || [];
      setAddresses(list);
      onAddressesChange?.(list);
      if (selectable && onSelect && list.length && !selectedId) {
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) onSelect(def.id);
      }
    });
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setCityIsOther(false);
    setCustomCity("");
    setShowForm(true);
  };

  const openEdit = (addr: SavedAddress) => {
    const stateCities = getCities(addr.state || "");
    const isOther = Boolean(addr.city && !stateCities.includes(addr.city));
    setEditingId(addr.id);
    setForm({
      label: addr.label || "Home",
      name: addr.name || "",
      phone: addr.phone || "",
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      country: addr.country || "India",
      state: addr.state || "",
      city: isOther ? CITY_OTHERS_VALUE : addr.city || "",
      pincode: addr.pincode || "",
      locationLink: addr.locationLink || "",
      isDefault: !!addr.isDefault,
    });
    setCityIsOther(isOther);
    setCustomCity(isOther ? addr.city || "" : "");
    setShowForm(true);
  };

  const saveAddress = async () => {
    if (!form.country || !form.state) {
      toast.error("Please select country and state");
      return;
    }
    const resolvedCity = cityIsOther ? customCity.trim() : form.city;
    if (!resolvedCity) {
      toast.error("Please select or enter your city");
      return;
    }
    if (!isValidIndianPhone(form.phone)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!isValidIndianPincode(form.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        phone: normalizePhoneInput(form.phone),
        pincode: normalizePincodeInput(form.pincode),
        city: resolvedCity,
      };
      const res = await fetch(editingId ? `/api/addresses/${editingId}` : "/api/addresses", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || d.failedSave);
      toast.success(d.addressSaved);
      setForm(emptyForm);
      setCityIsOther(false);
      setCustomCity("");
      setEditingId(null);
      setShowForm(false);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : d.failedSave);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await saveAddress();
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
          <div
            key={addr.id}
            role={selectable ? "button" : undefined}
            tabIndex={selectable ? 0 : undefined}
            onClick={selectable ? () => onSelect?.(addr.id) : undefined}
            onKeyDown={
              selectable
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") onSelect?.(addr.id);
                  }
                : undefined
            }
            className={`flex justify-between gap-3 rounded-xl border p-4 transition-colors ${
              selectable && selectedId === addr.id
                ? "border-gold bg-gold/10 ring-1 ring-gold/30"
                : "border-gold/15 bg-orange/5"
            } ${selectable ? "cursor-pointer hover:border-gold/40" : ""}`}
          >
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
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(addr);
                }}
                className="text-gold hover:text-gold-bright"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleDelete(addr.id);
                }}
                className="text-red-400 hover:text-red-600"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleSave}
          onClick={(e) => e.stopPropagation()}
          className="mt-4 space-y-4 border-t border-gold/10 pt-4"
        >
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
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder={`${d.phone} (10 digits)`}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: normalizePhoneInput(e.target.value) })}
              className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm"
            />
            <input
              required
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder={`${d.pincode} (6 digits)`}
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: normalizePincodeInput(e.target.value) })}
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
              <select
                required
                value={form.state}
                onChange={(e) => {
                  setForm({ ...form, state: e.target.value, city: "" });
                  setCityIsOther(false);
                  setCustomCity("");
                }}
                className={selectCls}
              >
                <option value="">Select state</option>
                {stateOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-muted">City *</label>
              <select
                required
                value={cityIsOther ? CITY_OTHERS_VALUE : form.city}
                onChange={(e) => {
                  if (e.target.value === CITY_OTHERS_VALUE) {
                    setCityIsOther(true);
                    setForm({ ...form, city: CITY_OTHERS_VALUE });
                  } else {
                    setCityIsOther(false);
                    setCustomCity("");
                    setForm({ ...form, city: e.target.value });
                  }
                }}
                className={selectCls}
                disabled={!form.state}
              >
                <option value="">Select city</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city === "Others" ? CITY_OTHERS_VALUE : city}>
                    {city}
                  </option>
                ))}
              </select>
              {cityIsOther && (
                <input
                  required
                  placeholder="Type your city name"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm"
                />
              )}
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
          <Button type="button" variant="secondary" size="sm" disabled={saving} className="w-full sm:w-auto" onClick={() => void saveAddress()}>
            {saving ? c.pleaseWait : d.saveAddress}
          </Button>
        </form>
      )}
    </div>
  );
}
