import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getPayload } from "payload";
import Stripe from "stripe";
import { z } from "zod";
import config from "@payload-config";

export const runtime = "nodejs";

const checkoutSchema = z.object({
  provider: z.enum(["stripe", "mercadopago"]),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  items: z.array(
    z.object({
      productId: z.string().min(1).max(100),
      quantity: z.number().int().min(1).max(20),
      unitPrice: z.number().int().nonnegative()
    })
  ).min(1).max(30)
});

type CheckoutProduct = {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  status: string;
  stock?: number | null;
};

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "La tienda todavía no está conectada al catálogo y a la base de datos." },
      { status: 503 }
    );
  }

  const payloadSecret = process.env.PAYLOAD_SECRET;
  if (!payloadSecret) {
    return NextResponse.json(
      { error: "La tienda todavía no completó la configuración segura del CMS." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "El pedido no tiene un formato válido." }, { status: 400 });
  }
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Revisá tus datos y los productos del pedido." }, { status: 400 });
  }

  const { provider, name, email, items } = parsed.data;
  const ids = [...new Set(items.map((item) => item.productId))];
  if (ids.length !== items.length) {
    return NextResponse.json({ error: "El pedido contiene productos repetidos." }, { status: 400 });
  }

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteURL) {
    return NextResponse.json({ error: "Falta configurar la dirección pública de la tienda." }, { status: 503 });
  }
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const mercadoPagoToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (provider === "stripe" && !stripeKey) {
    return NextResponse.json({ error: "El pago con tarjeta todavía no está habilitado." }, { status: 503 });
  }
  if (provider === "mercadopago" && !mercadoPagoToken) {
    return NextResponse.json({ error: "Mercado Pago todavía no está habilitado." }, { status: 503 });
  }

  try {
    const payload = await getPayload({ config });
    const productsResult = await payload.find({
      collection: "products",
      where: {
        and: [
          { id: { in: ids } },
          { status: { equals: "published" } }
        ]
      },
      limit: 30,
      overrideAccess: true
    });
    const productMap = new Map(
      productsResult.docs.map((doc) => {
        const product = doc as CheckoutProduct;
        return [String(product.id), product] as const;
      })
    );

    const orderItems = items.map(({ productId, quantity }) => {
      const product = productMap.get(productId);
      if (!product) throw new Error("PRODUCT_NOT_AVAILABLE");
      const submittedPrice = items.find((item) => item.productId === productId)?.unitPrice;
      if (submittedPrice !== product.price) throw new Error("PRICE_CHANGED");
      if (quantity > (product.stock ?? 0)) {
        throw new Error("INSUFFICIENT_STOCK");
      }
      return {
        productId,
        productName: product.name,
        quantity,
        unitPrice: product.price
      };
    });
    const total = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (!Number.isSafeInteger(total) || total <= 0) {
      return NextResponse.json({ error: "El total del pedido no es válido." }, { status: 400 });
    }

    const order = await payload.create({
      collection: "orders",
      overrideAccess: true,
      data: {
        email,
        customerName: name,
        status: "pending",
        paymentProvider: provider,
        products: orderItems,
        total
      }
    });
    const successURL = `${siteURL}/pedido/resultado?pedido=exito`;
    const cancelURL = `${siteURL}/pedido/resultado?pedido=cancelado`;

    if (provider === "stripe") {
      const stripe = new Stripe(stripeKey!);
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        locale: "es-419",
        customer_email: email,
        line_items: orderItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "ars",
            unit_amount: Math.round(item.unitPrice * 100),
            product_data: { name: item.productName }
          }
        })),
        metadata: { orderId: String(order.id) },
        success_url: `${successURL}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelURL
      });
      await payload.update({
        collection: "orders",
        id: order.id,
        overrideAccess: true,
        data: { stripeSessionId: session.id }
      });
      if (!session.url) throw new Error("Stripe no devolvió una URL de pago.");
      return NextResponse.json({ url: session.url });
    }

    const client = new MercadoPagoConfig({ accessToken: mercadoPagoToken! });
    const preference = await new Preference(client).create({
      body: {
        items: orderItems.map((item) => ({
          id: item.productId,
          title: item.productName,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          currency_id: "ARS"
        })),
        payer: { name, email },
        external_reference: String(order.id),
        back_urls: {
          success: successURL,
          failure: cancelURL,
          pending: `${siteURL}/pedido/resultado?pedido=pendiente`
        },
        auto_return: "approved",
        notification_url: `${siteURL}/api/webhooks/mercadopago`
      }
    });
    await payload.update({
      collection: "orders",
      id: order.id,
      overrideAccess: true,
      data: { mercadoPagoPreferenceId: preference.id }
    });
    if (!preference.init_point) throw new Error("Mercado Pago no devolvió una URL de pago.");
    return NextResponse.json({ url: preference.init_point });
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_AVAILABLE") {
      return NextResponse.json({ error: "Uno de los regalos ya no está disponible." }, { status: 409 });
    }
    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json({ error: "No hay suficientes unidades disponibles para ese regalo." }, { status: 409 });
    }
    if (error instanceof Error && error.message === "PRICE_CHANGED") {
      return NextResponse.json(
        { error: "El precio de uno de los regalos cambió. Actualizá la tienda y revisá tu carrito." },
        { status: 409 }
      );
    }
    console.error("Error al iniciar el checkout:", error);
    return NextResponse.json({ error: "No pudimos iniciar el pago. Intentá nuevamente." }, { status: 500 });
  }
}
