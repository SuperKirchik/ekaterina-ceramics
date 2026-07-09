import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPurchaseControls } from "@/components/ProductPurchaseControls";
import { formatPrice } from "@/lib/data";
import { getProductBySlug, getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getProducts().map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return {
    title: product
      ? `${product.title} - Екатерина Дроздова`
      : "Товар - Екатерина Дроздова",
    description: product?.shortDescription,
    openGraph: {
      images: product ? [product.image] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const images = [product.image, ...product.gallery].filter(Boolean);
  const collectionProducts = getProducts()
    .filter(
      (entry) =>
        entry.id !== product.id && entry.collection === product.collection,
    )
    .slice(0, 4);

  return (
    <section className="container-page py-[clamp(2.2rem,3.5vw,4rem)]">
      <div className="product-page-grid grid grid-cols-[minmax(16rem,31rem)_minmax(22rem,40rem)] justify-center gap-[clamp(0.9rem,1.8vw,2.6rem)]">
        <ProductGallery images={images} title={product.title} />

        <aside className="product-page-info sticky top-[clamp(1rem,2vw,2.5rem)] self-start">
          <p className="product-page-description text-base leading-[1.28] text-muted-text">
            {product.description}
          </p>
          <p className="mt-7 text-xl tracking-[0.12em] text-graphite">
            {formatPrice(product.price)}
          </p>

          <ProductPurchaseControls product={product} />

          <dl className="mt-9 space-y-1.5 text-sm leading-5">
            {[
              ["Размер", product.dimensions],
              ["Материал", product.material],
              ["Цвет", product.color],
              ["Фактура", product.texture],
              ["Уход", product.care],
            ].map(([label, value]) => (
              <div className="grid grid-cols-[110px_1fr] gap-4" key={label}>
                <dt className="text-muted-text">{label}</dt>
                <dd className="text-graphite">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {collectionProducts.length > 0 && (
        <section className="content-auto mt-[clamp(5rem,7vw,8rem)]">
          <div className="text-center">
            <h2 className="font-serif text-graphite">
              Из этой коллекции
            </h2>
            <div className="mx-auto mt-5 h-px w-12 bg-white/70" />
          </div>

          <div className="related-products mt-[clamp(2rem,3vw,3.5rem)] grid grid-cols-4 gap-x-[clamp(1rem,1.8vw,2rem)] gap-y-[clamp(1.6rem,2.5vw,3rem)]">
            {collectionProducts.map((entry) => (
              <Link
                className="group block min-w-0"
                href={`/product/${entry.slug}`}
                key={entry.id}
              >
                <div className="overflow-hidden">
                  <img
                    alt={entry.title}
                    className="aspect-square w-full object-cover transition duration-700 group-hover:scale-105"
                    decoding="async"
                    loading="lazy"
                    src={entry.image || "/brand-logo.png"}
                  />
                </div>
                <p className="mt-[clamp(0.6rem,0.9vw,1rem)] line-clamp-2 text-[clamp(1.25rem,1.5vw,1.85rem)] leading-[1.16] text-muted-text">
                  {entry.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
