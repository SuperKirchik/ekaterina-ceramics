"use client";

import { useState } from "react";

export function ContactForm() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      className="col-span-7 grid grid-cols-2 gap-[clamp(0.9rem,1.35vw,1.4rem)] rounded-lg bg-surface p-[clamp(1.4rem,2vw,2.4rem)]"
      onSubmit={async (event) => {
        event.preventDefault();
        setSending(true);
        setSent(false);
        setError("");

        const form = event.currentTarget;
        const formData = new FormData(form);

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.get("name"),
              contact: formData.get("contact"),
              message: formData.get("message"),
            }),
          });

          const result = await response.json().catch(() => ({}));

          if (!response.ok) {
            throw new Error(result.message || "Не получилось отправить сообщение.");
          }

          form.reset();
          setSent(true);
        } catch (requestError) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Не получилось отправить сообщение.",
          );
        } finally {
          setSending(false);
        }
      }}
    >
      <label className="text-sm text-muted-text">
        Имя
        <input
          className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-graphite outline-none focus:border-clay"
          name="name"
          required
        />
      </label>
      <label className="text-sm text-muted-text">
        Телефон или email
        <input
          className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-graphite outline-none focus:border-clay"
          name="contact"
          required
        />
      </label>
      <label className="col-span-2 text-sm text-muted-text">
        Сообщение
        <textarea
          className="mt-2 min-h-40 w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-graphite outline-none focus:border-clay"
          name="message"
          required
        />
      </label>
      <button
        className="rounded-full bg-graphite px-6 py-3 text-sm font-medium text-surface transition hover:bg-clay disabled:cursor-wait disabled:opacity-60"
        disabled={sending}
        type="submit"
      >
        {sending ? "Отправляем..." : "Отправить сообщение"}
      </button>
      <div className="col-span-2 min-h-6 text-sm">
        {sent ? <p className="text-graphite">Сообщение отправлено.</p> : null}
        {error ? <p className="text-red-600">{error}</p> : null}
      </div>
    </form>
  );
}
