import type { MetadataRoute } from "next";
import { getCollections, getProducts } from "@/lib/db";

const baseUrl = "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const collections = getCollections();
  const products = getProducts();
  const routes = ["", "/catalog", "/collections", "/delivery", "/contacts"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    }),
  );

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(),
  }));

  const collectionRoutes = collections.map((collection) => ({
    url: `${baseUrl}/collections/${collection.slug}`,
    lastModified: new Date(),
  }));

  return [...routes, ...collectionRoutes, ...productRoutes];
}
