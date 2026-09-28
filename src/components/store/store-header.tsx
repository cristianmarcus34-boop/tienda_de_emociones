"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "./cart-context";
import { CartDrawer } from "./cart-drawer";
import { FloatingCartButton } from "./sections";

export function StoreHeader() {
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") ?? "").trim();
    router.push(query ? `/?q=${encodeURIComponent(query)}#catalogo` : "/#catalogo");
    setSearchOpen(false);
  }

  function scrollToCatalog() {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#catalogo");
    }
  }

  return (
    <>
      <div className="announcement">
        <Heart size={13} aria-hidden="true" />
        Envíos a todo el país · Cada regalo preparado con amor
        <Heart size={13} aria-hidden="true" />
      </div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Tienda de Emociones, inicio">
          <span className="brand-logo">
            <Image src="/images/logo.jpeg" alt="" width={52} height={52} priority />
          </span>
          <span className="brand-copy">
            <span className="brand-name">tienda de emociones</span>
            <span className="brand-tagline">regalos que dicen lo que sentís</span>
          </span>
        </Link>
        <nav className={`main-nav ${mobileMenuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
          <button className="nav-link" onClick={scrollToCatalog}>Tienda</button>
          <Link className="nav-link" href="/#nuestra-historia" onClick={() => setMobileMenuOpen(false)}>Nuestra historia</Link>
          <Link className="nav-link" href="/#opiniones" onClick={() => setMobileMenuOpen(false)}>Opiniones</Link>
          <Link className="nav-link" href="/#contacto" onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button search-toggle"
            aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar regalos"}
            onClick={() => setSearchOpen((open) => !open)}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito, ${count} productos`}>
            <ShoppingBag size={19} strokeWidth={1.8} />
            <span className="cart-label">Mi carrito</span>
            <span className="cart-count">{count}</span>
          </button>
          <button
            className="icon-button menu-toggle"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>
      <AnimatePresence>
        {searchOpen && (
          <motion.form
            className="search-bar"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={search}
          >
            <Search size={19} aria-hidden="true" />
            <input
              name="q"
              defaultValue=""
              placeholder="¿Qué emoción querés regalar?"
              aria-label="Buscar en el catálogo"
              autoFocus
            />
            <button className="search-submit" type="submit" aria-label="Buscar">
              <Search size={17} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <FloatingCartButton count={count} onClick={() => setCartOpen(true)} />
    </>
  );
}
