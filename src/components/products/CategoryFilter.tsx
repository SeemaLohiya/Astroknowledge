"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { fetchJson } from "@/lib/fetch-json";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { ProductCategory } from "@/lib/types";
import { FolderPlus, Plus, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CategoryFilterProps {
  categories: ProductCategory[];
  onRefresh: () => void;
}

export function CategoryFilter({ categories, onRefresh }: CategoryFilterProps) {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const [adminMode, setAdminMode] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", nameHindi: "", image: "/images/products/p1.jpg" });

  useEffect(() => {
    void fetchJson<{ user?: { role: string } | null }>("/api/auth/me").then((d) => {
      setAdminMode(d.data?.user?.role === "admin");
    });
  }, []);

  const handleAdd = async () => {
    if (!newCat.name.trim()) return;
    const id = newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCat, id, icon: "", description: newCat.name }),
    });
    if (!res.ok) { toast.error("Failed to add category"); return; }
    toast.success("Category added");
    setNewCat({ name: "", nameHindi: "", image: "/images/products/p1.jpg" });
    setShowAdd(false);
    onRefresh();
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this category?")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to remove"); return; }
    toast.success("Category removed");
    if (category === id) router.push("/products");
    onRefresh();
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <Link
          href="/products"
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            !category ? "bg-gold text-white shadow-md" : "glass-card text-text-body hover:text-gold hover:border-gold/40"
          }`}
        >
          {t("allCategories")}
        </Link>
        {categories.map((cat) => (
          <div key={cat.id} className="relative inline-flex">
            <Link
              href={`/products?category=${cat.id}`}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                category === cat.id ? "bg-gold text-white shadow-md" : "glass-card text-text-body hover:text-gold hover:border-gold/40"
              }`}
            >
              <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full">
                <SafeImage src={cat.image || "/images/products/p1.jpg"} alt="" fill className="object-cover" />
              </span>
              {lang === "hi" ? cat.nameHindi || cat.name : cat.name}
            </Link>
            {adminMode && (
              <button
                onClick={() => handleRemove(cat.id)}
                className="absolute -right-1 -top-1 rounded-full bg-red-500 p-0.5 text-white shadow"
                aria-label="Remove category"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {adminMode && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {showAdd ? (
            <div className="w-full max-w-md rounded-2xl glass-card p-4 space-y-2">
              <input value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} placeholder="Category name" className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm" />
              <input value={newCat.nameHindi} onChange={(e) => setNewCat({ ...newCat, nameHindi: e.target.value })} placeholder="Name (Hindi)" className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm" />
              <div className="flex gap-2">
                <button onClick={handleAdd} className="flex-1 rounded-lg bg-gold py-2 text-xs font-bold text-white">{t("addCategory")}</button>
                <button onClick={() => setShowAdd(false)} className="p-2 text-text-muted"><X className="h-4 w-4" /></button>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-4 py-2 text-xs text-gold hover:bg-gold/10">
                <Plus className="h-3.5 w-3.5" /> {t("addCategory")}
              </button>
              <Link href="/admin/catalog" className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 px-4 py-2 text-xs text-text-muted hover:text-gold">
                <FolderPlus className="h-3.5 w-3.5" /> {t("manageCategories")}
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
