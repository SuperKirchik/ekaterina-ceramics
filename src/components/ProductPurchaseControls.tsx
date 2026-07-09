"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";
import { useCart } from "@/lib/cart";

export function ProductPurchaseControls({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const isSold = product.status === "sold";

  function addToCart() {
    if (isSold || added) return;

    addItem(product.id);
    setAdded(true);
  }

  return (
    <div className="mt-9">
      <button
        className="flex h-[clamp(3.2rem,4vw,4.4rem)] w-full items-center justify-center border border-white px-[clamp(1.4rem,2vw,2.4rem)] text-[clamp(0.85rem,0.95vw,1.05rem)] uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-background disabled:cursor-not-allowed disabled:border-white/35 disabled:text-white/45"
        disabled={isSold || added}
        onClick={addToCart}
        type="button"
      >
        {isSold
          ? "Продано"
          : added
            ? "Добавлено"
            : `Добавить в корзину • ${formatPrice(product.price)}`}
      </button>
    </div>
  );
}
