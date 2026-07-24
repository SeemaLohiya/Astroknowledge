import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Admin Panel | AstroKnowledge",
  description: "Private AstroKnowledge admin panel.",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
