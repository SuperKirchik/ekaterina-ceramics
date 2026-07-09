import { CatalogClient } from "@/components/CatalogClient";
import { categories } from "@/lib/data";
import { getProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function CatalogPage() {
  const products = getProducts();

  return (
    <section className="container-page py-[clamp(3.5rem,5vw,6rem)]">
      <CatalogClient categories={categories} products={products} />
    </section>
  );
}
