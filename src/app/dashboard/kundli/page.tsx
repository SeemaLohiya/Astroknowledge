import { redirect } from "next/navigation";

export default function KundliRedirect() {
  redirect("/dashboard/profile");
}
