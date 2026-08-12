import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { contentStore } from "@/lib/content-store";
import { Advertisement } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const content = await contentStore.get();
  const ads = content.advertisements ?? [];
  const index = ads.findIndex((a) => a.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const current = ads[index];
  const updated: Advertisement = {
    ...current,
    title: (body.title as string)?.trim() ?? current.title,
    titleHindi: body.titleHindi !== undefined ? (body.titleHindi as string)?.trim() || undefined : current.titleHindi,
    image: (body.image as string)?.trim() ?? current.image,
    link: body.link !== undefined ? (body.link as string)?.trim() || undefined : current.link,
    badge: (body.badge as string)?.trim() ?? current.badge,
    active: body.active !== undefined ? Boolean(body.active) : current.active,
    order: body.order !== undefined ? Number(body.order) : current.order,
  };

  const next = [...ads];
  next[index] = updated;
  await contentStore.updateSection("advertisements", next);
  return NextResponse.json({ item: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const content = await contentStore.get();
  const ads = content.advertisements ?? [];
  const next = ads.filter((a) => a.id !== id);
  if (next.length === ads.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await contentStore.updateSection("advertisements", next);
  return NextResponse.json({ success: true });
}
