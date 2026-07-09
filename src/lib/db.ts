import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import {
  categories,
  collections,
  products as seedProducts,
} from "@/lib/data";
import type { Product, ProductStatus } from "@/lib/data";
import { slugify } from "@/lib/slug";

export type StoredCollection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  visible: boolean;
};

export type CollectionInput = Omit<StoredCollection, "id"> & {
  id?: string;
};

export type StoredProduct = Product & {
  visible: boolean;
};

export type ProductInput = Omit<StoredProduct, "id"> & {
  id?: string;
};

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "site.sqlite");
const defaultCategory =
  categories.find((category) => category !== "Все") ?? "арт-объекты";
const categoryAliases = new Map([
  ["Вазы", "вазы"],
  ["Светильники", "светильники"],
  ["Ароматы для дома", "диффузоры"],
  ["Декоративные объекты", "арт-объекты"],
  ["Скульптурные формы", "арт-объекты"],
]);

let database: Database.Database | null = null;

function toBoolean(value: unknown) {
  return Boolean(Number(value));
}

function rowToProduct(row: Record<string, unknown>): StoredProduct {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    price: Number(row.price),
    oldPrice: row.old_price == null ? undefined : Number(row.old_price),
    category: String(row.category),
    collection: String(row.collection_name),
    status: String(row.status) as ProductStatus,
    shortDescription: String(row.short_description),
    description: String(row.description),
    material: String(row.material),
    dimensions: String(row.dimensions),
    color: String(row.color),
    texture: String(row.texture),
    care: String(row.care),
    featured: toBoolean(row.featured),
    visible: toBoolean(row.visible),
    image: String(row.image),
    gallery: JSON.parse(String(row.gallery)) as string[],
  };
}

function getDb() {
  if (database) return database;

  mkdirSync(dataDir, { recursive: true });
  database = new Database(dbPath);
  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      price INTEGER NOT NULL,
      old_price INTEGER,
      category TEXT NOT NULL,
      collection_name TEXT NOT NULL,
      status TEXT NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      material TEXT NOT NULL,
      dimensions TEXT NOT NULL,
      color TEXT NOT NULL,
      texture TEXT NOT NULL,
      care TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      visible INTEGER NOT NULL DEFAULT 1,
      image TEXT NOT NULL,
      gallery TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      visible INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const collectionCount = database
    .prepare("SELECT COUNT(*) AS count FROM collections")
    .get() as { count: number };

  if (collectionCount.count === 0) {
    collections.forEach((collection) =>
      saveCollection({ ...collection, visible: true }),
    );
  }

  const count = database.prepare("SELECT COUNT(*) AS count FROM products").get() as {
    count: number;
  };

  if (count.count === 0) {
    seedProducts.forEach((product) => saveProduct({ ...product, visible: true }));
  }

  migrateProductCategories(database);

  return database;
}

function normalizeCategory(category: string) {
  const trimmed = category.trim();
  const mapped = categoryAliases.get(trimmed) ?? trimmed;
  return categories.includes(mapped) && mapped !== "Все"
    ? mapped
    : defaultCategory;
}

function migrateProductCategories(db: Database.Database) {
  categoryAliases.forEach((nextCategory, previousCategory) => {
    db.prepare("UPDATE products SET category = ? WHERE category = ?").run(
      nextCategory,
      previousCategory,
    );
  });
}

function rowToCollection(row: Record<string, unknown>): StoredCollection {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    description: String(row.description),
    image: String(row.image),
    visible: toBoolean(row.visible),
  };
}

function normalizeCollection(input: CollectionInput): StoredCollection {
  const title = input.title.trim() || "Новая коллекция";

  return {
    id: input.id || `collection-${Date.now()}`,
    title,
    slug: slugify(input.slug || title),
    description: input.description.trim(),
    image: input.image.trim(),
    visible: Boolean(input.visible),
  };
}

function normalizeProduct(input: ProductInput): StoredProduct {
  const title = input.title.trim() || "Новая работа";
  const slug = slugify(input.slug || title);

  return {
    ...input,
    id: input.id || `product-${Date.now()}`,
    title,
    slug,
    price: Number(input.price) || 0,
    oldPrice: input.oldPrice ? Number(input.oldPrice) : undefined,
    category: normalizeCategory(input.category),
    collection: input.collection.trim() || collections[0]?.title || "Коллекция",
    status: input.status,
    shortDescription: input.shortDescription.trim(),
    description: input.description.trim(),
    material: input.material.trim(),
    dimensions: input.dimensions.trim(),
    color: input.color.trim(),
    texture: input.texture.trim(),
    care: input.care.trim(),
    featured: Boolean(input.featured),
    visible: Boolean(input.visible),
    image: input.image.trim(),
    gallery: input.gallery.filter(Boolean),
  };
}

