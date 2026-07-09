"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/data";
import { fitClamp } from "@/lib/textFit";

export default function CartPage() {
  return (
    <Suspense fallback={<section className="container-page py-12">Корзина</section>}>
      <CartContent />
    </Suspense>
  );
}

function CartContent() {
  const searchParams = useSearchParams();
  const addProductId = searchParams.get("add");
  const { addItem, detailedItems, removeItem, setQuantity } = useCart();
  const displayItems = detailedItems;
  const total = displayItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  useEffect(() => {
    if (!addProductId) return;

    const alreadyAdded = detailedItems.some(
      (item) => item.product.id === addProductId,
    );

    if (!alreadyAdded) addItem(addProductId);
  }, [addItem, addProductId, detailedItems]);

  return (
    <section className="container-page py-[clamp(3.5rem,5vw,6rem)]">
      <h1 className="font-serif text-graphite">Корзина</h1>
      {displayItems.length === 0 ? (
        <div className="mt-10 rounded-lg bg-surface p-10">
          <p className="text-muted-text">В корзине пока нет предметов.</p>
          <Link className="mt-6 inline-flex rounded-full bg-graphite px-6 py-3 text-sm text-surface" href="/catalog">
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <div className="mt-[clamp(2rem,3.5vw,4rem)] grid grid-cols-[1fr_minmax(22rem,28rem)] gap-[clamp(1.5rem,2.6vw,3rem)]">
          <div className="space-y-4">
            {displayItems.map(({ product, quantity }) => (
              <article className="grid grid-cols-[minmax(8rem,11rem)_1fr_auto] gap-[clamp(0.9rem,1.4vw,1.6rem)] rounded-lg bg-surface p-[clamp(0.9rem,1.3vw,1.4rem)]" key={product.id}>
                <img
                  alt={product.title}
                  className="aspect-square object-cover"
                  src={product.image}
                />
                <div>
                  <h2
                    className="font-serif text-3xl text-graphite"
                    style={fitClamp(product.title, 1.35, 2.2, 2.85)}
                  >
                    {product.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-text">{product.category}</p>
                  <p className="mt-4 font-medium text-graphite">
                    {formatPrice(product.price)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between gap-[clamp(0.7rem,1vw,1.1rem)]">
                  <div className="inline-flex items-center rounded-full border border-border">
                    <button className="p-3" onClick={() => setQuantity(product.id, quantity - 1)} type="button">
                      <Minus size={15} />
                    </button>
                    <span className="min-w-8 text-center text-sm">{quantity}</span>
                    <button className="p-3" onClick={() => setQuantity(product.id, quantity + 1)} type="button">
                      <Plus size={15} />
                    </button>
                  </div>
                  <button className="inline-flex items-center gap-2 text-sm text-muted-text hover:text-clay" onClick={() => removeItem(product.id)} type="button">
                    <Trash2 size={16} /> Удалить
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="h-fit rounded-lg bg-surface p-6">
            <div className="flex items-center justify-between border-b border-border pb-5">
              <span className="text-muted-text">Итого</span>
              <span className="text-2xl font-medium text-graphite">
                {formatPrice(total)}
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted-text">
              После оформления заказа мы свяжемся с вами для подтверждения
              деталей, оплаты и бережной доставки.
            </p>
            <Link className="mt-6 inline-flex w-full justify-center rounded-full bg-graphite px-6 py-3 text-sm font-medium text-surface transition hover:bg-clay" href="/checkout">
              Оформить заказ
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
