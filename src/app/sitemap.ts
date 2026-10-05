import type { MetadataRoute } from "next";
import { absoluteUrl, getSiteURL } from "@/lib/site";
import { getProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseURL = getSiteURL().replace(/\/$/, "");
  const products = await getProducts();

  const productEntries = products.map((product) => ({
    url: absoluteUrl(`/productos/${product.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));

  return [
    {
      url: baseURL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1
    },
    ...productEntries
  ];
}
