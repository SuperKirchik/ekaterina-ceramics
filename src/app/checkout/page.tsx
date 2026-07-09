"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/data";

export default function CheckoutPage() {
  const { detailedItems, total, clear } = useCart();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (sent) {
    return (
      <section className="container-page py-16">
        <div className="max-w-2xl rounded-lg bg-surface p-10">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-text">
            Спасибо
          </p>
          <h1 className="mt-4 font-serif text-6xl text-graphite">
            Ваш заказ принят
          </h1>
          <p className="mt-6 leading-8 text-muted-text">
            Мы свяжемся с вами для подтверждения деталей, оплаты и доставки.
          </p>
          <Link className="mt-8 inline-flex rounded-full bg-graphite px-6 py-3 text-sm text-surface" href="/catalog">
            Вернуться в каталог
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page py-[clamp(3.5rem,5vw,6rem)]">
      <h1 className="font-serif text-graphite">
        Оформление заказа
      </h1>
      <div className="mt-[clamp(2rem,3.5vw,4rem)] grid grid-cols-[1fr_minmax(22rem,30rem)] gap-[clamp(1.5rem,2.6vw,3rem)]">
        <form
          className="grid grid-cols-2 gap-[clamp(0.9rem,1.35vw,1.4rem)] rounded-lg bg-surface p-[clamp(1.4rem,2vw,2.4rem)]"
          onSubmit={async (event) => {
            event.preventDefault();
            setSending(true);
            setError("");

            const formData = new FormData(event.currentTarget);

            try {
              const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: formData.get("name"),
                  phone: formData.get("phone"),
                  email: formData.get("email"),
                  city: formData.get("city"),
                  address: formData.get("address"),
                  comment: formData.get("comment"),
                  contactMethod: formData.get("contactMethod"),
                  items: detailedItems.map(({ product, quantity }) => ({
                    title: product.title,
                    slug: product.slug,
                    category: product.category,
                    price: product.price,
                    quantity,
                  })),
                }),
              });

              const result = await response.json().catch(() => ({}));

              if (!response.ok) {
                throw new Error(result.message || "Не получилось отправить заказ.");
              }

              clear();
              setSent(true);
            } catch (requestError) {
              setError(
                requestError instanceof Error
                  ? requestError.message
                  : "Не получилось отправить заказ.",
              );
            } finally {
              setSending(false);
            }
          }}
        >
          {[
            ["Имя", "name", "text"],
            ["Телефон", "phone", "tel"],
            ["Email", "email", "email"],
            ["Город", "city", "text"],
          ].map(([label, name, type]) => (
            <label className="text-sm text-muted-text" key={name}>
              {label}
              <input required className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-graphite outline-none focus:border-clay" name={name} type={type} />
            </label>
          ))}
          <label className="col-span-2 text-sm text-muted-text">
            Адрес доставки
            <input className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-graphite outline-none focus:border-clay" name="address" />
          </label>
          <label className="col-span-2 text-sm text-muted-text">
            Комментарий
            <textarea className="mt-2 min-h-32 w-full rounded-lg border border-border bg-background px-4 py-3 text-graphite outline-none focus:border-clay" name="comment" />
          </label>
          <label className="text-sm text-muted-text">
            Удобный способ связи
            <select className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-graphite outline-none focus:border-clay" name="contactMethod">
              <option>Телефон</option>
              <option>Email</option>
              <option>Telegram</option>
              <option>WhatsApp</option>
            </select>
          </label>
          <button
            className="self-end rounded-full bg-graphite px-[clamp(1.4rem,2vw,2.4rem)] py-[clamp(0.8rem,1vw,1.1rem)] text-[clamp(0.85rem,0.95vw,1.1rem)] font-medium text-surface transition hover:bg-clay disabled:cursor-wait disabled:opacity-60"
            disabled={sending || detailedItems.length === 0}
            type="submit"
          >
            {sending ? "Отправляем..." : "Отправить заказ"}
          </button>
          {error ? <p className="col-span-2 text-sm text-red-600">{error}</p> : null}
        </form>

        <aside className="h-fit rounded-lg bg-surface p-6">
          <h2 className="font-serif text-3xl text-graphite">Ваши предметы</h2>
          <div className="mt-5 space-y-4">
            {detailedItems.length > 0 ? (
              detailedItems.map(({ product, quantity }) => (
                <div className="flex justify-between gap-4 text-sm" key={product.id}>
                  <span className="text-muted-text">
                    {product.title} x {quantity}
                  </span>
                  <span className="text-graphite">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-text">Корзина пустая.</p>
            )}
          </div>
          <div className="mt-6 flex justify-between border-t border-border pt-5">
            <span>Итого</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
