import type { Metadata } from "next";
import { products } from "@/lib/data/products";
import { SITE } from "@/lib/constants";
import { SchemaScript } from "@/components/seo/SchemaScript";
import { pageMetadata, productJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return pageMetadata({
      title: `Spiritual Products | ${SITE.name}`,
      description: `Shop authentic spiritual products, Rudraksha, yantras and Vedic remedies at ${SITE.name}, Jaipur.`,
      path: `/products/${id}`,
    });
  }

  return pageMetadata({
    title: `${product.name} — Buy Online Jaipur | ${SITE.name}`,
    description: `${product.description.slice(0, 140)} Shop at AstroKnowledge with guidance from ${SITE.acharya}.`,
    path: `/products/${product.id}`,
    image: product.image,
  });
}

export default async function ProductDetailLayout({ params, children }: Props) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  return (
    <>
      {product && (
        <SchemaScript
          data={productJsonLd({
            id: product.id,
            name: product.name,
            description: product.description,
            image: product.image,
            price: product.price,
          })}
        />
      )}
      {children}
    </>
  );
}
