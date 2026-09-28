import type { CollectionConfig } from "payload";

/**
 * Public customers submit moderated reviews through /api/feedback.
 * Only authenticated administrators can view and moderate submissions.
 */
export const Feedback: CollectionConfig = {
  slug: "feedback",
  labels: {
    singular: "Opinión de cliente",
    plural: "Opiniones de clientes"
  },
  access: {
    read: ({ req }) => req.user ? true : { status: { equals: "published" } },
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user)
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "rating", "status", "createdAt"],
    description: "Opiniones enviadas por clientes. Leelas y publicá solo las autorizadas para compartir."
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre para mostrar",
      required: true,
      maxLength: 60
    },
    {
      name: "message",
      type: "textarea",
      label: "Opinión",
      required: true,
      maxLength: 500,
      admin: {
        description: "Texto público. Revisá que no contenga datos personales antes de publicarlo."
      }
    },
    {
      name: "rating",
      type: "number",
      label: "Puntuación",
      required: true,
      min: 1,
      max: 5
    },
    {
      name: "consent",
      type: "checkbox",
      label: "Autorizó mostrar su opinión en la tienda",
      required: true
    },
    {
      name: "status",
      type: "select",
      label: "Estado de publicación",
      required: true,
      defaultValue: "pending",
      index: true,
      options: [
        { label: "Pendiente de revisión", value: "pending" },
        { label: "Publicada", value: "published" },
        { label: "Archivada", value: "archived" }
      ],
      admin: {
        position: "sidebar",
        description: "Solo aparece en la tienda cuando la marcás como Publicada."
      }
    }
  ],
  timestamps: true
};
