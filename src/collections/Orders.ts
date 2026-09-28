import type { CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: {
    singular: "Pedido",
    plural: "Pedidos"
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user)
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "status", "total", "paymentProvider", "createdAt"]
  },
  fields: [
    { name: "email", type: "email", label: "Correo del cliente", required: true },
    { name: "customerName", type: "text", label: "Nombre del cliente" },
    {
      name: "status",
      type: "select",
      label: "Estado",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pendiente de pago", value: "pending" },
        { label: "Pagado", value: "paid" },
        { label: "Cancelado", value: "cancelled" },
        { label: "Reembolsado", value: "refunded" }
      ],
      index: true
    },
    {
      name: "paymentProvider",
      type: "select",
      label: "Medio de pago",
      required: true,
      options: [
        { label: "Stripe", value: "stripe" },
        { label: "Mercado Pago", value: "mercadopago" }
      ]
    },
    {
      name: "products",
      type: "array",
      label: "Productos del pedido",
      required: true,
      fields: [
        { name: "productId", type: "text", label: "ID de producto", required: true },
        { name: "productName", type: "text", label: "Producto", required: true },
        { name: "quantity", type: "number", label: "Cantidad", required: true, min: 1 },
        { name: "unitPrice", type: "number", label: "Precio unitario", required: true, min: 0 }
      ]
    },
    { name: "total", type: "number", label: "Total en pesos argentinos", required: true, min: 0 },
    { name: "stripeSessionId", type: "text", label: "ID de sesión Stripe", index: true, unique: true },
    { name: "mercadoPagoPreferenceId", type: "text", label: "ID de preferencia de Mercado Pago", index: true },
    { name: "mercadoPagoPaymentId", type: "text", label: "ID de pago de Mercado Pago", index: true }
  ],
  timestamps: true
};
