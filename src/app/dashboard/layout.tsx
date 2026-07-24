import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "My Dashboard | AstroKnowledge",
  description: "Private AstroKnowledge user dashboard.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
