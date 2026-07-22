import { redirect } from "next/navigation";

/** Legacy /admin/orders → products items orders */
export default function AdminOrdersPage() {
  redirect("/admin/items/products");
}
