import { getPayload } from "payload";
import config from "@payload-config";

export type StoreTestimonial = {
  id: string;
  name: string;
  message: string;
  rating: number;
};

export async function getPublishedFeedback(): Promise<StoreTestimonial[]> {
  if (!process.env.DATABASE_URL) return [];

  try {
    const payload = await getPayload({ config });
    const result = await payload.find({
      collection: "feedback",
      where: { status: { equals: "published" } },
      limit: 6,
      sort: "-createdAt"
    });

    return result.docs.map((entry) => ({
      id: String(entry.id),
      name: entry.name,
      message: entry.message,
      rating: entry.rating
    }));
  } catch (error) {
    console.error(
      "No se pudieron cargar las opiniones publicadas. Revisá la conexión y que el esquema de Payload esté actualizado:",
      error
    );
    return [];
  }
}
