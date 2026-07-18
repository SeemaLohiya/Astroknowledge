import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";
import mongoose, { Schema } from "mongoose";
import { connectDB, isMongoEnabled } from "./db/connect";

export type StoredMedia = {
  id: string;
  contentType: string;
  data: Buffer;
  filename: string;
};

const mediaSchema = new Schema(
  {
    _id: { type: String, required: true },
    contentType: { type: String, required: true },
    data: { type: Buffer, required: true },
    filename: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const MediaModel =
  mongoose.models.MediaFile ?? mongoose.model("MediaFile", mediaSchema, "media_files");

function safeExt(filename: string, contentType: string): string {
  const fromName = filename.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  return "jpg";
}

function localUploadPath(folder: "uploads" | "payments", filename: string) {
  const parts =
    folder === "payments"
      ? [process.cwd(), "public", "images", "uploads", "payments"]
      : [process.cwd(), "public", "images", "uploads"];
  return {
    dir: path.join(...parts),
    filePath: path.join(...parts, filename),
    publicUrl:
      folder === "payments" ? `/images/uploads/payments/${filename}` : `/images/uploads/${filename}`,
  };
}

/** Persist image bytes in Mongo (production) or local public/ (dev). Returns a stable public URL. */
export async function saveMedia(opts: {
  buffer: Buffer;
  contentType: string;
  originalName: string;
  folder?: "uploads" | "payments";
}): Promise<{ url: string; id: string }> {
  const folder = opts.folder ?? "uploads";
  const ext = safeExt(opts.originalName, opts.contentType);
  const id = `${folder}-${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const filename = id;

  if (isMongoEnabled()) {
    await connectDB();
    await MediaModel.findByIdAndUpdate(
      id,
      {
        $set: {
          _id: id,
          contentType: opts.contentType,
          data: opts.buffer,
          filename,
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );
    return { url: `/api/media/${encodeURIComponent(id)}`, id };
  }

  const local = localUploadPath(folder, filename);
  if (!fs.existsSync(local.dir)) fs.mkdirSync(local.dir, { recursive: true });
  fs.writeFileSync(local.filePath, opts.buffer);
  return { url: local.publicUrl, id };
}

function toBuffer(data: unknown): Buffer {
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (data && typeof data === "object" && "buffer" in (data as object)) {
    const buf = (data as { buffer: ArrayBuffer }).buffer;
    return Buffer.from(buf);
  }
  return Buffer.from(data as ArrayBuffer);
}

export async function getMedia(id: string): Promise<StoredMedia | null> {
  const safeId = path.basename(id);
  if (!safeId || safeId !== id.replace(/\\/g, "/").split("/").pop()) return null;

  if (isMongoEnabled()) {
    await connectDB();
    const doc = await MediaModel.findById(safeId).lean();
    if (doc?.data) {
      return {
        id: safeId,
        contentType: (doc.contentType as string) || "image/jpeg",
        data: toBuffer(doc.data),
        filename: (doc.filename as string) || safeId,
      };
    }
  }

  const candidates = [
    path.join(process.cwd(), "public", "images", "uploads", safeId),
    path.join(process.cwd(), "public", "images", "uploads", "payments", safeId),
  ];
  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;
    const data = fs.readFileSync(filePath);
    const ext = safeId.split(".").pop()?.toLowerCase();
    const contentType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : ext === "gif"
            ? "image/gif"
            : "image/jpeg";
    return { id: safeId, contentType, data, filename: safeId };
  }

  return null;
}
