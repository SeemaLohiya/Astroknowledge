"use client";

import { FadeIn } from "@/components/animations/FadeIn";
import { PageTransition } from "@/components/animations/PageTransition";
import { CatalogActions } from "@/components/cart/CatalogActions";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { localizedDesc, localizedTitle } from "@/lib/i18n/site-content";
import { useCatalog } from "@/lib/use-catalog";
import { Product } from "@/lib/types";
import { ArrowLeft, IndianRupee, Shield, Sparkles, Star, Truck } from "lucide-react";
import { AnimatedCatalogImage } from "@/components/animations/AnimatedCatalogImage";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductDetailPage() {
  const { lang, c } = useLanguage();
  const p = c.pages.products;
  const { id } = useParams();
  const { items: products, loading } = useCatalog<Product>("products");
  const product = products.find((pr) => pr.id === id);

  if (loading) {
    return <div className="py-20 text-center text-text-muted">{p.loading}</div>;
  }

  if (!product) {
    return <div className="py-20 text-center text-text-primary">{p.notFound}</div>;
  }

  const badges = [
    { icon: Shield, t: c.sections.certified },
    { icon: Sparkles, t: c.sections.energized },
    { icon: Truck, t: c.sections.deliveryAvailable },
  ];

  return (
    <PageTransition>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <Link href="/products" className="mb-8 inline-flex items-center gap-2 text-sm text-gold hover:underline">
            <ArrowLeft className="h-4 w-4" /> {p.backLink}
          </Link>

          <FadeIn>
            <div className="grid gap-10 lg:grid-cols-2">
              <AnimatedCatalogImage
                src={product.image}
                alt={localizedTitle(product, lang)}
                frameClassName="aspect-square rounded-2xl glass-card"
                priority
              />
              <div>
                <h1 className="font-display text-3xl font-bold text-text-primary">{localizedTitle(product, lang)}</h1>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span className="text-text-body">{product.rating} ({product.reviews} {c.reviews})</span>
                </div>
                <p className="mt-4 whitespace-pre-line text-text-body leading-relaxed">{localizedDesc(product, lang)}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {badges.map((b) => (
                    <span key={b.t} className="flex items-center gap-1 rounded-full border border-gold/20 px-3 py-1 text-xs text-gold">
                      <b.icon className="h-3 w-3" />{b.t}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <span className="flex items-center text-3xl font-bold text-gold"><IndianRupee className="h-7 w-7" />{product.price.toLocaleString("en-IN")}</span>
                  {product.originalPrice && <span className="text-lg text-text-muted line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>}
                </div>
                <CatalogActions
                  id={product.id}
                  itemType="product"
                  name={localizedTitle(product, lang)}
                  price={product.price}
                  image={product.image}
                  className="mt-8"
                  fullWidth={false}
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
