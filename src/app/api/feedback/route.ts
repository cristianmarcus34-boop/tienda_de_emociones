import { NextResponse } from "next/server";
import { z } from "zod";
import { getPayload } from "payload";
import config from "@payload-config";

export const runtime = "nodejs";

const feedbackSchema = z.object({
  name: z.string().trim().min(2, "Escribí tu nombre.").max(60),
  message: z.string().trim().min(12, "Contanos un poquito más.").max(500),
  rating: z.number().int().min(1).max(5),
  consent: z.literal(true),
  website: z.string().max(0).optional()
});

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.PAYLOAD_SECRET) {
    return NextResponse.json(
      { error: "El formulario de opiniones todavía no está configurado." },
      { status: 503 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_000) {
    return NextResponse.json({ error: "El mensaje supera el tamaño permitido." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "No pudimos leer el formulario." }, { status: 400 });
  }

  const parsed = feedbackSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Revisá los datos del formulario." },
      { status: 400 }
    );
  }

  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "feedback",
      overrideAccess: true,
      data: {
        name: parsed.data.name,
        message: parsed.data.message,
        rating: parsed.data.rating,
        consent: true,
        status: "pending"
      }
    });

    return NextResponse.json(
      { message: "¡Gracias por compartir tu opinión! El equipo la revisará antes de publicarla." },
      { status: 201 }
    );
  } catch (error) {
    console.error("No se pudo guardar la opinión:", error);
    return NextResponse.json(
      { error: "No pudimos guardar tu opinión. Intentá de nuevo en un ratito." },
      { status: 500 }
    );
  }
}
