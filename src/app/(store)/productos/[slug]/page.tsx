import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, Truck } from "lucide-react";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { getProducts } from "@/lib/products";
import { categoryLabels } from "@/lib/demo-products";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getProducts()).find((item) => item.slug === slug);
  if (!product) return { title: "Regalo no encontrado" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: [product.image] }
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = (await getProducts()).find((item) => item.slug === slug);
  if (!product) notFound();

  return (
    <main className="product-page section-wrap">
      <Link className="back-link" href="/#catalogo"><ArrowLeft size={15} /> Volver a la tienda</Link>
      <div className="product-detail">
        <div className="product-detail-image">
          <Image src={product.image} alt={product.alt} fill priority unoptimized={product.image.startsWith("http")} sizes="(max-width: 760px) 90vw, 50vw" />
        </div>
        <div className="product-detail-copy">
          <span className="eyebrow"><span className="eyebrow-line" /> {categoryLabels[product.category] ?? product.category}</span>
          <h1>{product.name}</h1>
          <strong className="detail-price">{currency.format(product.price)}</strong>
          <p>{product.description}</p>
          <p className="detail-copy-extra">
            Preparado con dedicación para que regalarlo sea parte de un momento especial.
            Escribinos si querés incluir una dedicatoria personalizada.
          </p>
          <AddToCartButton product={product} />
          <span className="detail-shipping"><Truck size={17} /> Envíos a todo el país. El costo se coordina al confirmar.</span>
          <span className="detail-shipping"><Heart size={17} /> Cada pedido se prepara con mucho amor.</span>
        </div>
      </div>
    </main>
  );
}
