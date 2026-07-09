import Link from "next/link";
import { getCollections } from "@/lib/db";
import { fitClamp } from "@/lib/textFit";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Коллекции — Екатерина Дроздова",
  description: "Коллекции авторской интерьерной керамики: Камень, Форма, Земля и Свет.",
};

export default function CollectionsPage() {
  const collections = getCollections();

  return (
    <section className="container-page py-[clamp(3.5rem,5vw,6rem)]">
      <p className="text-sm uppercase tracking-[0.24em] text-muted-text">Коллекции</p>
      <div className="mt-10">
        {collections.map((collection) => (
          <Link
            className="content-auto grid grid-cols-12 items-center gap-[clamp(1.5rem,2.8vw,3.5rem)] border-t border-white/55 py-[clamp(2.5rem,4vw,5rem)] first:border-t-0 first:pt-0"
            href={`/collections/${collection.slug}`}
            key={collection.slug}
          >
            <div className="col-span-6">
              <h2
                className="font-serif text-graphite"
                style={fitClamp(collection.title, 1.35, 2.2, 2.85)}
              >
                {collection.title}
              </h2>
              <p className="mt-[clamp(0.8rem,1.3vw,1.5rem)] max-w-[42rem] text-[clamp(0.9rem,1vw,1.25rem)] leading-[1.28] text-muted-text">
                {collection.description}
              </p>
            </div>
            <div className="col-span-6">
              <img
                alt={collection.title}
                className="ml-auto aspect-[4/3] w-full max-w-[clamp(18rem,24vw,32rem)] object-cover"
                decoding="async"
                loading="lazy"
                src={collection.image || "/brand-logo.png"}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
