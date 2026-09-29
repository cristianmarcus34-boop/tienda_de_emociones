import type { CollectionConfig } from "payload";
import { put, del } from "@vercel/blob";

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
    disableLocalStorage: true,
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 400, fit: "cover" },
      { name: "card", width: 900, height: 900, fit: "cover" }
    ]
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation !== "create") return doc;
        if (!req.file) return doc;

        const objectKey = (doc as unknown as { _objectKey?: string | null })._objectKey;
        if (objectKey) return doc;

        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (!token) {
          req.payload.logger.error(
            "[Media] BLOB_READ_WRITE_TOKEN no está definido; no se puede subir a Blob."
          );
          return doc;
        }

        try {
          // Convertir Buffer → Uint8Array → Blob (Buffer no es BodyInit)
          const bytes = new Uint8Array(req.file.data);
          const blobFile = new Blob([bytes], {
            type: req.file.mimetype ?? "application/octet-stream"
          });

          const blob = await put(doc.filename ?? req.file.name, blobFile, {
            access: "public",
            token,
            addRandomSuffix: true,
            contentType: req.file.mimetype ?? undefined
          });

          const updated = await req.payload.update({
            collection: "media",
            id: doc.id,
            data: {
              url: blob.url,
              _objectKey: blob.pathname
            } as never,
            req
          });

          req.payload.logger.info(`[Media] Subido a Blob: ${blob.url}`);

          return updated;
        } catch (err) {
          req.payload.logger.error(
            `[Media] Error subiendo a Blob: ${(err as Error).message}`
          );
          return doc;
        }
      }
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        const objectKey = (doc as unknown as { _objectKey?: string | null })._objectKey;
        if (!token || !objectKey) return;

        try {
          await del(objectKey, { token });
          req.payload.logger.info(`[Media] Borrado de Blob: ${objectKey}`);
        } catch (err) {
          req.payload.logger.error(
            `[Media] Error borrando de Blob: ${(err as Error).message}`
          );
        }
      }
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