/**
 * Ping search engines to crawl astroknowledge.in faster (IndexNow + Bing sitemap).
 * Usage: node scripts/submit-seo-indexing.mjs
 * Env: SITE_URL (default https://astroknowledge.in)
 */
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://astroknowledge.in").replace(
  /\/$/,
  ""
);
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "astroknowledge-seo-key-7f3a9c";
const HOST = new URL(SITE_URL).host;

async function fetchLiveSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, { signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return urls.length ? urls : null;
}

function urlsFromRepo() {
  // Fallback: parse sitemap source paths when live site not ready yet
  const base = join(__dirname, "..");
  const paths = ["/", "/about", "/services", "/courses", "/products", "/pooja", "/healing", "/booking", "/contact", "/best-astrologer-jaipur"];
  return paths.map((p) => `${SITE_URL}${p}`);
}

async function submitIndexNow(urlList) {
  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urlList.slice(0, 10_000),
  };

  const endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
      });
      console.log(`IndexNow ${endpoint}: ${res.status} ${res.statusText}`);
    } catch (e) {
      console.warn(`IndexNow ${endpoint} failed:`, e.message);
    }
  }
}

async function pingBingSitemap() {
  const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`;
  try {
    const res = await fetch(pingUrl, { signal: AbortSignal.timeout(20_000) });
    console.log(`Bing sitemap ping: ${res.status} ${res.statusText}`);
  } catch (e) {
    console.warn("Bing sitemap ping failed:", e.message);
  }
}

async function pingYandexSitemap() {
  const pingUrl = `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(`${SITE_URL}/sitemap.xml`)}`;
  try {
    const res = await fetch(pingUrl, { signal: AbortSignal.timeout(20_000) });
    console.log(`Yandex sitemap ping: ${res.status} ${res.statusText}`);
  } catch (e) {
    console.warn("Yandex sitemap ping failed:", e.message);
  }
}

async function main() {
  console.log("Submitting SEO indexing for", SITE_URL);

  let urls;
  try {
    urls = await fetchLiveSitemapUrls();
    if (urls) console.log(`Loaded ${urls.length} URLs from live sitemap.xml`);
  } catch (e) {
    console.warn("Live sitemap unavailable:", e.message);
  }

  if (!urls?.length) {
    urls = urlsFromRepo();
    console.log(`Using ${urls.length} fallback URLs`);
  }

  await submitIndexNow(urls);
  await pingBingSitemap();
  await pingYandexSitemap();

  console.log("Done. For Google, add the site in Search Console and request indexing for the homepage.");
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
