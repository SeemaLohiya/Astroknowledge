import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { contentStore } from "@/lib/content-store";
import { AchievementPhoto } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const content = await contentStore.get();
  const index = content.achievementPhotos.findIndex((p) => p.id === id);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const current = content.achievementPhotos[index];
  const updated: AchievementPhoto = {
    ...current,
    image: (body.image as string)?.trim() ?? current.image,
    title: (body.title as string)?.trim() ?? current.title,
    titleHindi: (body.titleHindi as string)?.trim() ?? current.titleHindi,
    alt: (body.alt as string)?.trim() ?? current.alt,
    description: body.description !== undefined ? (body.description as string)?.trim() || undefined : current.description,
  };

  const achievementPhotos = [...content.achievementPhotos];
  achievementPhotos[index] = updated;
  await contentStore.updateSection("achievementPhotos", achievementPhotos);
  return NextResponse.json({ item: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const content = await contentStore.get();
  const achievementPhotos = content.achievementPhotos.filter((p) => p.id !== id);
  if (achievementPhotos.length === content.achievementPhotos.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await contentStore.updateSection("achievementPhotos", achievementPhotos);
  return NextResponse.json({ success: true });
}
