import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveMedia } from "@/lib/media-store";
import { SupportAttachmentKind } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024;

const ALLOWED: Record<string, SupportAttachmentKind> = {
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "video/mp4": "video",
  "video/webm": "video",
  "video/quicktime": "video",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "doc",
  "application/vnd.ms-excel": "doc",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "doc",
  "application/vnd.ms-powerpoint": "doc",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "doc",
  "text/plain": "doc",
  "application/zip": "file",
  "application/x-zip-compressed": "file",
};

function kindFromName(name: string): SupportAttachmentKind | null {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
  if (["mp4", "webm", "mov"].includes(ext)) return "video";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(ext)) return "doc";
  if (ext === "zip") return "file";
  return null;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be under 12MB" }, { status: 400 });
  }

  const mime = file.type || "application/octet-stream";
  const kind = ALLOWED[mime] || kindFromName(file.name);
  if (!kind) {
    return NextResponse.json(
      { error: "Unsupported file type. Use images, video, PDF, Word, Excel, PPT, TXT, or ZIP." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = mime === "image/jpg" ? "image/jpeg" : mime === "application/octet-stream"
    ? (
        kind === "pdf"
          ? "application/pdf"
          : kind === "image"
            ? "image/jpeg"
            : kind === "video"
              ? "video/mp4"
              : "application/octet-stream"
      )
    : mime;

  const saved = await saveMedia({
    buffer,
    contentType,
    originalName: file.name || `support-${session.userId}`,
    folder: "uploads",
  });

  return NextResponse.json({
    attachment: {
      url: saved.url,
      name: file.name || saved.id,
      mimeType: contentType,
      size: file.size,
      kind,
    },
  });
}
