export const siteConfig = {
  name: "Tienda de Emociones",
  title: "Tienda de Emociones — regalos que dicen lo que sentís",
  description:
    "Regalos con intención para acompañar cada emoción. Encontrá ese detalle especial para decir lo que a veces las palabras no alcanzan.",
  keywords: [
    "regalos personalizados",
    "regalos para parejas",
    "regalos para cumpleaños",
    "detalle emocional",
    "regalos en Argentina",
    "Tienda de Emociones"
  ]
};

export function getSiteURL() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteURL()).toString();
}
