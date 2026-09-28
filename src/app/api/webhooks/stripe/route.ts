import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";

export const runtime = "nodejs";

type OrderRecord = {
  id: string | number;
  total: number;
  status: string;
};

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: "El webhook de Stripe no está configurado." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Falta la firma de Stripe." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.warn("Firma de webhook Stripe inválida:", error);
    return NextResponse.json({ error: "La firma del webhook no es válida." }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ recibido: true });
  }

  const session = event.data.object;
  const orderID = session.metadata?.orderId;
  if (!orderID || session.payment_status !== "paid") {
    return NextResponse.json({ error: "La sesión de pago no está asociada a un pedido pagado." }, { status: 400 });
  }

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "orders",
      where: { id: { equals: orderID } },
      limit: 1,
      overrideAccess: true
    });
    const order = result.docs[0] as OrderRecord | undefined;
    if (!order) return NextResponse.json({ error: "No se encontró el pedido asociado." }, { status: 404 });
    if (session.amount_total !== order.total * 100 || session.currency !== "ars") {
      console.error("Importe o moneda de Stripe no coincide con el pedido:", orderID);
      return NextResponse.json({ error: "El importe del pago no coincide con el pedido." }, { status: 400 });
    }
    if (order.status !== "paid") {
      await payload.update({
        collection: "orders",
        id: order.id,
        overrideAccess: true,
        data: { status: "paid", stripeSessionId: session.id }
      });
    }
    return NextResponse.json({ recibido: true });
  } catch (error) {
    console.error("No se pudo registrar el pago de Stripe:", error);
    return NextResponse.json({ error: "No se pudo actualizar el pedido." }, { status: 500 });
  }
}
