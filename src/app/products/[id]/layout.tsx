import type { Metadata } from "next";
import { products } from "@/lib/data/products";
import { SITE } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    return pageMetadata({
      title: `Product | ${SITE.name}`,
      description: `Shop spiritual products at ${SITE.name}.`,
      path: `/products/${id}`,
    });
  }

  return pageMetadata({
    title: `${product.name} | Buy Online — ${SITE.name}`,
    description: product.description.slice(0, 155),
    path: `/products/${product.id}`,
    image: product.image,
  });
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
