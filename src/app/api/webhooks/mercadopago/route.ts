import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { getPayload } from "payload";
import config from "@payload-config";

export const runtime = "nodejs";

type OrderRecord = {
  id: string | number;
  total: number;
  status: string;
};

function hasValidSignature(signature: string, requestID: string, paymentID: string, secret: string) {
  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [key, value] = part.trim().split("=", 2);
      return [key, value];
    })
  );
  const timestamp = parts.ts;
  const receivedHash = parts.v1;
  if (!timestamp || !receivedHash || !/^\d+$/.test(paymentID)) return false;

  const manifest = `id:${paymentID.toLowerCase()};request-id:${requestID};ts:${timestamp};`;
  const expectedHash = createHmac("sha256", secret).update(manifest).digest("hex");
  const expected = Buffer.from(expectedHash, "hex");
  const received = Buffer.from(receivedHash, "hex");
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function POST(request: Request) {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!accessToken || !webhookSecret || !process.env.DATABASE_URL) {
    return NextResponse.json({ error: "El webhook de Mercado Pago no está configurado." }, { status: 503 });
  }

  const url = new URL(request.url);
  const paymentID = url.searchParams.get("data.id") ?? url.searchParams.get("id");
  const signature = request.headers.get("x-signature");
  const requestID = request.headers.get("x-request-id");
  if (!paymentID || !signature || !requestID || !hasValidSignature(signature, requestID, paymentID, webhookSecret)) {
    return NextResponse.json({ error: "La firma del webhook no es válida." }, { status: 401 });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const payment = await new Payment(client).get({ id: paymentID });
    if (payment.status !== "approved" || !payment.external_reference) {
      return NextResponse.json({ recibido: true });
    }

    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "orders",
      where: { id: { equals: payment.external_reference } },
      limit: 1,
      overrideAccess: true
    });
    const order = result.docs[0] as OrderRecord | undefined;
    if (!order) return NextResponse.json({ error: "No se encontró el pedido asociado." }, { status: 404 });
    if (payment.currency_id !== "ARS" || payment.transaction_amount !== order.total) {
      console.error("Importe o moneda de Mercado Pago no coincide con el pedido:", payment.id);
      return NextResponse.json({ error: "El importe del pago no coincide con el pedido." }, { status: 400 });
    }
    if (order.status !== "paid") {
      await payload.update({
        collection: "orders",
        id: order.id,
        overrideAccess: true,
        data: { status: "paid", mercadoPagoPaymentId: String(payment.id) }
      });
    }
    return NextResponse.json({ recibido: true });
  } catch (error) {
    console.error("No se pudo verificar el pago de Mercado Pago:", error);
    return NextResponse.json({ error: "No se pudo actualizar el pedido." }, { status: 500 });
  }
}
