"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CreditCard, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";

type CheckoutFormProps = {
  onBack: () => void;
  onSuccess: () => void;
};

export function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
  const { items, subtotal, clearCart } = useCart();
  const [provider, setProvider] = useState<"mercadopago" | "whatsapp">("mercadopago");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (provider === "whatsapp") {
      const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "");
      if (!phone) {
        setError("La tienda todavía no configuró su número de WhatsApp.");
        return;
      }
      const lines = items.map(
        ({ product, quantity }) => `• ${product.name} x${quantity} — ${formatPrice(product.price * quantity)}`
      );
      const message = [
        `¡Hola! Soy ${name} y quiero hacer este pedido:`,
        "",
        ...lines,
        "",
        `Mi correo: ${email}`
      ].join("\n");
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          name,
          email,
          items: items.map(({ product, quantity }) => ({
            productId: product.id,
            quantity,
            unitPrice: product.price
          }))
        })
      });
      const result: unknown = await response.json();
      if (!response.ok || typeof result !== "object" || result === null || !("url" in result) || typeof result.url !== "string") {
        const message =
          typeof result === "object" && result !== null && "error" in result && typeof result.error === "string"
            ? result.error
            : "No pudimos iniciar el pago. Intentá nuevamente.";
        throw new Error(message);
      }
      clearCart();
      window.location.assign(result.url);
      onSuccess();
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Ocurrió un error al iniciar el pago.");
      setLoading(false);
    }
  }

  return (
    <form className="checkout-form" onSubmit={submit}>
      <button type="button" className="back-link" onClick={onBack}><ArrowLeft size={15} /> Volver al carrito</button>
      <p className="checkout-intro">
        Completá tus datos. Para pagar, te vamos a llevar al sitio seguro de Mercado Pago.
        El envío se coordina aparte.
      </p>
      <label className="form-label" htmlFor="checkout-name">Nombre y apellido</label>
      <input className="form-input" id="checkout-name" name="name" autoComplete="name" required maxLength={100} />
      <label className="form-label" htmlFor="checkout-email">Correo electrónico</label>
      <input className="form-input" id="checkout-email" name="email" type="email" autoComplete="email" required maxLength={254} />
      <fieldset className="payment-options">
        <legend className="form-label">Elegí cómo continuar</legend>
        <label className={`payment-option ${provider === "mercadopago" ? "selected" : ""}`}>
          <input
            type="radio"
            name="provider"
            value="mercadopago"
            checked={provider === "mercadopago"}
            onChange={() => setProvider("mercadopago")}
          />
          <span className="payment-provider-icon"><CreditCard size={18} /></span>
          <span>
            <strong>Pagar con Mercado Pago</strong>
            <small>Elegí allí un medio de pago disponible</small>
          </span>
        </label>
        <label className={`payment-option ${provider === "whatsapp" ? "selected" : ""}`}>
          <input
            type="radio"
            name="provider"
            value="whatsapp"
            checked={provider === "whatsapp"}
            onChange={() => setProvider("whatsapp")}
          />
          <span className="payment-provider-icon whatsapp-icon"><MessageCircle size={18} /></span>
          <span><strong>Coordinar por WhatsApp</strong><small>Te escribimos para confirmar el pedido</small></span>
        </label>
      </fieldset>
      {provider === "mercadopago" && (
        <div className="payment-trust-note">
          <ShieldCheck size={15} />
          <span>El pago se completa en Mercado Pago; la tienda no guarda tus datos bancarios.</span>
        </div>
      )}
      <div className="checkout-total-row">
        <span>Subtotal de productos</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <Button className="checkout-button" type="submit" disabled={loading}>
        {loading ? "Conectando con Mercado Pago…" : provider === "whatsapp" ? "Enviar pedido" : "Ir a Mercado Pago"}
        {provider === "whatsapp" ? <MessageCircle size={16} /> : <ArrowRight size={16} />}
      </Button>
      <span className="checkout-caption"><ShieldCheck size={13} /> Tus datos viajan de forma segura</span>
    </form>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}
