import type { MetadataRoute } from "next";
import { getSiteURL } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  const siteURL = getSiteURL().replace(/\/$/, "");

  return {
    name: "Tienda de Emociones",
    short_name: "Tienda de Emociones",
    description: "Regalos con intención para acompañar cada emoción.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf4",
    theme_color: "#fffaf4",
    lang: "es-AR",
    orientation: "portrait",
    icons: [
      {
        src: `${siteURL}/images/logo.jpeg`,
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable"
      }
    ]
  };
}
