"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Heart, Instagram, Sparkles, Truck } from "lucide-react";
import Image from "next/image";
import { FeedbackForm } from "./feedback-form";
import type { StoreTestimonial } from "@/lib/feedback";

export function Hero() {
  return (
    <section className="hero">
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <span className="eyebrow"><span className="eyebrow-line" /> DETALLES CON SENTIDO</span>
        <h1>Hay cosas que<br />se sienten <em>mejor</em><br />cuando se regalan.</h1>
        <p>Encontrá ese detalle especial para decir<br className="desktop-break" /> lo que a veces las palabras no alcanzan.</p>
        <Link className="button button-default hero-cta" href="/#catalogo">
          Encontrá tu regalo <ArrowRight size={17} />
        </Link>
        <div className="hero-note">
          <span className="hero-note-hearts">♡ &nbsp;♡ &nbsp;♡</span>
          <span>Un regalo, mil maneras de decir te quiero</span>
        </div>
      </motion.div>
      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.12 }}
      >
        <div className="hero-image-wrap">
          <Image
            src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=90"
            alt="Regalos elegidos con cuidado y preparados para sorprender"
            fill
            priority
            sizes="(max-width: 520px) 75vw, (max-width: 760px) 43vw, 36vw"
          />
        </div>
        <div className="hero-sticker"><Heart size={17} fill="currentColor" /><span>hecho con<br />mucho amor</span></div>
        <div className="hero-caption"><span className="caption-dot" /><span>Pequeños detalles,<br />grandes emociones</span></div>
        <div className="hero-scribble" aria-hidden="true">✳</div>
      </motion.div>
      <a href="#catalogo" className="scroll-cue" aria-label="Bajar al catálogo">
        <span>DESCUBRÍ</span><ArrowDown size={15} />
      </a>
    </section>
  );
}

export function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Beneficios de comprar en Tienda de Emociones">
      <div><Heart size={18} /><span>Regalos con intención</span></div>
      <span className="trust-separator" />
      <div><Sparkles size={18} /><span>Preparados con amor</span></div>
      <span className="trust-separator" />
      <div><Truck size={19} /><span>Envíos a todo el país</span></div>
    </section>
  );
}

export function OurStory() {
  return (
    <section className="story" id="nuestra-historia">
      <motion.div
        className="story-art"
        initial={{ opacity: 0, x: -18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1000&q=85"
          alt="Flores elegidas para preparar un regalo especial"
          fill
          sizes="(max-width: 520px) 80vw, 36vw"
        />
        <span className="story-seal"><Heart size={19} fill="currentColor" /> con amor</span>
      </motion.div>
      <div className="story-copy">
        <span className="eyebrow"><span className="eyebrow-line" /> DETRÁS DE CADA DETALLE</span>
        <h2>Creemos en el poder de <em>hacer sentir.</em></h2>
        <p>
          Tienda de Emociones nació de una idea simple: los mejores regalos no
          son cosas, son maneras de estar cerca. Por eso armamos cada detalle
          pensando en la historia que va a contar.
        </p>
        <p className="story-signature">Con cariño, Tienda de Emociones <Heart size={15} /></p>
      </div>
    </section>
  );
}

export function CustomerFeedback({ testimonials }: { testimonials: StoreTestimonial[] }) {
  return (
    <section className="feedback-section section-wrap" id="opiniones">
      <div className="section-heading">
        <div>
          <span className="eyebrow"><span className="eyebrow-line" /> PALABRAS QUE NOS ABRAZAN</span>
          <h2>Regalos que llegan <em>al corazón.</em></h2>
          <p>Opiniones de quienes ya regalaron un poquito de emoción.</p>
        </div>
      </div>
      {testimonials.length > 0 ? (
        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <figure className="testimonial-card" key={testimonial.id}>
              <span className="testimonial-stars" aria-label={`${testimonial.rating} de 5 estrellas`}>
                {"★".repeat(testimonial.rating)}{"☆".repeat(5 - testimonial.rating)}
              </span>
              <blockquote>“{testimonial.message}”</blockquote>
              <figcaption>
                <span className="testimonial-avatar">{testimonial.name.slice(0, 1).toLocaleUpperCase("es")}</span>
                <span><strong>{testimonial.name}</strong><small>Opinión compartida con autorización</small></span>
                <Heart size={16} aria-hidden="true" />
              </figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="feedback-empty">
          <span className="feedback-empty-mark"><Heart size={18} /></span>
          <p>¡Estamos esperando la primera! Cuando recibamos una opinión, la vas a encontrar acá.</p>
        </div>
      )}
      <FeedbackForm />
    </section>
  );
}

export function FollowUs() {
  return (
    <section className="newsletter">
      <div className="newsletter-sparkle sparkle-one" aria-hidden="true">✳</div>
      <div className="newsletter-sparkle sparkle-two" aria-hidden="true">✳</div>
      <span className="eyebrow">UN POQUITO DE ALEGRÍA EN TU INBOX</span>
      <h2>Las cosas lindas<br />también se <em>comparten.</em></h2>
      <p>Seguinos y enterate de las novedades, ideas y detalles que vamos preparando.</p>
      <a className="button button-light" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
        <Instagram size={17} /> Seguinos en Instagram
      </a>
    </section>
  );
}

export function StoreFooter() {
  return (
    <footer className="site-footer" id="contacto">
      <div className="footer-main">
        <Link className="brand footer-brand" href="/" aria-label="Tienda de Emociones, inicio">
          <span className="brand-logo brand-logo-footer">
            <Image src="/images/logo.jpeg" alt="" width={58} height={58} />
          </span>
          <span className="brand-copy">
            <span className="brand-name">tienda de emociones</span>
            <span className="brand-tagline">regalos que dicen lo que sentís</span>
          </span>
        </Link>
        <p>Un detalle puede cambiarlo todo.<br />Gracias por elegirnos para estar cerca.</p>
        <div className="footer-links">
          <Link className="footer-feedback-link" href="/#opiniones">Dejanos tu opinión</Link>
          <Link className="footer-feedback-link" href="/admin">Administración</Link>
          <a className="footer-social" href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            <Instagram size={17} /> Instagram
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Tienda de Emociones.</span>
        <span>Regalos con intención, desde Argentina ♡</span>
        <a
          className="footer-powa"
          href="https://www.agenciadigitalpowa.com.ar"
          target="_blank"
          rel="noreferrer"
          aria-label="Desarrollo Digital Powa"
        >
          <span className="footer-powa-label">Desarrollo Digital</span>
          <span className="footer-powa-brand">
            <Image
              src="/images/logo-powa.png"
              alt="Powa"
              width={90}
              height={32}
              className="footer-powa-logo"
            />
          </span>
        </a>
      </div>
    </footer>
  );
}

export function FloatingCartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button className="floating-cart" onClick={onClick} aria-label={`Abrir carrito, ${count} productos`}>
      <span className="floating-cart-icon"><Heart size={18} /></span>
      <span>Carrito</span>
      <b>{count}</b>
    </button>
  );
}
