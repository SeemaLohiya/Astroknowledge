"use client";

import { parseResponseJson } from "@/lib/fetch-json";
import { SafeImage } from "@/components/ui/SafeImage";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploadField({ value, onChange, label = "Image" }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await parseResponseJson<{ url?: string; error?: string }>(res);
      if (!res.ok || !data?.url) throw new Error(data?.error || "Upload failed");
      onChange(data.url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1 block text-xs text-text-muted">{label}</label>
      <div className="relative mb-2 h-36 overflow-hidden rounded-xl border border-gold/20 bg-orange/5">
        {value ? (
          <SafeImage src={value} alt="Preview" fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted text-sm">No image</div>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="/images/..."
        className="mb-2 w-full rounded-xl border border-gold/20 bg-orange/5 px-3 py-2 text-sm text-text-primary focus:border-gold focus:outline-none"
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gold/40 bg-gold/5 py-2.5 text-sm text-gold hover:bg-gold/10 disabled:opacity-50"
      >
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading..." : "Upload New Image"}
      </button>
    </div>
  );
}
