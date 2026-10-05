import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { StoreFooter } from "@/components/store/sections";
import { StoreSEO } from "@/components/store/seo";
import { StoreShell } from "@/components/store/store-shell";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "../../app/globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: "%s | Tienda de Emociones"
  },
  description: siteConfig.description,
  applicationName: "Tienda de Emociones",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: absoluteUrl("/"),
    siteName: "Tienda de Emociones",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: absoluteUrl("/images/logo.jpeg"),
        width: 512,
        height: 512,
        alt: "Tienda de Emociones"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [absoluteUrl("/images/logo.jpeg")]
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
        <StoreSEO />
        <StoreShell>
          {children}
          <StoreFooter />
        </StoreShell>
        <Analytics />
      </body>
    </html>
  );
}
