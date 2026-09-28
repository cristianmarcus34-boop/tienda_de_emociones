import type { CollectionConfig } from "payload";
import { getTypesenseClient } from "../lib/typesense";

const categories = [
  { label: "Para mimar", value: "para-mimar" },
  { label: "Para decir te quiero", value: "para-decir-te-quiero" },
  { label: "Para celebrar", value: "para-celebrar" },
  { label: "Para sorprender", value: "para-sorprender" }
];

export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "Producto",
    plural: "Productos"
  },
  access: {
    read: ({ req }) =>
      req.user ? true : { status: { equals: "published" } }
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.name && !data.slug) {
          data.slug = data.name
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .toLocaleLowerCase("es")
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        }
        return data;
      }
    ],
    afterChange: [
      async ({ doc }) => {
        const client = getTypesenseClient();
        if (client) {
          await client.collections("products").documents().upsert({
            id: String(doc.id),
            name: doc.name,
            description: doc.description,
            category: doc.category,
            status: doc.status
          });
        }
        return doc;
      }
    ],
    afterDelete: [
      async ({ doc }) => {
        const client = getTypesenseClient();
        if (client) {
          await client
            .collections("products")
            .documents()
            .delete({ filter_by: `id:=${String(doc.id)}` });
        }
        return doc;
      }
    ]
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "stock", "status"]
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre",
      admin: { description: "Nombre que verán los clientes en la tienda." },
      required: true
    },
    {
      name: "slug",
      type: "text",
      label: "URL",
      admin: {
        position: "sidebar",
        description: "Se completa automáticamente a partir del nombre del producto."
      },
      required: true,
      unique: true,
      index: true
    },
    {
      name: "description",
      type: "textarea",
      label: "Descripción",
      admin: { description: "Contá qué incluye el regalo y qué lo hace especial." },
      required: true
    },
    {
      name: "price",
      type: "number",
      label: "Precio en pesos argentinos",
      required: true,
      min: 0,
      validate: (value: unknown) =>
        typeof value === "number" && Number.isSafeInteger(value)
          ? true
          : "Ingresá el precio en pesos enteros."
    },
    {
      name: "category",
      type: "select",
      label: "Categoría",
      options: categories,
      required: true,
      index: true
    },
    {
      name: "image",
      type: "upload",
      label: "Foto principal",
      relationTo: "media",
      required: true
    },
    {
      name: "stock",
      type: "number",
      label: "Unidades disponibles",
      defaultValue: 0,
      min: 0,
      admin: { position: "sidebar" }
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Destacar en portada",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Si está activado, aparece primero en los productos destacados."
      }
    },
    {
      name: "status",
      type: "select",
      label: "Estado",
      options: [
        { label: "Borrador", value: "draft" },
        { label: "Publicado", value: "published" }
      ],
      defaultValue: "draft",
      required: true,
      index: true,
      admin: { position: "sidebar" }
    }
  ],
  timestamps: true
};
