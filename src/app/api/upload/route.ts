import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveMedia } from "@/lib/media-store";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Use JPG, PNG, WebP, or GIF" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 4MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await saveMedia({
    buffer,
    contentType: file.type === "image/jpg" ? "image/jpeg" : file.type,
    originalName: file.name,
    folder: "uploads",
  });

  return NextResponse.json({ url: saved.url, id: saved.id });
}
