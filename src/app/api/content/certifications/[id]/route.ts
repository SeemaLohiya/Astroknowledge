import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { contentStore } from "@/lib/content-store";
import { CertificationEntry } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const content = await contentStore.get();
  const index = content.certifications.findIndex((c) => c.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const current = content.certifications[index];
  const updated: CertificationEntry = {
    ...current,
    title: (body.title as string)?.trim() ?? current.title,
    titleHindi: body.titleHindi !== undefined ? (body.titleHindi as string)?.trim() || undefined : current.titleHindi,
    subtitle: body.subtitle !== undefined ? (body.subtitle as string)?.trim() || undefined : current.subtitle,
  };

  const certifications = [...content.certifications];
  certifications[index] = updated;
  await contentStore.updateSection("certifications", certifications);
  return NextResponse.json({ item: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const content = await contentStore.get();
  const certifications = content.certifications.filter((c) => c.id !== id);
  if (certifications.length === content.certifications.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await contentStore.updateSection("certifications", certifications);
  return NextResponse.json({ success: true });
}
