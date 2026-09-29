"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, Copy, CreditCard, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "./cart-context";

type CheckoutFormProps = {
  onBack: () => void;
  onSuccess: () => void;
};

const mercadoPagoAlias = "PiesDescalzos";
const mercadoPagoURL = "https://www.mercadopago.com.ar/";

export function CheckoutForm({ onBack, onSuccess }: CheckoutFormProps) {
  const { items, subtotal } = useCart();
  const [provider, setProvider] = useState<"mercadopago" | "whatsapp">("mercadopago");
  const [error, setError] = useState("");
  const [aliasCopied, setAliasCopied] = useState(false);

  async function copyAlias() {
    setError("");
    try {
      await navigator.clipboard.writeText(mercadoPagoAlias);
      setAliasCopied(true);
      window.setTimeout(() => setAliasCopied(false), 1800);
    } catch {
      setError("No se pudo copiar el alias. Seleccionalo y copialo manualmente.");
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (provider === "mercadopago") {
      window.location.assign(mercadoPagoURL);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

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
    onSuccess();
  }

  return (
    <form className="checkout-form" onSubmit={submit}>
      <button type="button" className="back-link" onClick={onBack}><ArrowLeft size={15} /> Volver al carrito</button>
      <p className="checkout-intro">
        {provider === "mercadopago"
          ? "Copiá el alias, transferí el total desde Mercado Pago y coordinaremos el envío aparte."
          : "Completá tus datos para enviar el pedido por WhatsApp. El envío se coordina aparte."}
      </p>
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
            <small>Transferencia por alias</small>
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
        <>
          <div className="payment-alias-row">
            <div className="payment-alias-value">
              <span>Alias de la tienda</span>
              <strong>{mercadoPagoAlias}</strong>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={copyAlias}>
              {aliasCopied ? <Check size={14} /> : <Copy size={14} />}
              {aliasCopied ? "Copiado" : "Copiar"}
            </Button>
          </div>
          <div className="payment-trust-note">
            <ShieldCheck size={15} />
            <span>La transferencia no confirma el pedido automáticamente. Conservá el comprobante.</span>
          </div>
        </>
      )}
      {provider === "whatsapp" && (
        <>
          <label className="form-label" htmlFor="checkout-name">Nombre y apellido</label>
          <input className="form-input" id="checkout-name" name="name" autoComplete="name" required maxLength={100} />
          <label className="form-label" htmlFor="checkout-email">Correo electrónico</label>
          <input className="form-input" id="checkout-email" name="email" type="email" autoComplete="email" required maxLength={254} />
        </>
      )}
      <div className="checkout-total-row">
        <span>{provider === "mercadopago" ? "Total a transferir" : "Subtotal de productos"}</span>
        <strong>{formatPrice(subtotal)}</strong>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <Button className="checkout-button" type="submit">
        {provider === "whatsapp" ? "Enviar pedido" : "Abrir Mercado Pago"}
        {provider === "whatsapp" ? <MessageCircle size={16} /> : <ArrowRight size={16} />}
      </Button>
      {provider === "whatsapp" && <span className="checkout-caption">Se abrirá WhatsApp con el detalle del pedido.</span>}
    </form>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(value);
}
