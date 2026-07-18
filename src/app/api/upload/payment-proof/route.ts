import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveMedia } from "@/lib/media-store";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Please upload a JPG, PNG, or WebP image" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const saved = await saveMedia({
    buffer,
    contentType: file.type === "image/jpg" ? "image/jpeg" : file.type,
    originalName: file.name || `payment-${session.userId}.jpg`,
    folder: "payments",
  });

  return NextResponse.json({ url: saved.url, id: saved.id });
}
