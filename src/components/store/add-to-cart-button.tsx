"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";
import type { StoreProduct } from "@/lib/types";

export function AddToCartButton({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function add() {
    addItem(product);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return (
    <Button className="detail-add" onClick={add}>
      {added ? <Check size={17} /> : <ShoppingBag size={17} />}
      {added ? "Agregado a tu carrito" : "Agregar al carrito"}
    </Button>
  );
}
