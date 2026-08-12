"use client";

import { LegalDocumentPage } from "@/components/ui/LegalDocumentPage";
import { termsDocument } from "@/lib/legal/terms-content";

export default function TermsPage() {
  return <LegalDocumentPage document={termsDocument} breadcrumbLabel="Terms & Conditions" />;
}
