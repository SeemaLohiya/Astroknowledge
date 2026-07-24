import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const host = SITE.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/api/",
          "/checkout",
          "/payment",
          "/cart",
          "/login",
          "/studio/",
        ],
      },
    ],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
