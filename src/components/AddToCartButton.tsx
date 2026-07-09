"use client";

import { ShoppingBag } from "lucide-react";
import { Product } from "@/lib/data";
import { useCart } from "@/lib/cart";

export function AddToCartButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const isSold = product.status === "sold";

  return (
    <a
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition ${
        isSold
          ? "border-stone/50 bg-surface text-muted-text"
          : "border-graphite bg-graphite text-surface hover:-translate-y-0.5 hover:bg-clay"
      } ${className}`}
      href={`/cart?add=${product.id}`}
      onClick={() => addItem(product.id)}
    >
      <ShoppingBag size={17} />
      {isSold ? "Заказать похожее" : "Добавить в корзину"}
    </a>
  );
}
