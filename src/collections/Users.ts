import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Usuario",
    plural: "Usuarios"
  },
  auth: true,
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
