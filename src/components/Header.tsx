"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";

const nav = [
  ["Главная", "/"],
  ["Каталог", "/catalog"],
  ["Коллекции", "/collections"],
  ["Доставка", "/delivery"],
  ["Контакты", "/contacts"],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count } = useCart();
  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-[clamp(0.65rem,2.2vw,2.5rem)] px-[clamp(0.9rem,2.8vw,2.5rem)] py-[clamp(0.75rem,1.1vw,1rem)]">
        <Link className="block shrink-0" href="/">
          <img
            alt="Екатерина Дроздова"
            className="h-auto w-[clamp(8.2rem,16vw,17.5rem)] object-contain"
            src="/brand-logo.png"
          />
        </Link>

        <nav className="site-nav flex min-w-0 items-center gap-[clamp(0.55rem,2vw,2rem)] text-[clamp(1.15rem,1.25vw,1.38rem)] text-graphite">
          {nav.map(([label, href]) => (
            <Link
              className={`chalk-link ${isActive(href) ? "is-active" : ""}`}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
          <Link
            className="inline-flex items-center gap-[clamp(0.25rem,0.7vw,0.7rem)] rounded-full border border-white/60 px-[clamp(0.65rem,1.35vw,1.35rem)] py-[clamp(0.45rem,0.75vw,0.75rem)] text-white transition hover:border-white"
            href="/cart"
          >
            <ShoppingBag size={17} />
            <span>{count}</span>
          </Link>
        </nav>

        <button
          aria-label="Открыть меню"
          className="menu-toggle hidden h-[clamp(3rem,4vw,3.7rem)] w-[clamp(3rem,4vw,3.7rem)] items-center justify-center rounded-full border border-white/60 text-white"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="mobile-panel bg-surface px-[clamp(1.25rem,2.8vw,2.5rem)] py-[clamp(1.2rem,2vw,2rem)]">
          <nav className="flex flex-col gap-[clamp(0.8rem,1.4vw,1.4rem)] text-[clamp(1.2rem,1.6vw,1.6rem)] text-graphite">
            {nav.map(([label, href]) => (
              <Link
                className={`chalk-link ${isActive(href) ? "is-active" : ""}`}
                href={href}
                key={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              className="inline-flex items-center gap-2"
              href="/cart"
              onClick={() => setOpen(false)}
            >
              <ShoppingBag size={18} /> Корзина ({count})
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
