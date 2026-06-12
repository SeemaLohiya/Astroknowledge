"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/Button";
import { fetchJson, parseResponseJson } from "@/lib/fetch-json";
import { CartItemType, User, Voucher, VoucherDiscountType } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, IndianRupee, Plus, Search, Trash2, Users, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const ITEM_TYPES: CartItemType[] = ["product", "service", "course", "pooja", "healing"];

const emptyForm = (): Partial<Voucher> => ({
  code: "",
  label: "",
  description: "",
  discountType: "percent",
  discountValue: 10,
  minOrderAmount: 0,
  maxDiscount: undefined,
  validFrom: new Date().toISOString().split("T")[0],
  validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
  assignedUserIds: [],
  applicableItemTypes: [],
  applicableItemIds: [],
  usageLimit: undefined,
  active: true,
});

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "all", userId: "" });
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Voucher | null>(null);
  const [form, setForm] = useState<Partial<Voucher>>(emptyForm());

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.userId) params.set("userId", filters.userId);
    const [vRes, uRes] = await Promise.all([
      fetchJson<{ vouchers?: Voucher[] }>(`/api/admin/vouchers?${params}`),
      fetchJson<{ users?: User[] }>("/api/users"),
    ]);
    setVouchers(vRes.data?.vouchers || []);
    setUsers(uRes.data?.users || []);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const stats = useMemo(() => ({
    total: vouchers.length,
    active: vouchers.filter((v) => v.active).length,
    assigned: vouchers.reduce((s, v) => s + v.assignedUserIds.length, 0),
  }), [vouchers]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (v: Voucher) => {
    setEditing(v);
    setForm({ ...v });
    setShowForm(true);
  };

  const saveVoucher = async () => {
    if (!form.code?.trim() || !form.label?.trim()) {
      toast.error("Code and label required");
      return;
    }
    if (!form.assignedUserIds?.length) {
      toast.error("Assign at least one user");
      return;
    }
    const payload = { ...form, code: form.code.trim().toUpperCase() };
    const res = editing
      ? await fetch(`/api/admin/vouchers/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/vouchers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    const data = await parseResponseJson<{ error?: string }>(res);
    if (!res.ok) {
      toast.error(data?.error || "Save failed");
      return;
    }
    toast.success(editing ? "Voucher updated" : "Voucher created");
    setShowForm(false);
    load();
  };

  const deleteVoucher = async (id: string) => {
    if (!confirm("Delete this voucher?")) return;
    const res = await fetch(`/api/admin/vouchers/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    load();
  };

  const toggleUser = (userId: string) => {
    const ids = form.assignedUserIds || [];
    setForm({
      ...form,
      assignedUserIds: ids.includes(userId) ? ids.filter((id) => id !== userId) : [...ids, userId],
    });
  };

  const toggleItemType = (type: CartItemType) => {
    const types = form.applicableItemTypes || [];
    setForm({
      ...form,
      applicableItemTypes: types.includes(type) ? types.filter((t) => t !== type) : [...types, type],
    });
  };

  return (
    <PageTransition>
      <FadeIn className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2">
            <Gift className="h-7 w-7 text-gold" />
            Vouchers
          </h1>
          <p className="text-sm text-text-body mt-1">Private vouchers — visible only to assigned users</p>
        </div>
        <Button onClick={openCreate} variant="secondary" className="shrink-0">
          <Plus className="h-4 w-4 mr-1" /> New Voucher
        </Button>
      </FadeIn>

      <div className="mb-6 grid gap-3 grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Total", value: stats.total },
          { label: "Active", value: stats.active },
          { label: "User assignments", value: stats.assigned },
        ].map((s) => (
          <motion.div key={s.label} whileHover={{ y: -2 }} className="rounded-2xl border border-gold/20 bg-white p-4">
            <p className="text-xs text-text-muted">{s.label}</p>
            <p className="text-2xl font-bold text-text-primary">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <FadeIn className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search code or label..."
            className="w-full rounded-xl border border-gold/20 bg-white py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="rounded-xl border border-gold/20 bg-white px-4 py-2.5 text-sm"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={filters.userId}
          onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
          className="rounded-xl border border-gold/20 bg-white px-4 py-2.5 text-sm min-w-[160px]"
        >
          <option value="">All users</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </FadeIn>

      {loading ? (
        <p className="text-center text-text-muted py-12">Loading...</p>
      ) : (
        <div className="space-y-4">
          {vouchers.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-gold/20 bg-white p-4 md:p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-gold/15 px-3 py-1 font-mono text-sm font-bold text-gold">{v.code}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${v.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {v.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-text-primary">{v.label}</h3>
                  {v.description && <p className="mt-1 text-sm text-text-body">{v.description}</p>}
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {v.discountType === "percent" ? `${v.discountValue}% off` : `₹${v.discountValue} off`}
                    </span>
                    <span>{v.validFrom} → {v.validUntil}</span>
                    <span>Used {v.usedCount}{v.usageLimit ? `/${v.usageLimit}` : ""}</span>
                  </div>
                  <p className="mt-2 flex items-center gap-1 text-xs text-gold">
                    <Users className="h-3.5 w-3.5" />
                    {v.assignedUserIds.length} user(s): {v.assignedUserIds.map((id) => users.find((u) => u.id === id)?.name || id).join(", ")}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEdit(v)}>Edit</Button>
                  <button type="button" onClick={() => deleteVoucher(v.id)} className="rounded-xl border border-red-200 p-2 text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {!vouchers.length && (
            <p className="rounded-2xl border border-dashed border-gold/30 py-16 text-center text-text-muted">No vouchers yet</p>
          )}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gold/25 bg-cream p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">{editing ? "Edit Voucher" : "Create Voucher"}</h2>
                <button type="button" onClick={() => setShowForm(false)}><X className="h-5 w-5" /></button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-text-muted">Code *</label>
                  <input value={form.code || ""} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm font-mono" />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Label *</label>
                  <input value={form.label || ""} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-text-muted">Description</label>
                  <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Discount type</label>
                  <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value as VoucherDiscountType })} className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm">
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed amount</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-muted">Discount value</label>
                  <input type="number" value={form.discountValue ?? 0} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Valid from</label>
                  <input type="date" value={form.validFrom || ""} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Valid until</label>
                  <input type="date" value={form.validUntil || ""} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Min order (₹)</label>
                  <input type="number" value={form.minOrderAmount ?? 0} onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })} className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Max discount (₹)</label>
                  <input type="number" value={form.maxDiscount ?? ""} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value ? Number(e.target.value) : undefined })} className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-text-muted">Usage limit</label>
                  <input type="number" value={form.usageLimit ?? ""} onChange={(e) => setForm({ ...form, usageLimit: e.target.value ? Number(e.target.value) : undefined })} className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.active ?? true} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                    Active
                  </label>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-text-muted mb-2">Applicable item types (empty = all)</p>
                <div className="flex flex-wrap gap-2">
                  {ITEM_TYPES.map((t) => (
                    <button key={t} type="button" onClick={() => toggleItemType(t)} className={`rounded-full px-3 py-1 text-xs capitalize ${(form.applicableItemTypes || []).includes(t) ? "bg-gold text-white" : "bg-orange/10 text-text-body"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-text-muted mb-2">Assign users *</p>
                <div className="max-h-40 overflow-y-auto rounded-xl border border-gold/15 p-2 space-y-1">
                  {users.filter((u) => u.role === "user").map((u) => (
                    <label key={u.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-orange/5 cursor-pointer">
                      <input type="checkbox" checked={(form.assignedUserIds || []).includes(u.id)} onChange={() => toggleUser(u.id)} />
                      <span>{u.name}</span>
                      <span className="text-xs text-text-muted truncate">{u.email}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={saveVoucher}>{editing ? "Update" : "Create"}</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
