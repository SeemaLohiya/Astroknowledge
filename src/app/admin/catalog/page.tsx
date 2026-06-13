"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { SafeImage } from "@/components/ui/SafeImage";
import { fetchJson } from "@/lib/fetch-json";
import { AchievementPhoto, CatalogType, CertificationEntry, ProductCategory } from "@/lib/types";
import { motion } from "framer-motion";
import { Award, BookOpen, FolderOpen, GraduationCap, Heart, IndianRupee, Package, Plus, Save, Sparkles, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

type AdminTab = CatalogType | "categories" | "achievements" | "certifications";

const TABS: { type: AdminTab; label: string; icon: typeof Package }[] = [
  { type: "products", label: "Products", icon: Package },
  { type: "services", label: "Services", icon: Sparkles },
  { type: "courses", label: "Courses", icon: BookOpen },
  { type: "pooja", label: "Pooja", icon: Sparkles },
  { type: "healing", label: "Healing", icon: Heart },
  { type: "categories", label: "Categories", icon: FolderOpen },
  { type: "certifications", label: "Certifications & Titles", icon: GraduationCap },
  { type: "achievements", label: "Clients & Achievements", icon: Award },
];

type CatalogItem = Record<string, unknown>;

function getTitle(item: CatalogItem) {
  return (item.title as string) || (item.name as string) || "Untitled";
}

export default function AdminCatalogPage() {
  const [activeType, setActiveType] = useState<AdminTab>("products");
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [achievementPhotos, setAchievementPhotos] = useState<AchievementPhoto[]>([]);
  const [certificationEntries, setCertificationEntries] = useState<CertificationEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<AchievementPhoto | null>(null);
  const [editingCertification, setEditingCertification] = useState<CertificationEntry | null>(null);
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    const res = await fetchJson<{ categories?: ProductCategory[] }>("/api/categories");
    setCategories(res.data?.categories || []);
  }, []);

  const loadItems = useCallback(async (type: CatalogType) => {
    setLoading(true);
    try {
      const res = await fetchJson<{ items?: CatalogItem[] }>(`/api/catalog/${type}`);
      setItems(res.data?.items || []);
    } catch {
      toast.error("Failed to load catalog");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAchievements = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchJson<{ items?: AchievementPhoto[] }>("/api/content/achievement-photos");
      setAchievementPhotos(res.data?.items || []);
    } catch {
      toast.error("Failed to load achievement photos");
      setAchievementPhotos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCertifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchJson<{ items?: CertificationEntry[] }>("/api/content/certifications");
      setCertificationEntries(res.data?.items || []);
    } catch {
      toast.error("Failed to load certifications");
      setCertificationEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    setEditing(null);
    setEditingCategory(null);
    setEditingAchievement(null);
    setEditingCertification(null);
    if (activeType === "categories") {
      setLoading(true);
      loadCategories().finally(() => setLoading(false));
    } else if (activeType === "achievements") {
      void loadAchievements();
    } else if (activeType === "certifications") {
      void loadCertifications();
    } else {
      loadItems(activeType);
    }
  }, [activeType, loadItems, loadCategories, loadAchievements, loadCertifications]);

  const handleAdd = () => {
    const defaults: CatalogItem =
      activeType === "products"
        ? { id: `p-${Date.now()}`, name: "", nameHindi: "", description: "", price: 0, category: categories[0]?.id || "rudraksha", image: "/images/products/p1.jpg", rating: 4.5, reviews: 0, inStock: true, energized: true }
        : activeType === "pooja"
          ? { id: `pu-${Date.now()}`, title: "", titleHindi: "", description: "", price: 0, duration: "", benefits: [], image: "/images/astro/pooja.jpg" }
          : activeType === "healing"
            ? { id: `heal-${Date.now()}`, title: "", titleHindi: "", description: "", price: 0, duration: "", benefits: [], image: "/images/healing/reiki.jpg" }
            : {
              id: `${activeType}-${Date.now()}`,
              title: "",
              titleHindi: "",
              description: "",
              ...(activeType === "courses" ? { sessionDescription: "" } : {}),
              price: 0,
              duration: "",
              features: [],
              image: "/images/astro/kundali.jpg",
              popular: false,
            };
    setEditing(defaults);
  };

  const handleAddCategory = () => {
    setEditingCategory({ id: "", name: "", nameHindi: "", icon: "", description: "", image: "/images/products/p1.jpg" });
  };

  const handleAddAchievement = () => {
    setEditingAchievement({
      id: `ach-${Date.now()}`,
      image: "",
      title: "",
      titleHindi: "",
      alt: "",
      description: "",
    });
  };

  const handleSaveAchievement = async () => {
    if (!editingAchievement) return;
    setSaving(true);
    try {
      const isNew = !achievementPhotos.some((p) => p.id === editingAchievement.id);
      const res = await fetch(
        isNew ? "/api/content/achievement-photos" : `/api/content/achievement-photos/${editingAchievement.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingAchievement),
        }
      );
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Photo added" : "Photo updated");
      setEditingAchievement(null);
      await loadAchievements();
    } catch {
      toast.error("Failed to save photo");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (!confirm("Delete this achievement photo?")) return;
    try {
      const res = await fetch(`/api/content/achievement-photos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Photo deleted");
      if (editingAchievement?.id === id) setEditingAchievement(null);
      await loadAchievements();
    } catch {
      toast.error("Failed to delete photo");
    }
  };

  const handleAddCertification = () => {
    setEditingCertification({
      id: `cert-${Date.now()}`,
      title: "",
      titleHindi: "",
      subtitle: "",
    });
  };

  const handleSaveCertification = async () => {
    if (!editingCertification) return;
    setSaving(true);
    try {
      const isNew = !certificationEntries.some((c) => c.id === editingCertification.id);
      const res = await fetch(
        isNew ? "/api/content/certifications" : `/api/content/certifications/${editingCertification.id}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingCertification),
        }
      );
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Certification added" : "Certification updated");
      setEditingCertification(null);
      await loadCertifications();
    } catch {
      toast.error("Failed to save certification");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCertification = async (id: string) => {
    if (!confirm("Delete this certification?")) return;
    try {
      const res = await fetch(`/api/content/certifications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Certification deleted");
      if (editingCertification?.id === id) setEditingCertification(null);
      await loadCertifications();
    } catch {
      toast.error("Failed to delete certification");
    }
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !items.some((i) => i.id === editing.id);
      const payload = { ...editing };
      if ((activeType === "pooja" || activeType === "healing") && typeof payload.benefits === "string") {
        payload.benefits = (payload.benefits as string).split(",").map((s) => s.trim()).filter(Boolean);
      }
      if ((activeType === "services" || activeType === "courses") && typeof payload.features === "string") {
        payload.features = (payload.features as string).split(",").map((s) => s.trim()).filter(Boolean);
      }
      if (activeType === "products") {
        payload.price = Number(payload.price);
        payload.rating = Number(payload.rating);
        payload.reviews = Number(payload.reviews);
      } else {
        payload.price = Number(payload.price);
      }

      const res = await fetch(
        isNew ? `/api/catalog/${activeType}` : `/api/catalog/${activeType}/${editing.id}`,
        { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
      );
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Item added" : "Item updated");
      setEditing(null);
      loadItems(activeType as CatalogType);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!editingCategory) return;
    setSaving(true);
    try {
      const isNew = !categories.some((c) => c.id === editingCategory.id);
      const res = await fetch(
        isNew ? "/api/categories" : `/api/categories/${editingCategory.id}`,
        { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingCategory) }
      );
      if (!res.ok) throw new Error();
      toast.success(isNew ? "Category added" : "Category updated");
      setEditingCategory(null);
      loadCategories();
    } catch {
      toast.error("Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/catalog/${activeType}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Item deleted");
      if (editing?.id === id) setEditing(null);
      loadItems(activeType as CatalogType);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Delete this category? Products using it will remain but won't match any filter.")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Category deleted");
      if (editingCategory?.id === id) setEditingCategory(null);
      loadCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const setField = (key: string, value: unknown) => {
    setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const listField = (key: string) => {
    const val = editing?.[key];
    return Array.isArray(val) ? val.join(", ") : (val as string) || "";
  };

  const isCategoriesTab = activeType === "categories";
  const isAchievementsTab = activeType === "achievements";
  const isCertificationsTab = activeType === "certifications";

  return (
    <PageTransition>
      <FadeIn className="mb-6">
        <h1 className="font-display text-2xl font-bold text-text-primary">Catalog <span className="text-gradient-gold">Manager</span></h1>
        <p className="text-text-body text-sm mt-1">Add, edit, or remove products, services, courses, pooja, healing, categories, certifications, and client achievement photos</p>
      </FadeIn>

      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.type}
            onClick={() => setActiveType(tab.type)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${activeType === tab.type ? "bg-gold text-white tab-pill-active shadow-gold/30 shadow-md" : "glass-card text-text-body hover:text-gold hover:scale-[1.02]"}`}
          >
            <tab.icon className="h-4 w-4" />{tab.label}
          </button>
        ))}
      </div>

      {isCategoriesTab ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <div className="rounded-2xl glass-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-text-primary">Product Categories ({categories.length})</h2>
                <button onClick={handleAddCategory} className="flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-white hover:bg-gold-bright">
                  <Plus className="h-3.5 w-3.5" /> Add Category
                </button>
              </div>
              {loading ? (
                <p className="text-text-muted text-sm py-8 text-center">Loading...</p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {categories.map((cat) => (
                    <motion.div
                      key={cat.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${editingCategory?.id === cat.id ? "border-gold bg-gold/5" : "border-gold/10 hover:border-gold/30"}`}
                      onClick={() => setEditingCategory({ ...cat })}
                      whileHover={{ x: 2 }}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-gold/15">
                        <SafeImage src={cat.image || "/images/products/p1.jpg"} alt={cat.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary text-sm">{cat.name}</p>
                        <p className="text-xs text-gold">{cat.nameHindi}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl glass-card p-6">
              {editingCategory ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-text-primary">Edit Category</h2>
                    <button onClick={() => setEditingCategory(null)} className="p-1 text-text-muted hover:text-gold"><X className="h-5 w-5" /></button>
                  </div>
                  <ImageUploadField
                    value={editingCategory.image || ""}
                    onChange={(url) => setEditingCategory({ ...editingCategory, image: url })}
                    label="Category Image"
                  />
                  <div className="space-y-3 mt-4">
                    <Field label="ID (slug)" value={editingCategory.id} onChange={(v) => setEditingCategory({ ...editingCategory, id: v })} />
                    <Field label="Name" value={editingCategory.name} onChange={(v) => setEditingCategory({ ...editingCategory, name: v })} />
                    <Field label="Name (Hindi)" value={editingCategory.nameHindi} onChange={(v) => setEditingCategory({ ...editingCategory, nameHindi: v })} />
                    <Field label="Description" value={editingCategory.description} onChange={(v) => setEditingCategory({ ...editingCategory, description: v })} textarea />
                  </div>
                  <button onClick={handleSaveCategory} disabled={saving} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-bold text-white hover:bg-gold-bright disabled:opacity-50">
                    <Save className="h-4 w-4" />{saving ? "Saving..." : "Save Category"}
                  </button>
                </>
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center text-text-muted text-sm">
                  Select a category to edit or click Add Category
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      ) : isCertificationsTab ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <div className="rounded-2xl glass-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-text-primary">Certifications & Titles ({certificationEntries.length})</h2>
                <button onClick={handleAddCertification} className="flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-white hover:bg-gold-bright">
                  <Plus className="h-3.5 w-3.5" /> Add Title
                </button>
              </div>
              {loading ? (
                <p className="text-text-muted text-sm py-8 text-center">Loading...</p>
              ) : certificationEntries.length === 0 ? (
                <p className="text-text-muted text-sm py-8 text-center">No certifications yet. Click Add Title.</p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {certificationEntries.map((cert) => (
                    <motion.div
                      key={cert.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${editingCertification?.id === cert.id ? "border-gold bg-gold/5" : "border-gold/10 hover:border-gold/30"}`}
                      onClick={() => setEditingCertification({ ...cert })}
                      whileHover={{ x: 2 }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gold/20 bg-gold/10">
                        <GraduationCap className="h-5 w-5 text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary text-sm truncate">{cert.title}</p>
                        {cert.titleHindi ? <p className="text-xs text-gold truncate">{cert.titleHindi}</p> : null}
                        {cert.subtitle ? <p className="text-[11px] text-text-muted truncate mt-0.5">{cert.subtitle}</p> : null}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteCertification(cert.id); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl glass-card p-6">
              {editingCertification ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-text-primary">Edit Certification</h2>
                    <button onClick={() => setEditingCertification(null)} className="p-1 text-text-muted hover:text-gold"><X className="h-5 w-5" /></button>
                  </div>
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                    <Field label="ID" value={editingCertification.id} onChange={(v) => setEditingCertification({ ...editingCertification, id: v })} hint="Unique identifier — change only when creating a new entry" />
                    <Field label="Title (English)" value={editingCertification.title} onChange={(v) => setEditingCertification({ ...editingCertification, title: v })} />
                    <Field label="Title (Hindi)" value={editingCertification.titleHindi || ""} onChange={(v) => setEditingCertification({ ...editingCertification, titleHindi: v })} />
                    <Field label="Description / Subtitle" value={editingCertification.subtitle || ""} onChange={(v) => setEditingCertification({ ...editingCertification, subtitle: v })} textarea rows={3} hint="Shown below the title on the About page Certifications section" />
                  </div>
                  <button onClick={handleSaveCertification} disabled={saving} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-bold text-white hover:bg-gold-bright disabled:opacity-50">
                    <Save className="h-4 w-4" />{saving ? "Saving..." : "Save Certification"}
                  </button>
                </>
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center text-text-muted text-sm">
                  Select a certification to edit or click Add Title
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      ) : isAchievementsTab ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <div className="rounded-2xl glass-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-text-primary">Clients & Achievements ({achievementPhotos.length})</h2>
                <button onClick={handleAddAchievement} className="flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-white hover:bg-gold-bright">
                  <Plus className="h-3.5 w-3.5" /> Add Photo
                </button>
              </div>
              {loading ? (
                <p className="text-text-muted text-sm py-8 text-center">Loading...</p>
              ) : achievementPhotos.length === 0 ? (
                <p className="text-text-muted text-sm py-8 text-center">No photos yet. Click Add Photo.</p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {achievementPhotos.map((photo) => (
                    <motion.div
                      key={photo.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${editingAchievement?.id === photo.id ? "border-gold bg-gold/5" : "border-gold/10 hover:border-gold/30"}`}
                      onClick={() => setEditingAchievement({ ...photo })}
                      whileHover={{ x: 2 }}
                    >
                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-gold/15">
                        <SafeImage src={photo.image || "/images/products/p1.jpg"} alt={photo.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary text-sm truncate">{photo.title}</p>
                        <p className="text-xs text-gold truncate">{photo.titleHindi}</p>
                        {photo.description ? <p className="text-[11px] text-text-muted truncate mt-0.5">{photo.description}</p> : null}
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteAchievement(photo.id); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl glass-card p-6">
              {editingAchievement ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-text-primary">Edit Achievement Photo</h2>
                    <button onClick={() => setEditingAchievement(null)} className="p-1 text-text-muted hover:text-gold"><X className="h-5 w-5" /></button>
                  </div>
                  <ImageUploadField
                    value={editingAchievement.image || ""}
                    onChange={(url) => setEditingAchievement({ ...editingAchievement, image: url })}
                    label="Event Photo"
                  />
                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 mt-4">
                    <Field label="ID" value={editingAchievement.id} onChange={(v) => setEditingAchievement({ ...editingAchievement, id: v })} hint="Unique identifier — change only when creating a new photo" />
                    <Field label="Title (English)" value={editingAchievement.title} onChange={(v) => setEditingAchievement({ ...editingAchievement, title: v })} />
                    <Field label="Title (Hindi)" value={editingAchievement.titleHindi} onChange={(v) => setEditingAchievement({ ...editingAchievement, titleHindi: v })} />
                    <Field label="Description" value={editingAchievement.description || ""} onChange={(v) => setEditingAchievement({ ...editingAchievement, description: v })} textarea rows={3} hint="Short caption shown under the photo on Home and About pages" />
                    <Field label="Alt Text" value={editingAchievement.alt} onChange={(v) => setEditingAchievement({ ...editingAchievement, alt: v })} textarea rows={2} hint="Accessibility description for screen readers" />
                  </div>
                  <button onClick={handleSaveAchievement} disabled={saving} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-bold text-white hover:bg-gold-bright disabled:opacity-50">
                    <Save className="h-4 w-4" />{saving ? "Saving..." : "Save Photo"}
                  </button>
                </>
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center text-text-muted text-sm">
                  Select a photo to edit or click Add Photo
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <FadeIn>
            <div className="rounded-2xl glass-card p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-text-primary capitalize">{activeType} ({items.length})</h2>
                <button onClick={handleAdd} className="flex items-center gap-1 rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-white hover:bg-gold-bright">
                  <Plus className="h-3.5 w-3.5" /> Add New
                </button>
              </div>

              {loading ? (
                <p className="text-text-muted text-sm py-8 text-center">Loading...</p>
              ) : items.length === 0 ? (
                <p className="text-text-muted text-sm py-8 text-center">No items yet. Click Add New.</p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {items.map((item) => (
                    <motion.div
                      key={item.id as string}
                      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${editing?.id === item.id ? "border-gold bg-gold/5" : "border-gold/10 hover:border-gold/30"}`}
                      onClick={() => setEditing({ ...item, benefits: item.benefits, features: item.features })}
                      whileHover={{ x: 2 }}
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        <SafeImage src={(item.image as string) || "/images/products/p1.jpg"} alt={getTitle(item)} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary text-sm truncate">{getTitle(item)}</p>
                        <p className="text-xs text-gold flex items-center gap-0.5"><IndianRupee className="h-3 w-3" />{Number(item.price).toLocaleString("en-IN")}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id as string); }} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg" aria-label="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl glass-card p-6">
              {editing ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-text-primary">Edit Item</h2>
                    <button onClick={() => setEditing(null)} className="p-1 text-text-muted hover:text-gold"><X className="h-5 w-5" /></button>
                  </div>

                  <ImageUploadField
                    value={(editing.image as string) || ""}
                    onChange={(url) => setField("image", url)}
                    label="Item Image"
                  />

                  <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 mt-4">
                    {activeType === "products" ? (
                      <>
                        <Field label="Name" value={editing.name as string} onChange={(v) => setField("name", v)} />
                        <Field label="Name (Hindi)" value={editing.nameHindi as string} onChange={(v) => setField("nameHindi", v)} />
                        <div>
                          <label className="mb-1 block text-xs text-text-muted">Category</label>
                          <select
                            value={(editing.category as string) || ""}
                            onChange={(e) => setField("category", e.target.value)}
                            className="w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm text-text-primary focus:border-gold focus:outline-none"
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <Field label="Title" value={editing.title as string} onChange={(v) => setField("title", v)} />
                        <Field label="Title (Hindi)" value={editing.titleHindi as string} onChange={(v) => setField("titleHindi", v)} />
                        <Field label="Duration" value={editing.duration as string} onChange={(v) => setField("duration", v)} />
                      </>
                    )}
                    <Field label="Short Description" value={editing.description as string} onChange={(v) => setField("description", v)} textarea rows={3} hint="Brief summary shown on course cards" />
                    {activeType === "courses" && (
                      <Field
                        label="Detailed Session Description"
                        value={(editing.sessionDescription as string) || ""}
                        onChange={(v) => setField("sessionDescription", v)}
                        textarea
                        rows={14}
                        hint="Full session-by-session breakdown — topics, modules, outcomes, and what students learn"
                      />
                    )}
                    <Field label="Price (₹)" value={String(editing.price ?? "")} onChange={(v) => setField("price", v)} type="number" />
                    {activeType === "products" && (
                      <>
                        <Field label="Rating" value={String(editing.rating ?? "")} onChange={(v) => setField("rating", v)} type="number" />
                        <Field label="Review Count" value={String(editing.reviews ?? "")} onChange={(v) => setField("reviews", v)} type="number" />
                        <label className="flex items-center gap-2 text-sm text-text-body">
                          <input type="checkbox" checked={!!editing.inStock} onChange={(e) => setField("inStock", e.target.checked)} /> In Stock
                        </label>
                        <label className="flex items-center gap-2 text-sm text-text-body">
                          <input type="checkbox" checked={!!editing.energized} onChange={(e) => setField("energized", e.target.checked)} /> Energized
                        </label>
                      </>
                    )}
                    {(activeType === "pooja" || activeType === "healing") && (
                      <Field label="Benefits (comma-separated)" value={listField("benefits")} onChange={(v) => setField("benefits", v)} />
                    )}
                    {(activeType === "services" || activeType === "courses") && (
                      <>
                        <Field label="Features (comma-separated)" value={listField("features")} onChange={(v) => setField("features", v)} />
                        <label className="flex items-center gap-2 text-sm text-text-body">
                          <input type="checkbox" checked={!!editing.popular} onChange={(e) => setField("popular", e.target.checked)} /> Popular
                        </label>
                      </>
                    )}
                  </div>

                  <button onClick={handleSave} disabled={saving} className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-bold text-white hover:bg-gold-bright disabled:opacity-50">
                    <Save className="h-4 w-4" />{saving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <div className="flex h-full min-h-[300px] items-center justify-center text-text-muted text-sm">
                  Select an item to edit or click Add New
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      )}
    </PageTransition>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  type = "text",
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
  rows?: number;
  hint?: string;
}) {
  const cls = "w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm text-text-primary focus:border-gold focus:outline-none";
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-text-primary">{label}</label>
      {hint && <p className="mb-1.5 text-[11px] text-text-muted">{hint}</p>}
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={`${cls} resize-y min-h-[80px]`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}
