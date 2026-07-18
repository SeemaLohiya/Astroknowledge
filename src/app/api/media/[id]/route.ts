import { NextRequest, NextResponse } from "next/server";
import { getMedia } from "@/lib/media-store";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const decoded = decodeURIComponent(id || "");
  if (!decoded || decoded.includes("..")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const media = await getMedia(decoded);
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(media.data), {
    status: 200,
    headers: {
      "Content-Type": media.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${media.filename}"`,
    },
  });
}
