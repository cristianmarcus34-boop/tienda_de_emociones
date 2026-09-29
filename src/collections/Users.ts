import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Usuario",
    plural: "Usuarios"
  },
  auth: true,
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: () => false,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user)
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "createdAt"]
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre"
    }
  ]
};
