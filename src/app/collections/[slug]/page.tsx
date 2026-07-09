import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import {
  getCollectionBySlug,
  getCollections,
  getProducts,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getCollections().map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  return {
    title: collection
      ? `${collection.title} — коллекция Екатерины Дроздовой`
      : "Коллекция — Екатерина Дроздова",
    description: collection?.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) notFound();

  const products = getProducts().filter(
    (product) => product.collection === collection.title,
  );

  return (
    <section className="container-page py-[clamp(3.5rem,5vw,6rem)]">
      <h1 className="collection-name-eyebrow text-left text-graphite">
        {collection.title}
      </h1>

      <div className="mt-12">
        {products.length > 0 ? (
          <div className="catalog-products grid grid-cols-2 gap-x-[clamp(1rem,1.8vw,2rem)] gap-y-[clamp(2rem,3vw,3.5rem)]">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="mx-auto max-w-[38rem] text-center text-[clamp(0.9rem,1vw,1.2rem)] leading-[1.32] text-muted-text">
            В этой коллекции пока нет опубликованных работ.
          </p>
        )}
      </div>
    </section>
  );
}
