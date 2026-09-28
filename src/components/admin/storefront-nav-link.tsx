"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

export function StorefrontNavLink() {
  return (
    <>
      <Link
        href="/"
        style={{
          display: "block",
          margin: "0.75rem 0 1rem",
          padding: "0.65rem 0.8rem",
          border: "1px solid var(--theme-elevation-150)",
          borderRadius: "3px",
          color: "var(--theme-text)",
          fontSize: "0.875rem",
          fontWeight: 600,
          textDecoration: "none"
        }}
      >
        ← Ver tienda
      </Link>
      <Link
        href="/admin/logout"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          margin: "0.75rem 0 1rem",
          padding: "0.65rem 0.8rem",
          border: "1px solid var(--theme-elevation-150)",
          borderRadius: "3px",
          color: "var(--theme-text)",
          fontSize: "0.875rem",
          fontWeight: 600,
          textDecoration: "none"
        }}
      >
        <LogOut size={16} aria-hidden="true" />
        Cerrar sesión
      </Link>
    </>
  );
}

export function BackToStoreLink() {
  return (
    <Link
      href="/"
      style={{
        display: "block",
        margin: "0.75rem 0 1rem",
        padding: "0.65rem 0.8rem",
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "3px",
        color: "var(--theme-text)",
        fontSize: "0.875rem",
        fontWeight: 600,
        textDecoration: "none"
      }}
    >
      ← Volver a la tienda
    </Link>
  );
}
