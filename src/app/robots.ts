import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

const HOST = SITE.url.replace(/\/$/, "");

const PRIVATE_PATHS = [
  "/admin",
  "/dashboard",
  "/api",
  "/checkout",
  "/payment",
  "/cart",
  "/login",
  "/studio",
];

function disallowList() {
  return PRIVATE_PATHS.flatMap((p) => [p, `${p}/`]);
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowList(),
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: disallowList(),
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/images/", "/"],
        disallow: disallowList(),
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: disallowList(),
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/llms.txt", "/best-astrologer-jaipur", "/services", "/about", "/contact"],
        disallow: ["/admin", "/dashboard", "/api", "/checkout", "/payment", "/cart", "/login"],
      },
    ],
    sitemap: `${HOST}/sitemap.xml`,
    host: HOST,
  };
}
