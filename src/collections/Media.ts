import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Imagen",
    plural: "Imágenes"
  },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "updatedAt"]
  },
  access: {
    read: () => true
  },
  upload: {
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 400, fit: "cover" },
      { name: "card", width: 900, height: 900, fit: "cover" }
    ]
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
      admin: {
        description: "Describí la imagen para lectores de pantalla y buscadores."
      },
      required: true
    }
  ]
};