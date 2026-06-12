"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { UpiPaymentPanel } from "@/components/payment/UpiPaymentPanel";
import { SITE } from "@/lib/constants";
import { fetchJson, parseResponseJson } from "@/lib/fetch-json";
import { PaymentRecord } from "@/lib/types";
import { SafeImage } from "@/components/ui/SafeImage";
import { CheckCircle, CreditCard, ExternalLink, IndianRupee, Phone, Search, ShieldCheck, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type PaymentTab = "pending" | "all" | "paid";

export default function AdminPaymentsPage() {
  const { c } = useLanguage();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<PaymentTab>("pending");
  const [filters, setFilters] = useState({ search: "", status: "all", type: "all", method: "all" });
  const [comments, setComments] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status !== "all") params.set("status", filters.status);
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.method !== "all") params.set("method", filters.method);
    const res = await fetchJson<{ payments?: PaymentRecord[] }>(`/api/payments?${params}`, { cache: "no-store" });
    setPayments(res.data?.payments || []);
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    const interval = setInterval(load, 15000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [load]);

  const stats = useMemo(() => {
    const paid = payments.filter((p) => p.status === "paid");
    const awaiting = payments.filter((p) => p.status === "awaiting_approval");
    return {
      totalRevenue: paid.reduce((s, p) => s + p.amount, 0),
      awaitingCount: awaiting.length,
      razorpayCount: paid.filter((p) => p.method === "razorpay").length,
      adminCount: paid.filter((p) => p.method === "admin_approval").length,
    };
  }, [payments]);

  const displayed = useMemo(() => {
    if (tab === "pending") return payments.filter((p) => p.status === "awaiting_approval" || p.status === "pending");
    if (tab === "paid") return payments.filter((p) => p.status === "paid");
    return payments;
  }, [payments, tab]);

  const patchPayment = async (id: string, body: Record<string, string>) => {
    const res = await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await parseResponseJson<{ error?: string; message?: string }>(res);
    if (!res.ok) {
      toast.error(data?.error || "Action failed");
      return;
    }
    toast.success(data?.message || "Updated");
    setComments((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    load();
  };

  return (
    <PageTransition>
      <FadeIn className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">{c.admin.paymentsTitle}</h1>
        <p className="text-sm text-text-body mt-1">{c.admin.paymentsSubtitle}</p>
        <p className="mt-2 text-xs text-text-muted">
          Two payment methods: <strong>Razorpay</strong> (instant) and <strong>Admin Verification</strong> (UPI/bank transfer proof)
        </p>
      </FadeIn>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/15 to-orange/5 p-4">
          <p className="text-xs text-text-muted">Total Revenue (filtered)</p>
          <p className="mt-1 flex items-center text-2xl font-bold text-text-primary">
            <IndianRupee className="h-5 w-5 text-gold" />
            {stats.totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-2xl border border-amber-300/40 bg-amber-50/80 p-4">
          <p className="text-xs text-text-muted">Awaiting Approval</p>
          <p className="mt-1 text-2xl font-bold text-gold">{stats.awaitingCount}</p>
        </div>
        <div className="rounded-2xl border border-gold/20 bg-white/80 p-4">
          <p className="flex items-center gap-1 text-xs text-text-muted"><CreditCard className="h-3 w-3" /> Razorpay</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">{stats.razorpayCount}</p>
        </div>
        <div className="rounded-2xl border border-gold/20 bg-white/80 p-4">
          <p className="flex items-center gap-1 text-xs text-text-muted"><ShieldCheck className="h-3 w-3" /> Admin Verified</p>
          <p className="mt-1 text-2xl font-bold text-text-primary">{stats.adminCount}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["pending", "all", "paid"] as PaymentTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              tab === t ? "bg-gold text-white" : "glass-card text-text-body hover:text-gold"
            }`}
          >
            {t === "pending" ? "Pending Review" : t === "paid" ? "Paid" : "All"}
            {t === "pending" && stats.awaitingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-white/30 px-1.5 text-xs">{stats.awaitingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative sm:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search name, email, phone, ref ID..."
            className="w-full rounded-xl border border-gold/20 bg-orange/5 pl-9 pr-3 py-2.5 text-sm"
          />
        </div>
        <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2.5 text-sm">
          <option value="all">{c.admin.allStatuses}</option>
          <option value="pending">Pending</option>
          <option value="awaiting_approval">Awaiting Approval</option>
          <option value="paid">Paid</option>
          <option value="refunded">Refunded</option>
          <option value="failed">Failed</option>
        </select>
        <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2.5 text-sm">
          <option value="all">{c.admin.allTypes}</option>
          <option value="checkout">Checkout</option>
          <option value="order">{c.admin.order}</option>
          <option value="slot">{c.admin.slot}</option>
        </select>
        <select value={filters.method} onChange={(e) => setFilters({ ...filters, method: e.target.value })} className="rounded-xl border border-gold/20 bg-orange/5 px-3 py-2.5 text-sm">
          <option value="all">All Methods</option>
          <option value="razorpay">Razorpay</option>
          <option value="admin_approval">Admin Approval</option>
        </select>
      </div>

      <FadeIn className="mb-6 space-y-4">
        <div className="rounded-xl border border-gold/15 bg-orange/5 px-4 py-3 text-sm text-text-body">
          <strong className="text-text-primary">Admin verification:</strong> Customer scans the QR or pays to <strong>{SITE.upiId}</strong>, uploads screenshot + transaction ref ID. Approve to unlock purchase & slot booking.
        </div>
        <UpiPaymentPanel compact showScannerHint />
      </FadeIn>

      {loading ? (
        <p className="text-text-muted text-center py-8">{c.common.loading}</p>
      ) : displayed.length === 0 ? (
        <p className="text-text-muted text-center py-8">{c.admin.noResults}</p>
      ) : (
        <div className="space-y-3">
          {displayed.map((p) => (
            <div key={p.id} className={`rounded-2xl glass-card p-5 ${p.status === "awaiting_approval" ? "border-2 border-gold/40 shadow-md shadow-gold/10" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      p.type === "checkout" ? "bg-gold/20 text-gold" :
                      p.type === "order" ? "bg-purple-500/20 text-purple-600" : "bg-blue-500/20 text-blue-600"
                    }`}>
                      {p.type}
                    </span>
                    {p.method && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                        p.method === "razorpay" ? "bg-blue-500/15 text-blue-700" : "bg-orange/15 text-orange-700"
                      }`}>
                        {p.method === "razorpay" ? "Razorpay" : "Admin Verified"}
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                      p.status === "paid" ? "bg-green-500/20 text-green-700" :
                      p.status === "awaiting_approval" ? "bg-yellow-500/20 text-yellow-700" :
                      p.status === "failed" ? "bg-red-500/20 text-red-600" :
                      "bg-gray-500/20 text-gray-600"
                    }`}>
                      {p.status === "awaiting_approval" ? "Pending for Confirmation" : p.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-semibold text-text-primary mt-2">{p.userName}</p>
                  {p.userPhone && (
                    <p className="flex items-center gap-1 text-sm text-text-body mt-0.5">
                      <Phone className="h-3.5 w-3.5" />{p.userPhone}
                    </p>
                  )}
                  <p className="text-xs text-text-muted">{p.userEmail}</p>
                  {p.items?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {p.items.map((item) => (
                        <li key={`${item.itemType}-${item.id}`} className="text-xs text-text-body">
                          <span className="capitalize text-text-muted">{item.itemType}:</span> {item.name} × {item.quantity} — ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.transactionRefId && (
                    <p className="mt-2 text-xs text-text-body">
                      <span className="text-text-muted">Transaction Ref:</span>{" "}
                      <strong className="text-text-primary">{p.transactionRefId}</strong>
                    </p>
                  )}
                  {p.paymentProofImage && (
                    <div className="mt-3">
                      <p className="text-xs text-text-muted mb-1">Payment Screenshot</p>
                      <a
                        href={p.paymentProofImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block h-32 w-48 overflow-hidden rounded-xl border border-gold/20 bg-orange/5"
                      >
                        <SafeImage src={p.paymentProofImage} alt="Payment proof" fill className="object-contain" />
                        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="h-5 w-5 text-white" />
                        </span>
                      </a>
                    </div>
                  )}
                  <p className="text-xs text-text-muted mt-2">{new Date(p.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="flex items-center font-bold text-gold text-lg">
                    <IndianRupee className="h-5 w-5" />{p.amount.toLocaleString("en-IN")}
                  </span>
                  {p.adminComment && p.status !== "awaiting_approval" && (
                    <p className="max-w-xs text-right text-xs text-text-body rounded-lg bg-orange/5 px-3 py-2">
                      <span className="text-text-muted">Admin note:</span> {p.adminComment}
                    </p>
                  )}
                  {p.status === "awaiting_approval" && (
                    <div className="flex w-full max-w-xs flex-col gap-2">
                      <textarea
                        value={comments[p.id] || ""}
                        onChange={(e) => setComments({ ...comments, [p.id]: e.target.value })}
                        placeholder="Comment for user (optional) — e.g. payment verified, booking instructions..."
                        rows={3}
                        className="w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-xs text-text-primary resize-none focus:border-gold focus:outline-none"
                      />
                      <button
                        onClick={() => patchPayment(p.id, { action: "approve", adminComment: comments[p.id] || "" })}
                        className="flex items-center justify-center gap-1 rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" /> Approve Payment
                      </button>
                      <button
                        onClick={() => patchPayment(p.id, { action: "reject", adminComment: comments[p.id] || "" })}
                        className="flex items-center justify-center gap-1 rounded-full bg-red-500/15 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-500/25"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  )}
                  {p.status !== "awaiting_approval" && (
                    <select
                      value={p.status}
                      onChange={(e) => patchPayment(p.id, { status: e.target.value })}
                      className="rounded-lg border border-gold/30 bg-cream px-3 py-2 text-sm capitalize"
                    >
                      <option value="pending">Pending</option>
                      <option value="awaiting_approval">Awaiting Approval</option>
                      <option value="paid">Paid</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
