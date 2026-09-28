"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { ProductCard } from "./product-card";
import type { StoreProduct } from "@/lib/types";
import { categoryLabels } from "@/lib/demo-products";

const categories = [
  { label: "Todos", value: "todos" },
  { label: "Para mimar", value: "para-mimar" },
  { label: "Para decir te quiero", value: "para-decir-te-quiero" },
  { label: "Para celebrar", value: "para-celebrar" },
  { label: "Para sorprender", value: "para-sorprender" }
];

export function ProductCatalog({
  products,
  searchQuery = ""
}: {
  products: StoreProduct[];
  searchQuery?: string;
}) {
  const [activeCategory, setActiveCategory] = useState("todos");
  const [sort, setSort] = useState("featured");
  const filteredProducts = useMemo(() => {
    const matching = products.filter((product) =>
      activeCategory === "todos" || product.category === activeCategory
    );
    return [...matching].sort((first, second) => {
      if (sort === "price-asc") return first.price - second.price;
      if (sort === "price-desc") return second.price - first.price;
      return Number(second.featured) - Number(first.featured);
    });
  }, [activeCategory, products, sort]);

  return (
    <section className="catalog section-wrap" id="catalogo">
      <div className="section-heading">
        <div>
          <span className="eyebrow"><span className="eyebrow-line" /> NUESTRA TIENDA</span>
          <h2>Un detalle para <em>cada sentir</em></h2>
          <p>
            {searchQuery
              ? `Resultados para “${searchQuery}”`
              : "Elegí una emoción. Nosotros nos ocupamos del resto."}
          </p>
        </div>
        <Link className="text-link desktop-all" href="/#catalogo">
          Ver todos los regalos <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="catalog-toolbar">
        <div className="category-list" aria-label="Filtrar por categoría">
          {categories.map((category) => (
            <button
              key={category.value}
              className={`category-chip ${activeCategory === category.value ? "active" : ""}`}
              onClick={() => setActiveCategory(category.value)}
              aria-pressed={activeCategory === category.value}
            >
              {category.label}
            </button>
          ))}
        </div>
        <label className="sort-button">
          <span>Ordenar:</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Ordenar productos">
            <option value="featured">Destacados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
        </label>
      </div>
      {filteredProducts.length ? (
        <div className="product-grid">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-results">
          <span className="empty-results-icon"><Search size={24} /></span>
          <h3>No encontramos ese detalle</h3>
          <p>
            {searchQuery
              ? `No hay regalos que coincidan con “${searchQuery}”. Probá otra búsqueda.`
              : `Todavía no tenemos regalos en “${categoryLabels[activeCategory] ?? activeCategory}”.`}
          </p>
          <button className="button button-default" onClick={() => setActiveCategory("todos")}>
            Ver todos los regalos
          </button>
        </div>
      )}
      <Link className="text-link mobile-all" href="/#catalogo">Ver todos los regalos <span aria-hidden="true">→</span></Link>
    </section>
  );
}
