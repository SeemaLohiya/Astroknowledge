"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { fetchJson } from "@/lib/fetch-json";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { User } from "@/lib/types";
import { Download, Search, User as UserIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type SafeUser = Omit<User, "password">;

const EXPORT_FORMATS = [
  { format: "csv", label: "CSV" },
  { format: "xlsx", label: "Excel" },
  { format: "json", label: "JSON" },
  { format: "html", label: "HTML (Word/PDF)" },
] as const;

export default function AdminUsersPage() {
  const { c } = useLanguage();
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ role: "user" });
    if (search) params.set("search", search);
    const res = await fetchJson<{ users?: SafeUser[] }>(`/api/users?${params}`, { cache: "no-store" });
    setUsers(res.data?.users || []);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const downloadData = async (format: string) => {
    setDownloading(format);
    try {
      const res = await fetch(`/api/admin/users/export?format=${format}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const ext = format === "html" ? "html" : format === "json" ? "json" : format === "xlsx" ? "xlsx" : "csv";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `astroknowledge-users.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded ${format.toUpperCase()} file`);
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <PageTransition>
      <FadeIn className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-text-primary">{c.admin.usersTitle}</h1>
            <p className="text-sm text-text-body mt-1">Registered customers — download full data anytime</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXPORT_FORMATS.map(({ format, label }) => (
              <button
                key={format}
                type="button"
                onClick={() => downloadData(format)}
                disabled={!!downloading}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-2 text-xs font-semibold text-gold hover:bg-gold/20 disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                {downloading === format ? "..." : label}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full rounded-xl border border-gold/20 bg-orange/5 pl-9 pr-3 py-2.5 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-text-muted text-center py-8">{c.common.loading}</p>
      ) : users.length === 0 ? (
        <p className="text-text-muted text-center py-8">{c.admin.noResults}</p>
      ) : (
        <div className="rounded-2xl glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-gold/15 bg-orange/5 text-left text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">DOB</th>
                  <th className="px-4 py-3 font-semibold">Birth Place</th>
                  <th className="px-4 py-3 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gold/10 hover:bg-orange/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange/15">
                          <UserIcon className="h-4 w-4 text-gold" />
                        </div>
                        <span className="font-medium text-text-primary">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-body">{u.email}</td>
                    <td className="px-4 py-3 text-text-body">{u.phone || "—"}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">{u.dobUnknown ? "Unknown" : u.dob || "—"}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">{u.birthPlaceUnknown ? "Unknown" : u.birthPlace || "—"}</td>
                    <td className="px-4 py-3 text-text-muted text-xs">{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-gold/10 px-4 py-2 text-xs text-text-muted">
            {users.length} customer{users.length !== 1 ? "s" : ""} · Use download buttons for full export with addresses, orders & payments
          </p>
        </div>
      )}
    </PageTransition>
  );
}
