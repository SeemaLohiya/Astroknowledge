import { redirect } from "next/navigation";

export default function AdminSlotsRedirect() {
  redirect("/admin/bookings");
}
