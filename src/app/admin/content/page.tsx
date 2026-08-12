"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { fetchJson } from "@/lib/fetch-json";
import { Advertisement, EditableSiteContent } from "@/lib/types";
import { Megaphone, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Tab = "faqs" | "reviews" | "problems" | "advertisements";

const BADGE_PRESETS = ["New Update", "Advertisement", "Special Offer", "Announcement", "Event"];

const emptyAd = (): Advertisement => ({
  id: `ad-${Date.now()}`,
  title: "",
  titleHindi: "",
  image: "",
  link: "",
  badge: "New Update",
  active: true,
  order: 0,
});

export default function AdminContentPage() {
  const [content, setContent] = useState<EditableSiteContent | null>(null);
  const [tab, setTab] = useState<Tab>("faqs");
  const [saving, setSaving] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);
  const [adSaving, setAdSaving] = useState(false);

  const load = () => {
    void fetchJson<{ content?: EditableSiteContent }>("/api/content").then((d) => {
      if (d.data?.content) setContent(d.data.content);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error();
      toast.success("Content saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveAd = async () => {
    if (!editingAd) return;
    if (!editingAd.title.trim() || !editingAd.image.trim()) {
      toast.error("Title and image are required");
      return;
    }
    setAdSaving(true);
    try {
      const payload = {
        ...editingAd,
        link: editingAd.link?.trim() || undefined,
        badge: editingAd.badge?.trim() || "Update",
      };
      const isNew = !(content?.advertisements ?? []).some((a) => a.id === editingAd.id);
      const res = await fetch(
        isNew ? "/api/content/advertisements" : `/api/content/advertisements/${editingAd.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Advertisement added" : "Advertisement updated");
      setEditingAd(null);
      load();
    } catch {
      toast.error("Failed to save advertisement");
    } finally {
      setAdSaving(false);
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm("Delete this advertisement?")) return;
    try {
      const res = await fetch(`/api/content/advertisements/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (!content) return <p className="py-20 text-center text-text-muted">Loading...</p>;

  const ads = content.advertisements ?? [];

  return (
    <PageTransition>
      <FadeIn className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Site <span className="text-gradient-gold">Content</span>
          </h1>
          <p className="text-sm text-text-muted">
            Edit FAQs, reviews, homepage advertisements & problem categories.
          </p>
        </div>
        {tab !== "advertisements" && (
          <button onClick={save} disabled={saving} className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save all changes"}
          </button>
        )}
      </FadeIn>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["faqs", "reviews", "problems", "advertisements"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${tab === t ? "bg-gold text-white" : "glass-card"}`}
          >
            {t === "advertisements" ? "Advertisements" : t}
          </button>
        ))}
      </div>

      {tab === "faqs" && (
        <div className="space-y-4">
          {content.faqs.en.map((faq, i) => (
            <div key={i} className="rounded-2xl glass-card p-4 space-y-2">
              <input
                value={content.faqs.en[i].q}
                onChange={(e) => {
                  const next = { ...content, faqs: { ...content.faqs, en: [...content.faqs.en] } };
                  next.faqs.en[i] = { ...next.faqs.en[i], q: e.target.value };
                  setContent(next);
                }}
                className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm font-medium"
                placeholder="Question (EN)"
              />
              <textarea
                value={content.faqs.en[i].a}
                onChange={(e) => {
                  const next = { ...content, faqs: { ...content.faqs, en: [...content.faqs.en] } };
                  next.faqs.en[i] = { ...next.faqs.en[i], a: e.target.value };
                  setContent(next);
                }}
                rows={2}
                className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm"
                placeholder="Answer (EN)"
              />
            </div>
          ))}
        </div>
      )}

      {tab === "reviews" && (
        <div className="space-y-4">
          {content.reviews.map((r, i) => (
            <div key={r.id} className="rounded-2xl glass-card p-4 space-y-2">
              <input
                value={r.name}
                onChange={(e) => {
                  const reviews = [...content.reviews];
                  reviews[i] = { ...r, name: e.target.value };
                  setContent({ ...content, reviews });
                }}
                className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm"
              />
              <textarea
                value={r.comment}
                onChange={(e) => {
                  const reviews = [...content.reviews];
                  reviews[i] = { ...r, comment: e.target.value };
                  setContent({ ...content, reviews });
                }}
                rows={2}
                className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      )}

      {tab === "problems" && (
        <div className="space-y-4">
          {content.problemCategories.map((p, i) => (
            <div key={p.id} className="rounded-2xl glass-card p-4 space-y-2">
              <input
                value={p.title}
                onChange={(e) => {
                  const problemCategories = [...content.problemCategories];
                  problemCategories[i] = { ...p, title: e.target.value };
                  setContent({ ...content, problemCategories });
                }}
                className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm font-medium"
              />
              <textarea
                value={p.description}
                onChange={(e) => {
                  const problemCategories = [...content.problemCategories];
                  problemCategories[i] = { ...p, description: e.target.value };
                  setContent({ ...content, problemCategories });
                }}
                rows={2}
                className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      )}

      {tab === "advertisements" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-muted flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-gold" />
              Manage homepage announcement cards with images, titles and badges.
            </p>
            <button
              type="button"
              onClick={() => setEditingAd({ ...emptyAd(), order: ads.length })}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-white"
            >
              <Plus className="h-4 w-4" /> Add advertisement
            </button>
          </div>

          {editingAd && (
            <div className="rounded-2xl border border-gold/25 bg-white/80 glass-card p-6 space-y-4">
              <h3 className="font-semibold text-text-primary">{ads.some((a) => a.id === editingAd.id) ? "Edit" : "New"} advertisement</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  placeholder="Title (English) *"
                  value={editingAd.title}
                  onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                  className="rounded-lg border border-gold/20 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Title (Hindi)"
                  value={editingAd.titleHindi || ""}
                  onChange={(e) => setEditingAd({ ...editingAd, titleHindi: e.target.value })}
                  className="rounded-lg border border-gold/20 px-3 py-2 text-sm"
                />
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs text-text-muted">Link (optional)</label>
                  <div className="flex gap-2">
                    <input
                      placeholder="/courses or https://..."
                      value={editingAd.link || ""}
                      onChange={(e) => setEditingAd({ ...editingAd, link: e.target.value })}
                      className="flex-1 rounded-lg border border-gold/20 px-3 py-2 text-sm"
                    />
                    {editingAd.link ? (
                      <button
                        type="button"
                        onClick={() => setEditingAd({ ...editingAd, link: "" })}
                        className="shrink-0 rounded-lg border border-gold/25 px-3 py-2 text-xs font-semibold text-gold"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Badge label (custom)</label>
                  <input
                    list="ad-badge-suggestions"
                    placeholder="e.g. New Update, Offer, Event..."
                    value={editingAd.badge || ""}
                    onChange={(e) => setEditingAd({ ...editingAd, badge: e.target.value })}
                    className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm"
                  />
                  <datalist id="ad-badge-suggestions">
                    {BADGE_PRESETS.map((b) => (
                      <option key={b} value={b} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-text-muted">Display order</label>
                  <input
                    type="number"
                    value={editingAd.order}
                    onChange={(e) => setEditingAd({ ...editingAd, order: Number(e.target.value) })}
                    className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editingAd.active}
                  onChange={(e) => setEditingAd({ ...editingAd, active: e.target.checked })}
                />
                Show on homepage
              </label>
              <ImageUploadField
                label="Advertisement image *"
                value={editingAd.image}
                onChange={(url) => setEditingAd({ ...editingAd, image: url })}
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void saveAd()}
                  disabled={adSaving}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-white disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {adSaving ? "Saving..." : "Save advertisement"}
                </button>
                <button type="button" onClick={() => setEditingAd(null)} className="rounded-full border border-gold/30 px-5 py-2 text-sm font-semibold text-gold">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ads.map((ad) => (
              <div key={ad.id} className="rounded-2xl glass-card overflow-hidden">
                <div className="relative aspect-video bg-cream">
                  {ad.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ad.image} alt={ad.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-text-muted">No image</div>
                  )}
                  <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">
                    {ad.badge}
                  </span>
                  {!ad.active && (
                    <span className="absolute right-2 top-2 rounded-full bg-red-500/80 px-2 py-0.5 text-[10px] font-bold text-white">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-text-primary">{ad.title}</p>
                  {ad.titleHindi && <p className="text-xs text-text-muted">{ad.titleHindi}</p>}
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingAd(ad)}
                      className="rounded-lg border border-gold/25 px-3 py-1 text-xs font-semibold text-gold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteAd(ad.id)}
                      className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!ads.length && !editingAd && (
            <p className="rounded-2xl border border-dashed border-gold/30 py-12 text-center text-sm text-text-muted">
              No advertisements yet. Click &quot;Add advertisement&quot; to create one.
            </p>
          )}
        </div>
      )}
    </PageTransition>
  );
}
