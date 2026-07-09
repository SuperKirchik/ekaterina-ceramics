import Link from "next/link";
import { Product, formatPrice } from "@/lib/data";
import { fitClamp } from "@/lib/textFit";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group min-w-0">
      <Link className="block min-w-0" href={`/product/${product.slug}`}>
        <div className="product-card-image relative aspect-[4/5] overflow-hidden">
          <img
            alt={product.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            decoding="async"
            loading="lazy"
            src={product.image || "/brand-logo.png"}
          />
        </div>
        <div className="space-y-[clamp(0.4rem,0.7vw,0.8rem)] pt-[clamp(0.75rem,1.1vw,1.2rem)]">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-[clamp(0.7rem,1vw,1.1rem)] gap-y-[clamp(0.35rem,0.6vw,0.7rem)]">
            <div className="min-w-0">
              <h3
                className="product-card-title font-serif leading-tight text-graphite"
                style={fitClamp(product.title, 1.05, 1.12, 1.55)}
              >
                {product.title}
              </h3>
            </div>
            <p className="whitespace-nowrap pt-[clamp(0.15rem,0.3vw,0.35rem)] text-[clamp(0.7rem,0.8vw,0.95rem)] font-medium text-graphite">
              {formatPrice(product.price)}
            </p>
          </div>
          <p className="line-clamp-2 text-[clamp(0.7rem,0.75vw,0.9rem)] leading-[1.25] text-muted-text opacity-0 transition group-hover:opacity-100">
            {product.shortDescription}
          </p>
        </div>
      </Link>
    </article>
  );
}
