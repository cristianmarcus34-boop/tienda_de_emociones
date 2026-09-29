import { getPayload } from "payload";
import config from "@payload-config";
import { demoProducts } from "./demo-products";
import { getTypesenseClient } from "./typesense";
import type { StoreProduct } from "./types";

type PayloadProduct = {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image?: string | { url?: string | null; alt?: string | null } | null;
  featured?: boolean | null;
  status?: string;
};

function toStoreProduct(product: PayloadProduct): StoreProduct {
  const image =
    typeof product.image === "object" && product.image !== null
      ? product.image
      : null;

  let imageURL = "/images/regalo-placeholder.svg";

  if (image?.url) {
    if (image.url.startsWith("http")) {
      // URL absoluta (Vercel Blob, Unsplash, etc.) → usarla tal cual
      imageURL = image.url;
    } else {
      // Ruta relativa (ej: /api/media/file/...) → resolver contra el dominio
      const base = (
        process.env.NEXT_PUBLIC_SERVER_URL ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        ""
      ).replace(/\/$/, "");
      imageURL = base ? `${base}${image.url}` : image.url;
    }
  }

  return {
    id: String(product.id),
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: product.category,
    image: imageURL,
    alt: image?.alt ?? product.name,
    featured: product.featured ?? false
  };
}

export async function getProducts(): Promise<StoreProduct[]> {
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("DATABASE_URL es obligatorio para publicar el catálogo en producción.");
    }
    return demoProducts;
  }

  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "products",
    where: { status: { equals: "published" } },
    depth: 1,
    limit: 100,
    sort: "-createdAt"
  });
  return result.docs.map((product) => toStoreProduct(product as PayloadProduct));
}

export async function searchProducts(query: string): Promise<StoreProduct[]> {
  const searchTerm = query.trim();
  if (!searchTerm) return getProducts();

  const client = getTypesenseClient();
  if (client) {
    const result = await client
      .collections<Pick<PayloadProduct, "id">>("products")
      .documents()
      .search({
        q: searchTerm,
        query_by: "name,description,category",
        filter_by: "status:=published",
        per_page: 100
      });
    const ids = (result.hits ?? []).flatMap((hit) =>
      hit.document?.id !== undefined ? [String(hit.document.id)] : []
    );
    if (!ids.length) return [];
    const products = await getProducts();
    const productsByID = new Map(products.map((product) => [product.id, product]));
    return ids.flatMap((id) => {
      const product = productsByID.get(id);
      return product ? [product] : [];
    });
  }

  const products = await getProducts();
  const normalizedQuery = searchTerm.toLocaleLowerCase("es");
  return products.filter((product) =>
    `${product.name} ${product.description} ${product.category}`
      .toLocaleLowerCase("es")
      .includes(normalizedQuery)
  );
}