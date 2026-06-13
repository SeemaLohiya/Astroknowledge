import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { contentStore } from "@/lib/content-store";
import { CertificationEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await contentStore.get();
  return NextResponse.json(
    { items: content.certifications },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const entry: CertificationEntry = {
    id: (body.id as string)?.trim() || `cert-${Date.now()}`,
    title: (body.title as string)?.trim() || "",
    titleHindi: (body.titleHindi as string)?.trim() || undefined,
    subtitle: (body.subtitle as string)?.trim() || undefined,
  };

  if (!entry.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const content = await contentStore.get();
  if (content.certifications.some((c) => c.id === entry.id)) {
    return NextResponse.json({ error: "Certification ID already exists" }, { status: 409 });
  }

  const certifications = [...content.certifications, entry];
  await contentStore.updateSection("certifications", certifications);
  return NextResponse.json({ item: entry }, { status: 201 });
}
