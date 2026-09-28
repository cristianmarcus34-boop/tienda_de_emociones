import type { Metadata } from "next";
import { CustomerFeedback, FollowUs, Hero, OurStory, TrustStrip } from "@/components/store/sections";
import { ProductCatalog } from "@/components/store/product-catalog";
import { searchProducts } from "@/lib/products";
import { getPublishedFeedback } from "@/lib/feedback";

export const metadata: Metadata = {
  alternates: { canonical: "/" }
};

export default async function HomePage({
  searchParams
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q.trim() : "";
  const [products, testimonials] = await Promise.all([
    searchProducts(query),
    getPublishedFeedback()
  ]);

  return (
    <main>
      <Hero />
      <TrustStrip />
      <ProductCatalog products={products} searchQuery={query} />
      <OurStory />
      <CustomerFeedback testimonials={testimonials} />
      <FollowUs />
    </main>
  );
}
