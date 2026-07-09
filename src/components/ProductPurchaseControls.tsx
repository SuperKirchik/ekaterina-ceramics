"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/lib/cart";

export function ProductPurchaseControls({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const isSold = product.status === "sold";

  function addToCart() {
    if (isSold) return;

    Array.from({ length: quantity }).forEach(() => addItem(product.id));
  }

  return (
    <div className="mt-9 space-y-5">
      <div className="inline-flex h-12 items-center border border-white/45 text-white">
        <button
          aria-label="Уменьшить количество"
          className="flex h-full w-12 items-center justify-center transition hover:bg-white/10 disabled:opacity-35"
          disabled={quantity <= 1}
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          type="button"
        >
          <Minus size={15} />
        </button>
        <span className="w-12 text-center text-sm">{quantity}</span>
        <button
          aria-label="Увеличить количество"
          className="flex h-full w-12 items-center justify-center transition hover:bg-white/10"
          onClick={() => setQuantity((current) => current + 1)}
          type="button"
        >
          <Plus size={15} />
        </button>
      </div>

      <button
        className="flex h-[clamp(3.2rem,4vw,4.4rem)] w-full items-center justify-center border border-white px-[clamp(1.4rem,2vw,2.4rem)] text-[clamp(0.85rem,0.95vw,1.05rem)] uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-background disabled:cursor-not-allowed disabled:border-white/35 disabled:text-white/45"
        disabled={isSold}
        onClick={addToCart}
        type="button"
      >
        {isSold
          ? "Продано"
          : `Добавить в корзину • ${formatPrice(product.price * quantity)}`}
      </button>
    </div>
  );
}