export function getProducts({ includeHidden = false } = {}) {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT * FROM products ${includeHidden ? "" : "WHERE visible = 1"} ORDER BY created_at ASC`,
    )
    .all() as Record<string, unknown>[];
  return rows.map(rowToProduct);
}

export function getCollections({ includeHidden = false } = {}) {
  const rows = getDb()
    .prepare(
      `SELECT * FROM collections ${includeHidden ? "" : "WHERE visible = 1"} ORDER BY created_at ASC`,
    )
    .all() as Record<string, unknown>[];
  return rows.map(rowToCollection);
}

export function getCollectionById(id: string) {
  const row = getDb()
    .prepare("SELECT * FROM collections WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToCollection(row) : null;
}

export function getCollectionBySlug(slug: string) {
  const row = getDb()
    .prepare("SELECT * FROM collections WHERE slug = ? AND visible = 1")
    .get(slug) as Record<string, unknown> | undefined;
  return row ? rowToCollection(row) : null;
}

export function getFeaturedProducts(limit = 6) {
  return getProducts().filter((product) => product.featured).slice(0, limit);
}

export function getProductBySlug(slug: string) {
  const row = getDb()
    .prepare("SELECT * FROM products WHERE slug = ? AND visible = 1")
    .get(slug) as Record<string, unknown> | undefined;
  return row ? rowToProduct(row) : null;
}

export function getProductById(id: string) {
  const row = getDb()
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToProduct(row) : null;
}

export function saveProduct(input: ProductInput) {
  const product = normalizeProduct(input);
  product.slug = makeUniqueSlug(product.slug, product.id);

  getDb()
    .prepare(
      `INSERT INTO products (
        id, title, slug, price, old_price, category, collection_name, status,
        short_description, description, material, dimensions, color, texture,
        care, featured, visible, image, gallery, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        slug = excluded.slug,
        price = excluded.price,
        old_price = excluded.old_price,
        category = excluded.category,
        collection_name = excluded.collection_name,
        status = excluded.status,
        short_description = excluded.short_description,
        description = excluded.description,
        material = excluded.material,
        dimensions = excluded.dimensions,
        color = excluded.color,
        texture = excluded.texture,
        care = excluded.care,
        featured = excluded.featured,
        visible = excluded.visible,
        image = excluded.image,
        gallery = excluded.gallery,
        updated_at = CURRENT_TIMESTAMP`,
    )
    .run(
      product.id,
      product.title,
      product.slug,
      product.price,
      product.oldPrice ?? null,
      product.category,
      product.collection,
      product.status,
      product.shortDescription,
      product.description,
      product.material,
      product.dimensions,
      product.color,
      product.texture,
      product.care,
      product.featured ? 1 : 0,
      product.visible ? 1 : 0,
      product.image,
      JSON.stringify(product.gallery),
    );

  return product;
}

export function saveCollection(input: CollectionInput) {
  const collection = normalizeCollection(input);
  collection.slug = makeUniqueCollectionSlug(collection.slug, collection.id);

  getDb()
    .prepare(
      `INSERT INTO collections (
        id, title, slug, description, image, visible, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        slug = excluded.slug,
        description = excluded.description,
        image = excluded.image,
        visible = excluded.visible,
        updated_at = CURRENT_TIMESTAMP`,
    )
    .run(
      collection.id,
      collection.title,
      collection.slug,
      collection.description,
      collection.image,
      collection.visible ? 1 : 0,
    );

  return collection;
}

export function deleteProduct(id: string) {
  getDb().prepare("DELETE FROM products WHERE id = ?").run(id);
}

export function deleteCollection(id: string) {
  getDb().prepare("DELETE FROM collections WHERE id = ?").run(id);
}

export function renameProductsCollection(oldTitle: string, newTitle: string) {
  if (oldTitle === newTitle) return;

  getDb()
    .prepare("UPDATE products SET collection_name = ? WHERE collection_name = ?")
    .run(newTitle, oldTitle);
}

function makeUniqueSlug(baseSlug: string, productId: string) {
  const db = getDb();
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = db
      .prepare("SELECT id FROM products WHERE slug = ? AND id != ?")
      .get(slug, productId) as { id: string } | undefined;

    if (!existing) return slug;

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

function makeUniqueCollectionSlug(baseSlug: string, collectionId: string) {
  const db = getDb();
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = db
      .prepare("SELECT id FROM collections WHERE slug = ? AND id != ?")
      .get(slug, collectionId) as { id: string } | undefined;

    if (!existing) return slug;

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}
