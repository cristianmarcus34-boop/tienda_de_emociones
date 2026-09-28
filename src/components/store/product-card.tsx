"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";
import type { StoreProduct } from "@/lib/types";
import { categoryLabels } from "@/lib/demo-products";
import { useCart } from "./cart-context";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

export function ProductCard({ product, index = 0 }: { product: StoreProduct; index?: number }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function addToCart() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.36, delay: Math.min(index % 4, 3) * 0.06 }}
    >
      <div className="product-image-wrap">
        <Link href={`/productos/${product.slug}`} aria-label={`Ver ${product.name}`}>
          <Image
            src={product.image}
            alt={product.alt}
            fill
            sizes="(max-width: 520px) 44vw, (max-width: 760px) 45vw, (max-width: 1100px) 29vw, 22vw"
          />
        </Link>
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <button className="quick-add" onClick={addToCart} aria-label={`Agregar ${product.name} al carrito`}>
          {added ? <span className="added-check">✓</span> : <Plus size={19} />}
        </button>
      </div>
      <div className="product-info">
        <span className="product-category">{categoryLabels[product.category] ?? product.category}</span>
        <div className="product-title-row">
          <Link href={`/productos/${product.slug}`}><h3>{product.name}</h3></Link>
          <span className="product-price">{currency.format(product.price)}</span>
        </div>
        <p>{product.description}</p>
        <button className="product-add" onClick={addToCart}>
          {added ? "Agregado a tu carrito" : "Agregar al carrito"}
          {added ? <span className="added-check">✓</span> : <ArrowRight size={15} />}
        </button>
      </div>
    </motion.article>
  );
}
