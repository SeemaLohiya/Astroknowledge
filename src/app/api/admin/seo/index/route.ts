import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getAllPublicUrls } from "@/lib/seo-urls";
import { SITE } from "@/lib/constants";

export const dynamic = "force-dynamic";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "astroknowledge-seo-key-7f3a9c";
const SITE_URL = SITE.url.replace(/\/$/, "");
const HOST = new URL(SITE_URL).host;

async function submitIndexNow(urlList: string[]) {
  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urlList.slice(0, 10_000),
  };

  const results: { endpoint: string; status: number }[] = [];
  for (const endpoint of ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"]) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    results.push({ endpoint, status: res.status });
  }
  return results;
}

async function pingSitemap() {
  const sitemap = `${SITE_URL}/sitemap.xml`;
  const pings = [
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemap)}`,
    `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemap)}`,
  ];
  const results: { url: string; status: number }[] = [];
  for (const url of pings) {
    const res = await fetch(url);
    results.push({ url, status: res.status });
  }
  return results;
}

export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const urls = getAllPublicUrls();
    const indexNow = await submitIndexNow(urls);
    const sitemapPing = await pingSitemap();
    return NextResponse.json({
      submitted: urls.length,
      indexNow,
      sitemapPing,
      note: "For Google, verify in Search Console and request indexing for key URLs.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Indexing submit failed" },
      { status: 500 }
    );
  }
}
