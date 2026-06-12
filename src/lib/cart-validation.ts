import { catalogStore } from "./catalog-store";
import { CartItem, CartItemType, CatalogType } from "./types";

const TYPE_MAP: Record<CartItemType, CatalogType> = {
  product: "products",
  service: "services",
  course: "courses",
  pooja: "pooja",
  healing: "healing",
};

function catalogName(item: Record<string, unknown>): string {
  if (typeof item.title === "string") return item.title;
  if (typeof item.name === "string") return item.name;
  return "Item";
}

export async function validateCartItems(items: CartItem[]): Promise<{ items: CartItem[]; total: number }> {
  if (!items?.length) throw new Error("Cart is empty");

  const validated: CartItem[] = [];
  let total = 0;

  for (const item of items) {
    if (!item.id || !item.itemType) throw new Error("Invalid cart item");
    const catalogType = TYPE_MAP[item.itemType];
    if (!catalogType) throw new Error(`Unknown item type: ${item.itemType}`);

    const catalogItem = (await catalogStore.getById(catalogType, item.id)) as Record<string, unknown> | undefined;
    if (!catalogItem) throw new Error(`Item not found: ${item.name || item.id}`);

    const price = Number(catalogItem.price);
    if (!Number.isFinite(price) || price < 0) throw new Error(`Invalid price for ${item.id}`);

    const quantity = Math.min(Math.max(Math.floor(item.quantity || 1), 1), 99);
    validated.push({
      id: item.id,
      itemType: item.itemType,
      name: catalogName(catalogItem),
      price,
      image: (catalogItem.image as string) || item.image || "/images/blank.svg",
      quantity,
    });
    total += price * quantity;
  }

  return { items: validated, total };
}
