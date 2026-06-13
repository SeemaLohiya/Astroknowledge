import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { contentStore } from "@/lib/content-store";
import { AchievementPhoto } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await contentStore.get();
  return NextResponse.json(
    { items: content.achievementPhotos },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const photo: AchievementPhoto = {
    id: (body.id as string)?.trim() || `ach-${Date.now()}`,
    image: (body.image as string)?.trim() || "",
    title: (body.title as string)?.trim() || "",
    titleHindi: (body.titleHindi as string)?.trim() || "",
    alt: (body.alt as string)?.trim() || "",
    description: (body.description as string)?.trim() || undefined,
  };

  if (!photo.image || !photo.title) {
    return NextResponse.json({ error: "Image and title are required" }, { status: 400 });
  }

  const content = await contentStore.get();
  if (content.achievementPhotos.some((p) => p.id === photo.id)) {
    return NextResponse.json({ error: "Photo ID already exists" }, { status: 409 });
  }

  const achievementPhotos = [...content.achievementPhotos, photo];
  await contentStore.updateSection("achievementPhotos", achievementPhotos);
  return NextResponse.json({ item: photo }, { status: 201 });
}
