"use client";

import { parseResponseJson } from "@/lib/fetch-json";
import { SafeImage } from "@/components/ui/SafeImage";
import { ImagePlus, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
}

export function ImageUploadField({
  value,
  onChange,
  label = "Photo",
  hint = "Upload a clear photo (JPG/PNG/WebP, max 4MB). Then click Save on the form to publish it.",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showPath, setShowPath] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose an image file");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        toast.error("Image must be under 4MB");
        return;
      }
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await parseResponseJson<{ url?: string; error?: string }>(res);
        if (!res.ok || !data?.url) throw new Error(data?.error || "Upload failed");
        onChange(data.url);
        toast.success("Photo ready — click Save below to publish");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-text-primary">{label}</label>
      {hint ? <p className="mb-2 text-[11px] leading-relaxed text-text-muted">{hint}</p> : null}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleUpload(file);
        }}
        className={`relative mb-3 flex h-44 w-full flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors disabled:opacity-50 ${
          dragOver
            ? "border-gold bg-gold/15"
            : value
              ? "border-gold/30 bg-orange/5"
              : "border-gold/40 bg-gold/5 hover:bg-gold/10"
        }`}
      >
        {value ? (
          <>
            <SafeImage src={value} alt="Preview" fill className="object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-black/55 px-3 py-2 text-center text-xs font-semibold text-white">
              {uploading ? "Uploading…" : "Click or drop to replace photo"}
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <ImagePlus className="h-8 w-8 text-gold" />
            <span className="text-sm font-semibold text-gold">
              {uploading ? "Uploading…" : "Click or drag photo here"}
            </span>
            <span className="text-[11px] text-text-muted">JPG, PNG, WebP · up to 4MB</span>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleUpload(file);
          e.target.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 bg-gold/5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10 disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading…" : value ? "Change Photo" : "Upload Photo"}
      </button>

      <button
        type="button"
        onClick={() => setShowPath((v) => !v)}
        className="mt-2 text-[11px] text-text-muted underline-offset-2 hover:text-gold hover:underline"
      >
        {showPath ? "Hide path" : "Advanced: edit image path"}
      </button>
      {showPath ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/... or /api/media/..."
          className="mt-2 w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm text-text-primary focus:border-gold focus:outline-none"
        />
      ) : null}
    </div>
  );
}
