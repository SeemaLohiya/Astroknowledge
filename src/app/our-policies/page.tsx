"use client";

import { LegalDocumentPage } from "@/components/ui/LegalDocumentPage";
import { ourPoliciesDocument } from "@/lib/legal/our-policies-content";

export default function OurPoliciesPage() {
  return <LegalDocumentPage document={ourPoliciesDocument} breadcrumbLabel="Our Policies" />;
}
