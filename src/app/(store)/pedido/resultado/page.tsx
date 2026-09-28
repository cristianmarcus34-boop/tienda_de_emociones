import Link from "next/link";
import { Check, Heart } from "lucide-react";

export default async function OrderResultPage({
  searchParams
}: {
  searchParams: Promise<{ pedido?: string }>;
}) {
  const { pedido } = await searchParams;
  const successful = pedido === "exito";
  const pending = pedido === "pendiente";

  return (
    <main className="order-result section-wrap">
      <span className="empty-results-icon">
        {successful ? <Check size={25} /> : <Heart size={25} />}
      </span>
      <span className="eyebrow">{successful ? "¡QUÉ LINDO!" : pending ? "PAGO PENDIENTE" : "PEDIDO INTERRUMPIDO"}</span>
      <h1>{successful ? "Tu regalo ya está en camino." : pending ? "Tu pedido está pendiente de pago." : "Tu pedido sigue esperándote."}</h1>
      <p>
        {successful
          ? "Recibimos tu pago. En breve nos ponemos en contacto para coordinar la entrega."
          : pending
            ? "En cuanto se acredite el pago, te escribimos para coordinar la entrega."
            : "No se realizó ningún cobro. Podés volver a la tienda cuando quieras."}
      </p>
      <Link className="button button-default" href="/#catalogo">
        Volver a la tienda <Heart size={15} />
      </Link>
    </main>
  );
}
