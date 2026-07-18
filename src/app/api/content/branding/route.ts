import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { contentStore } from "@/lib/content-store";
import { defaultAcharyaImage, resolveAcharyaImage } from "@/lib/site-branding";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await contentStore.get();
  return NextResponse.json(
    { acharyaImage: resolveAcharyaImage(content) },
    { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120" } }
  );
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const acharyaImage =
    typeof body.acharyaImage === "string" && body.acharyaImage.trim()
      ? body.acharyaImage.trim()
      : defaultAcharyaImage();

  await contentStore.updateSection("acharyaImage", acharyaImage);
  return NextResponse.json({ acharyaImage });
}
