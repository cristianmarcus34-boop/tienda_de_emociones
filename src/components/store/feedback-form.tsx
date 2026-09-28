"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Heart, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState(null);
    setSubmitting(true);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") ?? ""),
          message,
          rating,
          consent: data.get("consent") === "on",
          website: String(data.get("website") ?? "")
        })
      });
      const result: unknown = await response.json();
      if (!response.ok || !isResponseMessage(result) || !("message" in result)) {
        throw new Error(
          isResponseMessage(result) && "error" in result
            ? result.error
            : "No pudimos enviar tu opinión. Intentá nuevamente."
        );
      }
      form.reset();
      setMessage("");
      setRating(5);
      setState({ type: "success", message: result.message });
    } catch (error) {
      setState({
        type: "error",
        message: error instanceof Error ? error.message : "Ocurrió un error al enviar tu opinión."
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="feedback-form-wrap">
      <div className="feedback-form-heading">
        <span className="feedback-form-icon"><Heart size={17} /></span>
        <div>
          <h3>¿Ya regalaste algo lindo?</h3>
          <p>Contanos cómo te fue. Tu opinión puede inspirar a alguien más.</p>
        </div>
      </div>
      <form className="feedback-form" onSubmit={submit}>
        <label className="feedback-label" htmlFor="feedback-name">Tu nombre</label>
        <input
          className="form-input"
          id="feedback-name"
          name="name"
          autoComplete="given-name"
          maxLength={60}
          required
          minLength={2}
          placeholder="¿Cómo te llamamos?"
        />
        <label className="feedback-label">¿Cuántas estrellas nos regalás?</label>
        <div className="rating-picker" role="radiogroup" aria-label="Calificación">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} ${value === 1 ? "estrella" : "estrellas"}`}
              className={`rating-star ${value <= rating ? "selected" : ""}`}
              onClick={() => setRating(value)}
            >
              ★
            </button>
          ))}
        </div>
        <label className="feedback-label" htmlFor="feedback-message">Tu opinión</label>
        <textarea
          className="form-input feedback-textarea"
          id="feedback-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={500}
          minLength={12}
          required
          placeholder="¿Qué te gustó del regalo o de la experiencia?"
        />
        <span className="character-count">{message.length}/500</span>
        <label className="feedback-consent">
          <input type="checkbox" name="consent" required />
          <span>Autorizo a Tienda de Emociones a mostrar mi opinión en su tienda.</span>
        </label>
        <div className="feedback-honeypot" aria-hidden="true">
          <label htmlFor="feedback-website">Dejá vacío este campo</label>
          <input id="feedback-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        {state && (
          <p className={`feedback-status ${state.type}`} role="status" aria-live="polite">
            {state.message}
          </p>
        )}
        <Button className="feedback-submit" type="submit" disabled={submitting}>
          {submitting ? <><LoaderCircle size={16} className="loading-icon" /> Enviando…</> : <>Enviar mi opinión <ArrowRight size={16} /></>}
        </Button>
        <small className="feedback-privacy">Tu opinión queda pendiente de revisión antes de publicarse.</small>
      </form>
    </div>
  );
}

function isResponseMessage(value: unknown): value is { message: string } | { error: string } {
  return typeof value === "object" && value !== null && (
    ("message" in value && typeof value.message === "string") ||
    ("error" in value && typeof value.error === "string")
  );
}
