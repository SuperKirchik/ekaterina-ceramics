"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/data";

type CatalogClientProps = {
  categories: string[];
  products: Product[];
};

const allCategory = "Все товары";

export function CatalogClient({ categories, products }: CatalogClientProps) {
  const [category, setCategory] = useState(allCategory);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryOptions = useMemo(
    () => [allCategory, ...categories.filter((entry) => entry !== "Все")],
    [categories],
  );

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (product) => category === allCategory || product.category === category,
      ),
    [category, products],
  );

  function chooseCategory(nextCategory: string) {
    setCategory(nextCategory);
    setFiltersOpen(false);
  }

  const categoryList = (
    <>
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-graphite">
        Категории
      </p>
      <div className="space-y-4">
        {categoryOptions.map((entry) => {
          const active = entry === category;

          return (
            <button
              className="block w-full text-left text-sm uppercase tracking-[0.22em] text-graphite transition hover:text-white"
              key={entry}
              onClick={() => chooseCategory(entry)}
              type="button"
            >
              <span className={`chalk-link ${active ? "is-active" : ""}`}>
                {entry}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="catalog-layout grid grid-cols-12 gap-[clamp(0.75rem,1.3vw,1.5rem)]">
      <aside className="catalog-sidebar col-span-3 pt-[clamp(0.6rem,1vw,1rem)]">
        <p className="mb-[clamp(2rem,3vw,3.5rem)] text-[clamp(1.35rem,1.65vw,2rem)] uppercase tracking-[0.24em] text-muted-text">
          Каталог
        </p>
        {categoryList}
      </aside>

      <div className="catalog-main col-span-9">
        <div className="catalog-mobile-bar mb-[clamp(1.2rem,2vw,2rem)] hidden items-center justify-between border-y border-white/35 py-[clamp(0.8rem,1.2vw,1.2rem)]">
          <button
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-graphite transition hover:text-white"
            onClick={() => setFiltersOpen(true)}
            type="button"
          >
            Категории
            <SlidersHorizontal size={17} />
          </button>
          <p className="text-xs uppercase tracking-[0.22em] text-muted-text">
            {visibleProducts.length} работ
          </p>
        </div>

        <div
          className={`fixed inset-0 z-50 bg-black/25 transition ${
            filtersOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          onClick={() => setFiltersOpen(false)}
        />
        <aside
          className={`fixed bottom-0 left-0 top-0 z-50 w-[min(86vw,360px)] border-r border-white/35 bg-background px-7 py-8 shadow-2xl transition-transform duration-300 ${
            filtersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/35 pb-6">
            <button
              className="inline-flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.28em] text-graphite"
              onClick={() => setFiltersOpen(false)}
              type="button"
            >
              Скрыть
              <X size={17} />
            </button>
          </div>

          <div className="mt-7">{categoryList}</div>
        </aside>

        <div className="catalog-products grid grid-cols-2 gap-x-[clamp(1rem,1.8vw,2rem)] gap-y-[clamp(2rem,3vw,3.5rem)]">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
