import type { MetadataRoute } from "next";
import { getSiteURL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteURL = getSiteURL();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"]
    },
    sitemap: `${siteURL.replace(/\/$/, "")}/sitemap.xml`,
    host: siteURL.replace(/\/$/, "")
  };
}
