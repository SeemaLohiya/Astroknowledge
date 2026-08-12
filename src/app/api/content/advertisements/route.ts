import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { contentStore } from "@/lib/content-store";
import { Advertisement } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await contentStore.get();
  const items = (content.advertisements ?? [])
    .filter((a) => a.active)
    .sort((a, b) => a.order - b.order);
  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
  );
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const ad: Advertisement = {
    id: (body.id as string)?.trim() || `ad-${Date.now()}`,
    title: (body.title as string)?.trim() || "",
    titleHindi: (body.titleHindi as string)?.trim() || undefined,
    image: (body.image as string)?.trim() || "",
    link: (body.link as string)?.trim() || undefined,
    badge: (body.badge as string)?.trim() || "Update",
    active: body.active !== false,
    order: Number(body.order) || 0,
  };

  if (!ad.image || !ad.title) {
    return NextResponse.json({ error: "Image and title are required" }, { status: 400 });
  }

  const content = await contentStore.get();
  const ads = content.advertisements ?? [];
  if (ads.some((a) => a.id === ad.id)) {
    return NextResponse.json({ error: "Advertisement ID already exists" }, { status: 409 });
  }

  await contentStore.updateSection("advertisements", [...ads, ad]);
  return NextResponse.json({ item: ad }, { status: 201 });
}
