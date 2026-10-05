import type { Metadata } from "next";
import { CustomerFeedback, FAQSection, FollowUs, Hero, OurStory, TrustStrip } from "@/components/store/sections";
import { ProductCatalog } from "@/components/store/product-catalog";
import { searchProducts } from "@/lib/products";
import { getPublishedFeedback } from "@/lib/feedback";

export const metadata: Metadata = {
  title: "Regalos con intención para cada emoción",
  description:
    "Descubrí regalos personalizados, detalles emotivos y opciones para cada momento especial. Encuentra el detalle perfecto para regalar con significado.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Regalos con intención para cada emoción | Tienda de Emociones",
    description:
      "Encontrá regalos personalizados que acompañan cada emoción: celebraciones, agradecimientos, aniversarios y momentos inolvidables.",
    url: "/"
  }
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
      <FAQSection />
      <CustomerFeedback testimonials={testimonials} />
      <FollowUs />
    </main>
  );
}
