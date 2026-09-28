"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { categoryLabels } from "@/lib/demo-products";
import { useCart } from "./cart-context";
import { CheckoutForm } from "./checkout-form";

const currency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

export function CartDrawer({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { items, count, subtotal, setQuantity, removeItem } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      onOpenChange(nextOpen);
      if (!nextOpen) setCheckingOut(false);
    }}>
      <DialogContent className="cart-drawer">
        <div className="drawer-header">
          <div>
            <span className="eyebrow">{checkingOut ? "UN PASITO MÁS" : "TUS FAVORITOS"}</span>
            <DialogTitle>{checkingOut ? "Finalizar pedido" : <>Mi carrito <span>({count})</span></>}</DialogTitle>
            <DialogDescription className="sr-only">Productos y opciones de compra</DialogDescription>
          </div>
        </div>
        {checkingOut ? (
          <CheckoutForm onBack={() => setCheckingOut(false)} onSuccess={() => onOpenChange(false)} />
        ) : items.length ? (
          <>
            <div className="cart-items">
              {items.map(({ product, quantity }) => (
                <div className="cart-item" key={product.id}>
                  <Image src={product.image} alt={product.alt} width={76} height={88} />
                  <div className="cart-item-info">
                    <span className="product-category">{categoryLabels[product.category] ?? product.category}</span>
                    <h3>{product.name}</h3>
                    <span className="cart-item-price">{currency.format(product.price)}</span>
                    <div className="quantity-control" aria-label={`Cantidad de ${product.name}`}>
                      <button onClick={() => setQuantity(product.id, quantity - 1)} aria-label="Restar uno">
                        <Minus size={13} />
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => setQuantity(product.id, quantity + 1)} aria-label="Sumar uno" disabled={quantity >= 20}>
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <button className="remove-item" onClick={() => removeItem(product.id)} aria-label={`Quitar ${product.name}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="shipping-note"><Truck size={17} /> El envío se coordina al confirmar el pedido</div>
              <div className="subtotal-row"><span>Subtotal</span><strong>{currency.format(subtotal)}</strong></div>
              <Button className="checkout-button" onClick={() => setCheckingOut(true)}>
                Continuar con mi pedido <ArrowRight size={17} />
              </Button>
              <span className="checkout-caption">Pagá con Mercado Pago o coordiná por WhatsApp ♡</span>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <span className="empty-cart-icon"><ShoppingBag size={26} /></span>
            <h3>Tu carrito está esperando algo lindo</h3>
            <p>Elegí un regalo y lo vas a encontrar acá.</p>
            <Link className="button button-default" href="/#catalogo" onClick={() => onOpenChange(false)}>
              Explorar regalos <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
