"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { fetchJson } from "@/lib/fetch-json";
import { EditableSiteContent } from "@/lib/types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Tab = "faqs" | "reviews" | "achievements" | "problems";

export default function AdminContentPage() {
  const [content, setContent] = useState<EditableSiteContent | null>(null);
  const [tab, setTab] = useState<Tab>("faqs");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetchJson<{ content?: EditableSiteContent }>("/api/content").then((d) => {
      if (d.data?.content) setContent(d.data.content);
    });
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

  if (!content) return <p className="py-20 text-center text-text-muted">Loading...</p>;

  return (
    <PageTransition>
      <FadeIn className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Site <span className="text-gradient-gold">Content</span></h1>
          <p className="text-sm text-text-muted">Edit FAQs, reviews, achievements & problem categories</p>
        </div>
        <button onClick={save} disabled={saving} className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save all changes"}
        </button>
      </FadeIn>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["faqs", "reviews", "achievements", "problems"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${tab === t ? "bg-gold text-white" : "glass-card"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "faqs" && (
        <div className="space-y-4">
          {content.faqs.en.map((faq, i) => (
            <div key={i} className="rounded-2xl glass-card p-4 space-y-2">
              <input value={content.faqs.en[i].q} onChange={(e) => {
                const next = { ...content, faqs: { ...content.faqs, en: [...content.faqs.en] } };
                next.faqs.en[i] = { ...next.faqs.en[i], q: e.target.value };
                setContent(next);
              }} className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm font-medium" placeholder="Question (EN)" />
              <textarea value={content.faqs.en[i].a} onChange={(e) => {
                const next = { ...content, faqs: { ...content.faqs, en: [...content.faqs.en] } };
                next.faqs.en[i] = { ...next.faqs.en[i], a: e.target.value };
                setContent(next);
              }} rows={2} className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm" placeholder="Answer (EN)" />
            </div>
          ))}
        </div>
      )}

      {tab === "reviews" && (
        <div className="space-y-4">
          {content.reviews.map((r, i) => (
            <div key={r.id} className="rounded-2xl glass-card p-4 space-y-2">
              <input value={r.name} onChange={(e) => { const reviews = [...content.reviews]; reviews[i] = { ...r, name: e.target.value }; setContent({ ...content, reviews }); }} className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm" />
              <textarea value={r.comment} onChange={(e) => { const reviews = [...content.reviews]; reviews[i] = { ...r, comment: e.target.value }; setContent({ ...content, reviews }); }} rows={2} className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm" />
            </div>
          ))}
        </div>
      )}

      {tab === "achievements" && (
        <div className="space-y-4">
          {content.achievementPhotos.map((p, i) => (
            <div key={p.id} className="rounded-2xl glass-card p-4 space-y-2">
              <input value={p.title} onChange={(e) => { const achievementPhotos = [...content.achievementPhotos]; achievementPhotos[i] = { ...p, title: e.target.value }; setContent({ ...content, achievementPhotos }); }} className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm" />
              <input value={p.image} onChange={(e) => { const achievementPhotos = [...content.achievementPhotos]; achievementPhotos[i] = { ...p, image: e.target.value }; setContent({ ...content, achievementPhotos }); }} className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm" placeholder="Image path" />
            </div>
          ))}
        </div>
      )}

      {tab === "problems" && (
        <div className="space-y-4">
          {content.problemCategories.map((p, i) => (
            <div key={p.id} className="rounded-2xl glass-card p-4 space-y-2">
              <input value={p.title} onChange={(e) => { const problemCategories = [...content.problemCategories]; problemCategories[i] = { ...p, title: e.target.value }; setContent({ ...content, problemCategories }); }} className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm font-medium" />
              <textarea value={p.description} onChange={(e) => { const problemCategories = [...content.problemCategories]; problemCategories[i] = { ...p, description: e.target.value }; setContent({ ...content, problemCategories }); }} rows={2} className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm" />
            </div>
          ))}
        </div>
      )}
    </PageTransition>
  );
}
