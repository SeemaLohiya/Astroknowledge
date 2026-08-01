"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/Button";
import { fetchJson, parseResponseJson } from "@/lib/fetch-json";
import {
  Course,
  CourseResourceLink,
  Order,
  PaymentRecord,
  User,
  Voucher,
} from "@/lib/types";
import { ArrowLeft, Link2, Pencil, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

type SafeUser = Omit<User, "password">;

function formatDob(dob?: string) {
  if (!dob) return "—";
  const d = new Date(dob.includes("T") ? dob : `${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) {
    const parts = dob.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return dob;
  }
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [user, setUser] = useState<SafeUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [vouchersAssigned, setVouchersAssigned] = useState<Voucher[]>([]);
  const [vouchersUsed, setVouchersUsed] = useState<Voucher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [resourceLinks, setResourceLinks] = useState<{ label: string; url: string }[]>([
    { label: "", url: "" },
  ]);
  const [editingLink, setEditingLink] = useState<{
    courseId: string;
    linkId: string;
    label: string;
    url: string;
  } | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [overview, catalog] = await Promise.all([
      fetchJson<{
        user?: SafeUser;
        orders?: Order[];
        payments?: PaymentRecord[];
        vouchersAssigned?: Voucher[];
        vouchersUsed?: Voucher[];
      }>(`/api/users/${id}/overview`, { cache: "no-store" }),
      fetchJson<{ items?: Course[] }>("/api/catalog/courses", { cache: "no-store" }),
    ]);
    setUser(overview.data?.user || null);
    setOrders(overview.data?.orders || []);
    setPayments(overview.data?.payments || []);
    setVouchersAssigned(overview.data?.vouchersAssigned || []);
    setVouchersUsed(overview.data?.vouchersUsed || []);
    setCourses(catalog.data?.items || []);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const persistCourseResources = async (next: NonNullable<SafeUser["courseResources"]>) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseResources: next }),
      });
      const data = await parseResponseJson<{ user?: SafeUser; error?: string }>(res);
      if (!res.ok) throw new Error(data?.error || "Save failed");
      setUser(data?.user || null);
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveCourseResources = async () => {
    if (!user || !courseId) {
      toast.error("Select a course");
      return;
    }
    const links = resourceLinks
      .filter((l) => l.url.trim())
      .map((l, i) => ({
        id: `admin-link-${Date.now()}-${i}`,
        label: l.label.trim() || "Resource",
        url: l.url.trim(),
      }));
    if (!links.length) {
      toast.error("Paste at least one resource URL");
      return;
    }

    const existing = [...(user.courseResources || [])];
    const idx = existing.findIndex((e) => e.courseId === courseId);
    if (idx >= 0) {
      existing[idx] = { courseId, links: [...existing[idx].links, ...links] };
    } else {
      existing.push({ courseId, links });
    }

    const ok = await persistCourseResources(existing);
    if (ok) {
      setResourceLinks([{ label: "", url: "" }]);
      toast.success("Course resources saved");
    }
  };

  const updateResourceLink = async () => {
    if (!user || !editingLink) return;
    const label = editingLink.label.trim() || "Resource";
    const url = editingLink.url.trim();
    if (!url) {
      toast.error("URL is required");
      return;
    }
    const next = (user.courseResources || []).map((entry) =>
      entry.courseId === editingLink.courseId
        ? {
            ...entry,
            links: entry.links.map((l) =>
              l.id === editingLink.linkId ? { ...l, label, url } : l
            ),
          }
        : entry
    );
    const ok = await persistCourseResources(next);
    if (ok) {
      setEditingLink(null);
      toast.success("Link updated");
    }
  };

  const removeResourceLink = async (courseIdToEdit: string, linkId: string) => {
    if (!user) return;
    const next = (user.courseResources || [])
      .map((entry) =>
        entry.courseId === courseIdToEdit
          ? { ...entry, links: entry.links.filter((l) => l.id !== linkId) }
          : entry
      )
      .filter((e) => e.links.length > 0);
    const ok = await persistCourseResources(next);
    if (ok) toast.success("Link removed");
  };

  const purchasedCourseIds = useMemo(() => {
    const ids = new Set<string>();
    for (const o of orders) {
      for (const item of o.items) {
        if (item.itemType === "course" || courses.some((c) => c.id === item.productId)) {
          ids.add(item.productId);
        }
      }
    }
    for (const p of payments) {
      if (p.status !== "paid") continue;
      for (const item of p.items) {
        if (item.itemType === "course") ids.add(item.id);
      }
    }
    return ids;
  }, [orders, payments, courses]);

  const courseOptions = useMemo(() => {
    const purchased = courses.filter((c) => purchasedCourseIds.has(c.id));
    return purchased.length ? purchased : courses;
  }, [courses, purchasedCourseIds]);

  if (loading) {
    return <p className="py-16 text-center text-text-muted">Loading user…</p>;
  }

  if (!user) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-muted">User not found</p>
        <Link href="/admin/users" className="mt-4 inline-block text-gold hover:underline">
          Back to users
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <FadeIn className="mb-6">
        <Link href="/admin/users" className="mb-3 inline-flex items-center gap-1 text-sm text-gold hover:underline">
          <ArrowLeft className="h-4 w-4" /> All users
        </Link>
        <h1 className="font-display text-2xl font-bold text-text-primary">{user.name}</h1>
        <p className="text-sm text-text-muted">{user.email}</p>
      </FadeIn>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Phone", value: user.phone || "—" },
          { label: "DOB", value: formatDob(user.dob) },
          { label: "Birth time", value: user.birthTime || (user.birthTimeUnknown ? "Unknown" : "—") },
          { label: "Birth place", value: user.birthPlace || (user.birthPlaceUnknown ? "Unknown" : "—") },
          { label: "Gender", value: user.gender || "—" },
          { label: "Father's name", value: user.fatherName || "—" },
          { label: "Gotra", value: user.gotra || "—" },
          { label: "Status", value: user.accountStatus === "suspended" ? "Suspended" : "Active" },
          { label: "Joined", value: user.createdAt },
        ].map((f) => (
          <div key={f.label} className="rounded-xl border border-gold/15 bg-white/80 px-4 py-3">
            <p className="text-xs text-text-muted">{f.label}</p>
            <p className="mt-0.5 font-medium text-text-primary capitalize">{f.value}</p>
          </div>
        ))}
      </div>

      <FadeIn className="mb-8 rounded-2xl border border-gold/15 bg-white/80 p-5">
        <h2 className="mb-3 font-semibold text-text-primary">Purchase history</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-text-muted">No orders</p>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-wrap justify-between gap-2 rounded-xl bg-orange/5 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-text-primary">#{o.id}</p>
                  <p className="text-xs text-text-muted">{o.items.map((i) => i.name).join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold">₹{o.total.toLocaleString("en-IN")}</p>
                  <p className="text-xs capitalize text-text-muted">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </FadeIn>

      <FadeIn className="mb-8 rounded-2xl border border-gold/15 bg-white/80 p-5">
        <h2 className="mb-3 font-semibold text-text-primary">Payment history</h2>
        {payments.length === 0 ? (
          <p className="text-sm text-text-muted">No payments</p>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex flex-wrap justify-between gap-2 rounded-xl bg-orange/5 px-3 py-2 text-sm">
                <div>
                  <p className="font-medium text-text-primary">{p.description || p.id}</p>
                  <p className="text-xs text-text-muted">
                    {p.method?.replace("_", " ") || "—"} · {new Date(p.createdAt).toLocaleString("en-IN")}
                    {p.voucherCode ? ` · voucher ${p.voucherCode}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gold">₹{p.amount.toLocaleString("en-IN")}</p>
                  <p className="text-xs capitalize text-text-muted">{p.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </FadeIn>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <FadeIn className="rounded-2xl border border-gold/15 bg-white/80 p-5">
          <h2 className="mb-3 font-semibold text-text-primary">Vouchers assigned</h2>
          {vouchersAssigned.length === 0 ? (
            <p className="text-sm text-text-muted">None</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {vouchersAssigned.map((v) => (
                <li key={v.id} className="rounded-xl bg-orange/5 px-3 py-2">
                  <span className="font-mono font-bold text-gold">{v.code}</span> — {v.label}
                </li>
              ))}
            </ul>
          )}
        </FadeIn>
        <FadeIn className="rounded-2xl border border-gold/15 bg-white/80 p-5">
          <h2 className="mb-3 font-semibold text-text-primary">Vouchers used</h2>
          {vouchersUsed.length === 0 ? (
            <p className="text-sm text-text-muted">None</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {vouchersUsed.map((v) => (
                <li key={v.id} className="rounded-xl bg-orange/5 px-3 py-2">
                  <span className="font-mono font-bold text-gold">{v.code}</span> — used {v.usedCount}
                  {v.usageLimit ? `/${v.usageLimit}` : ""} times
                </li>
              ))}
            </ul>
          )}
        </FadeIn>
      </div>

      <FadeIn className="rounded-2xl border border-gold/15 bg-white/80 p-5">
        <h2 className="mb-1 flex items-center gap-2 font-semibold text-text-primary">
          <Link2 className="h-5 w-5 text-gold" /> Course resource links
        </h2>
        <p className="mb-4 text-xs text-text-muted">
          Send personal resource links for this user&apos;s purchased courses. They appear under Resources on
          their dashboard Courses page. You can edit or remove links anytime.
        </p>

        {(user.courseResources || []).length > 0 && (
          <div className="mb-6 space-y-3">
            {(user.courseResources || []).map((entry) => {
              const courseTitle = courses.find((c) => c.id === entry.courseId)?.title || entry.courseId;
              return (
                <div key={entry.courseId} className="rounded-xl border border-gold/10 bg-orange/5 p-3">
                  <p className="mb-2 text-sm font-semibold text-text-primary">{courseTitle}</p>
                  <ul className="space-y-2">
                    {entry.links.map((l: CourseResourceLink) => (
                      <li key={l.id}>
                        {editingLink?.linkId === l.id && editingLink.courseId === entry.courseId ? (
                          <div className="grid gap-2 rounded-lg border border-gold/20 bg-white p-2 sm:grid-cols-2">
                            <input
                              value={editingLink.label}
                              onChange={(e) =>
                                setEditingLink({ ...editingLink, label: e.target.value })
                              }
                              placeholder="Label"
                              className="rounded-lg border border-gold/20 px-2 py-1.5 text-xs"
                            />
                            <input
                              value={editingLink.url}
                              onChange={(e) =>
                                setEditingLink({ ...editingLink, url: e.target.value })
                              }
                              placeholder="URL"
                              className="rounded-lg border border-gold/20 px-2 py-1.5 text-xs"
                            />
                            <div className="flex gap-1 sm:col-span-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled={saving}
                                onClick={() => void updateResourceLink()}
                              >
                                Save
                              </Button>
                              <button
                                type="button"
                                onClick={() => setEditingLink(null)}
                                className="rounded-lg p-1.5 text-text-muted hover:bg-orange/5"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate text-gold hover:underline"
                            >
                              {l.label}: {l.url}
                            </a>
                            <div className="flex shrink-0 gap-0.5">
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                  setEditingLink({
                                    courseId: entry.courseId,
                                    linkId: l.id,
                                    label: l.label,
                                    url: l.url,
                                  })
                                }
                                className="rounded-lg p-1 text-gold hover:bg-gold/10"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() => void removeResourceLink(entry.courseId, l.id)}
                                className="rounded-lg p-1 text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs text-text-muted">Course</label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm"
            >
              <option value="">Select course…</option>
              {courseOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                  {purchasedCourseIds.has(c.id) ? " (purchased)" : ""}
                </option>
              ))}
            </select>
          </div>
          {resourceLinks.map((row, i) => (
            <div key={i} className="contents">
              <div>
                <label className="text-xs text-text-muted">Label</label>
                <input
                  value={row.label}
                  onChange={(e) => {
                    const next = [...resourceLinks];
                    next[i] = { ...next[i], label: e.target.value };
                    setResourceLinks(next);
                  }}
                  placeholder="e.g. Lecture recording"
                  className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted">URL</label>
                <input
                  value={row.url}
                  onChange={(e) => {
                    const next = [...resourceLinks];
                    next[i] = { ...next[i], url: e.target.value };
                    setResourceLinks(next);
                  }}
                  placeholder="https://…"
                  className="mt-1 w-full rounded-xl border border-gold/20 px-3 py-2 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setResourceLinks([...resourceLinks, { label: "", url: "" }])}
            className="inline-flex items-center gap-1 rounded-full border border-gold/25 px-3 py-1.5 text-xs font-semibold text-gold"
          >
            <Plus className="h-3.5 w-3.5" /> Add row
          </button>
          <Button variant="secondary" size="sm" disabled={saving} onClick={() => void saveCourseResources()}>
            {saving ? "Saving…" : "Save links"}
          </Button>
        </div>
      </FadeIn>
    </PageTransition>
  );
}
