import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { StoreFooter } from "@/components/store/sections";
import { StoreShell } from "@/components/store/store-shell";
import "../../app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tienda de Emociones — regalos que dicen lo que sentís",
    template: "%s | Tienda de Emociones"
  },
  description: "Regalos con intención para acompañar cada emoción. Encontrá ese detalle especial para decir lo que a veces las palabras no alcanzan.",
  applicationName: "Tienda de Emociones",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Tienda de Emociones",
    title: "Tienda de Emociones — regalos que dicen lo que sentís",
    description: "Regalos con intención para acompañar cada emoción."
  },
  icons: {
    icon: [{ url: "/images/logo.jpeg", type: "image/jpeg" }],
    apple: [{ url: "/images/logo.jpeg", type: "image/jpeg" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#fffaf4",
  colorScheme: "light"
};

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-AR">
      <body>
        <StoreShell>
          {children}
          <StoreFooter />
        </StoreShell>
        <Analytics />
      </body>
    </html>
  );
}
