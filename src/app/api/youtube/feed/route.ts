import { NextResponse } from "next/server";
import { YOUTUBE_CHANNEL_HANDLE, YOUTUBE_FALLBACK_VIDEOS } from "@/lib/data/youtube";

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch(`https://www.youtube.com/@${YOUTUBE_CHANNEL_HANDLE}/videos`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Channel fetch failed");
    const html = await res.text();

    const titles: Record<string, string> = {};
    const titleMatches = [...html.matchAll(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/g)];
    const idMatches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];

    const seen = new Set<string>();
    const videos: { id: string; title: string }[] = [];

    for (const m of idMatches) {
      const id = m[1];
      if (seen.has(id) || id.length !== 11) continue;
      seen.add(id);
      const titleEntry = titleMatches.find((t) => t[1] && !t[1].includes("youtube"));
      const title = titleEntry?.[1] || `Video ${videos.length + 1}`;
      titles[id] = title;
      videos.push({ id, title: titles[id] });
      if (videos.length >= 12) break;
    }

    if (videos.length) {
      return NextResponse.json({ videos, source: "live" });
    }
    throw new Error("No videos parsed");
  } catch {
    return NextResponse.json({ videos: YOUTUBE_FALLBACK_VIDEOS, source: "fallback" });
  }
}
