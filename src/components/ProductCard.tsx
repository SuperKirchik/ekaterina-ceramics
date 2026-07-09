import Link from "next/link";
import type { CSSProperties } from "react";
import { Product, formatPrice } from "@/lib/data";
import { fitClamp } from "@/lib/textFit";

export function ProductCard({ product }: { product: Product }) {
  const images = [product.image, ...product.gallery].filter(Boolean);
  const slides = images.length > 0 ? images : ["/brand-logo.png"];
  const slideStyle = { "--slide-count": slides.length } as CSSProperties;

  return (
    <article className="group min-w-0">
      <Link className="block min-w-0" href={`/product/${product.slug}`}>
        <div className="product-card-image relative aspect-square overflow-hidden" style={slideStyle}>
          {slides.map((image, index) => (
            <img
              alt={product.title}
              className="product-card-slide absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              decoding="async"
              key={`${image}-${index}`}
              loading="lazy"
              src={image}
              style={{ "--slide-index": index } as CSSProperties}
            />
          ))}
          {slides.length > 1 && (
            <div className="product-card-stories pointer-events-none absolute left-3 right-3 top-3 z-10 hidden gap-1">
              {slides.map((image, index) => (
                <span
                  className="product-card-story h-px flex-1 overflow-hidden bg-white/35"
                  key={`${image}-bar-${index}`}
                  style={{ "--slide-index": index } as CSSProperties}
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-card-meta pt-[clamp(0.35rem,0.55vw,0.65rem)]">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-[clamp(0.7rem,1vw,1.1rem)] gap-y-[clamp(0.35rem,0.6vw,0.7rem)]">
            <div className="min-w-0">
              <h3
                className="product-card-title font-serif leading-tight text-graphite"
                style={fitClamp(product.title, 1.05, 1.12, 1.55)}
              >
                {product.title}
              </h3>
              <p className="product-card-description mt-[clamp(0.35rem,0.55vw,0.65rem)] line-clamp-2 text-[clamp(0.9rem,1vw,1.18rem)] leading-[1.25] text-muted-text">
                {product.shortDescription}
              </p>
            </div>
            <p className="product-card-price whitespace-nowrap pt-[clamp(0.15rem,0.3vw,0.35rem)] font-medium text-graphite">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
