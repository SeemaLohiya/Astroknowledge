"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { StaggerChildren, StaggerItem } from "@/components/animations/StaggerChildren";
import { QuickConsultCTA } from "@/components/home/QuickConsultCTA";
import { CategoryFilter } from "@/components/products/CategoryFilter";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageBanner } from "@/components/ui/PageBanner";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatMsg } from "@/lib/i18n/ui-strings";
import { localizedTitle } from "@/lib/i18n/site-content";
import { useIsAdmin } from "@/lib/use-is-admin";
import { useCartStore } from "@/lib/cart-store";
import { useCatalog } from "@/lib/use-catalog";
import { useCategories } from "@/lib/use-categories";
import { Product } from "@/lib/types";
import { IndianRupee, ShoppingCart, Star } from "lucide-react";
import { AnimatedCatalogImage } from "@/components/animations/AnimatedCatalogImage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import toast from "react-hot-toast";

function ProductsContent() {
  const { lang, c } = useLanguage();
  const p = c.pages.products;
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const isAdmin = useIsAdmin();
  const addItem = useCartStore((s) => s.addItem);
  const { items: products } = useCatalog<Product>("products");
  const { categories, refresh } = useCategories();

  const filtered = category ? products.filter((pr) => pr.category === category) : products;
  const activeCategory = categories.find((cat) => cat.id === category);
  const categoryLabel = activeCategory
    ? lang === "hi"
      ? activeCategory.nameHindi || activeCategory.name
      : activeCategory.name
    : p.title;

  const handleAdd = (product: Product) => {
    const name = localizedTitle(product, lang);
    addItem({ id: product.id, itemType: "product", name, price: product.price, image: product.image });
    toast.success(formatMsg(c.cart.addedToast, { name }));
  };

  return (
    <>
      <PageBanner
        title={categoryLabel}
        titleAccent={activeCategory ? undefined : p.titleAccent}
        subtitle={p.subtitle}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: p.title, href: "/products" },
          ...(activeCategory ? [{ label: categoryLabel }] : []),
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <FadeIn className="mb-8">
            <CategoryFilter categories={categories} onRefresh={refresh} />
          </FadeIn>

          {filtered.length === 0 ? (
            <EmptyState
              title="No products in this category"
              description="Try another category or browse all spiritual products."
              actionLabel={`${p.title} ${p.titleAccent}`}
              actionHref="/products"
            />
          ) : (
            <StaggerChildren className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <StaggerItem key={product.id}>
                  <div className="hover-lift-card group overflow-hidden rounded-2xl border border-gold/15 glass-card glass-card-hover">
                    <Link href={`/products/${product.id}`} className="relative block">
                      <AnimatedCatalogImage
                        src={product.image}
                        alt={localizedTitle(product, lang)}
                        sizes="(max-width:640px) 50vw, 25vw"
                        variant="contain"
                        frameClassName="h-48 bg-gradient-to-br from-orange/5 to-gold/5"
                      />
                      {product.energized && (
                        <span className="absolute left-2 top-2 z-10 rounded-full bg-gold px-2 py-1 text-[10px] text-white">
                          {c.sections.energized}
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="absolute right-2 top-2 z-10 rounded-full bg-gold px-2 py-1 text-[10px] font-bold text-white">
                          {c.sections.sale}
                        </span>
                      )}
                    </Link>
                    <div className="p-4">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-text-primary group-hover:text-gold transition-colors line-clamp-1">
                          {localizedTitle(product, lang)}
                        </h3>
                      </Link>
                      <div className="mt-2 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-gold text-gold" />
                        <span className="text-xs text-text-body">
                          {product.rating} ({product.reviews} {c.reviews})
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="flex items-center font-bold text-gold">
                            <IndianRupee className="h-4 w-4" />
                            {product.price.toLocaleString("en-IN")}
                          </span>
                          {product.originalPrice && (
                            <span className="text-xs text-text-muted line-through">
                              ₹{product.originalPrice.toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        {!isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleAdd(product)}
                            className="flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/30"
                          >
                            <ShoppingCart className="h-3 w-3" /> {c.sections.add}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          )}
        </div>
      </section>

      <QuickConsultCTA />
    </>
  );
}

export default function ProductsPage() {
  return (
    <PageTransition>
      <Suspense>
        <ProductsContent />
      </Suspense>
    </PageTransition>
  );
}
