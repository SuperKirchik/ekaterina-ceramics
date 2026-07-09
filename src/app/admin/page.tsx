"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  LogOut,
  PackagePlus,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import type { Product, ProductStatus } from "@/lib/data";
import { categories as siteCategories, formatPrice } from "@/lib/data";
import { slugify } from "@/lib/slug";

type AdminProduct = Product & { visible: boolean };

type AdminCollection = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  visible: boolean;
};

type Section = "products" | "collections";

const emptyProduct: AdminProduct = {
  id: "",
  title: "Новая работа",
  slug: "",
  price: 0,
  category: "арт-объекты",
  collection: "Камень",
  status: "preorder",
  shortDescription: "",
  description: "",
  material: "",
  dimensions: "",
  color: "",
  texture: "",
  care: "",
  featured: false,
  visible: true,
  image: "",
  gallery: [],
};

const statuses: Array<{ label: string; value: ProductStatus }> = [
  { label: "В наличии", value: "available" },
  { label: "Под заказ", value: "preorder" },
  { label: "Продано", value: "sold" },
];

const defaultCategories = siteCategories.filter((category) => category !== "Все");

const emptyCollection: AdminCollection = {
  id: "",
  title: "Новая коллекция",
  slug: "novaya-kollektsiya",
  description: "",
  image: "",
  visible: true,
};

function fieldClassName() {
  return "mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-graphite outline-none focus:border-clay";
}

type ImageUploadFieldProps = {
  label: string;
  removing?: boolean;
  value: string;
  onChange: (value: string) => void;
  onRemove?: () => void;
};

function ImageUploadField({
  label,
  removing = false,
  value,
  onChange,
  onRemove,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/uploads", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setUploading(false);
      setError("Не получилось загрузить изображение.");
      return;
    }

    const uploaded = (await response.json()) as { url: string };
    onChange(uploaded.url);
    setUploading(false);
  }

  return (
    <div className="text-sm text-muted-text md:col-span-2">
      <p>{label}</p>
      <div className="mt-2 grid gap-4 rounded-lg border border-border bg-background p-3 md:grid-cols-[220px_1fr]">
        <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md bg-surface text-center text-xs leading-5 text-muted-text">
          {value ? (
            <img
              alt=""
              className="h-full w-full object-cover"
              src={value}
            />
          ) : (
            <span className="px-5">Картинка пока не загружена</span>
          )}
        </div>
        <div className="flex flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-graphite px-5 py-3 text-sm text-surface transition hover:bg-clay">
              {uploading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <ImagePlus size={16} />
              )}
              {value ? "Заменить" : "Загрузить"}
              <input
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="sr-only"
                disabled={uploading}
                type="file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void upload(file);
                }}
              />
            </label>
            {value && (
              <button
                className="inline-flex items-center rounded-full border border-border px-5 py-3 text-sm text-graphite"
                disabled={removing}
                onClick={() => (onRemove ? onRemove() : onChange(""))}
                type="button"
              >
                {removing && <Loader2 className="mr-2 animate-spin" size={16} />}
                Убрать
              </button>
            )}
          </div>
          {value && (
            <p className="break-all text-xs leading-5 text-muted-text">
              {value}
            </p>
          )}
          {error && <p className="text-xs text-red-700">{error}</p>}
        </div>
      </div>
    </div>
  );
}

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return ((await response.json()) as { url: string }).url;
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [items, setItems] = useState<AdminProduct[]>([]);
  const [collections, setCollections] = useState<AdminCollection[]>([]);
  const [section, setSection] = useState<Section>("products");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);
  const [message, setMessage] = useState("");

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0],
    [items, selectedId],
  );

  const filtered = useMemo(
    () =>
      items.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const selectedCollection = useMemo(
    () =>
      collections.find((collection) => collection.id === selectedCollectionId) ??
      collections[0],
    [collections, selectedCollectionId],
  );

  const categoryOptions = useMemo(
    () => defaultCategories,
    [],
  );

  useEffect(() => {
    fetch("/api/admin/session")
      .then((response) => response.json())
      .then((session: { authorized: boolean }) => {
        setAuthorized(session.authorized);
      })
      .finally(() => setAuthChecking(false));
  }, []);

  useEffect(() => {
    if (!authorized) return;

    setLoading(true);
    Promise.all([
      fetch("/api/products", { cache: "no-store" }).then((response) => response.json()),
      fetch("/api/collections", { cache: "no-store" }).then((response) => response.json()),
    ])
      .then(([products, loadedCollections]: [AdminProduct[], AdminCollection[]]) => {
        setItems(products);
        setCollections(loadedCollections);
        setSelectedId(products[0]?.id ?? null);
        setSelectedCollectionId(loadedCollections[0]?.id ?? null);
      })
      .finally(() => setLoading(false));
  }, [authorized]);

  async function loginAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setLoginError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
      setLoginError("Неверный логин или пароль.");
      setLoading(false);
      return;
    }

    setPassword("");
    setAuthorized(true);
    setLoading(false);
  }

  async function logoutAdmin() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthorized(false);
    setItems([]);
    setCollections([]);
    setSelectedId(null);
    setSelectedCollectionId(null);
  }

  function updateSelected(patch: Partial<AdminProduct>) {
    if (!selected) return;
    setItems((current) =>
      current.map((item) =>
        item.id === selected.id ? { ...item, ...patch } : item,
      ),
    );
  }

  function updateSelectedCollection(patch: Partial<AdminCollection>) {
    if (!selectedCollection) return;
    setCollections((current) =>
      current.map((collection) =>
        collection.id === selectedCollection.id
          ? { ...collection, ...patch }
          : collection,
      ),
    );
  }

  async function persistSelectedPatch(
    patch: Partial<AdminProduct>,
    successMessage = "Изменения сохранены.",
  ) {
    if (!selected) return;

    const next = { ...selected, ...patch };
    setItems((current) =>
      current.map((item) => (item.id === selected.id ? next : item)),
    );

    if (!next.id) return;

    setRemovingImage(true);
    setMessage("");
    const response = await fetch(`/api/products/${next.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });

    if (!response.ok) {
      setMessage("Не получилось сохранить изменения.");
      setRemovingImage(false);
      return;
    }

    const saved = (await response.json()) as AdminProduct;

    setItems((current) =>
      current.map((item) => (item.id === saved.id ? saved : item)),
    );
    setMessage("Фото убрано и сохранено.");
    setRemovingImage(false);
  }

  async function persistSelectedCollectionPatch(
    patch: Partial<AdminCollection>,
  ) {
    if (!selectedCollection) return;

    const next = { ...selectedCollection, ...patch };
    setCollections((current) =>
      current.map((collection) =>
        collection.id === selectedCollection.id ? next : collection,
      ),
    );

    if (!next.id) return;

    setRemovingImage(true);
    setMessage("");
    const response = await fetch(`/api/collections/${next.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    const saved = (await response.json()) as AdminCollection;

    setCollections((current) =>
      current.map((collection) =>
        collection.id === saved.id ? saved : collection,
      ),
    );
    setMessage("Фото убрано и сохранено.");
    setRemovingImage(false);
  }

  async function saveSelected() {
    if (!selected) return;

    setSaving(true);
    setMessage("");

    const isNew = !selected.id;
    const response = await fetch(
      isNew ? "/api/products" : `/api/products/${selected.id}`,
      {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selected),
      },
    );

    if (!response.ok) {
      setMessage("Не получилось сохранить товар.");
      setSaving(false);
      return;
    }

    const saved = (await response.json()) as AdminProduct;

    setItems((current) =>
      isNew
        ? [saved, ...current.filter((item) => item.id)]
        : current.map((item) => (item.id === saved.id ? saved : item)),
    );
    setSelectedId(saved.id);
    setMessage("Сохранено. Обнови каталог, чтобы увидеть изменения.");
    setSaving(false);
  }

  async function deleteSelected() {
    if (!selected?.id) return;

    await fetch(`/api/products/${selected.id}`, { method: "DELETE" });
    setItems((current) => current.filter((item) => item.id !== selected.id));
    setSelectedId(items.find((item) => item.id !== selected.id)?.id ?? null);
    setMessage("Товар удалён.");
  }

  async function saveSelectedCollection() {
    if (!selectedCollection) return;

    setSaving(true);
    setMessage("");

    const isNew = !selectedCollection.id;
    const response = await fetch(
      isNew ? "/api/collections" : `/api/collections/${selectedCollection.id}`,
      {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedCollection),
      },
    );

    if (!response.ok) {
      setMessage("Не получилось сохранить коллекцию.");
      setSaving(false);
      return;
    }

    const saved = (await response.json()) as AdminCollection;

    setCollections((current) =>
      isNew
        ? [saved, ...current.filter((collection) => collection.id)]
        : current.map((collection) =>
            collection.id === saved.id ? saved : collection,
          ),
    );
    setSelectedCollectionId(saved.id);
    setMessage("Коллекция сохранена.");
    setSaving(false);
  }

  async function deleteSelectedCollection() {
    if (!selectedCollection?.id) return;

    await fetch(`/api/collections/${selectedCollection.id}`, { method: "DELETE" });
    setCollections((current) =>
      current.filter((collection) => collection.id !== selectedCollection.id),
    );
    setSelectedCollectionId(
      collections.find((collection) => collection.id !== selectedCollection.id)
        ?.id ?? null,
    );
    setMessage("Коллекция удалена.");
  }

  if (authChecking) {
    return (
      <section className="container-page flex min-h-[70vh] items-center py-12">
        <p className="text-sm uppercase tracking-[0.24em] text-muted-text">
          Проверка доступа...
        </p>
      </section>
    );
  }

  if (!authorized) {
    return (
      <section className="container-page flex min-h-[70vh] items-center py-12">
        <form
          className="w-full max-w-md rounded-lg bg-surface p-8"
          onSubmit={loginAdmin}
        >
          <p className="text-sm uppercase tracking-[0.24em] text-muted-text">
            Админ-панель
          </p>
          <h1 className="mt-4 font-serif text-5xl text-graphite">Вход</h1>
          <label className="mt-8 block text-sm text-muted-text">
            Логин
            <input
              className={fieldClassName()}
              autoComplete="username"
              onChange={(event) => setLogin(event.target.value)}
              type="text"
              value={login}
            />
          </label>
          <label className="mt-4 block text-sm text-muted-text">
            Пароль
            <input
              className={fieldClassName()}
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>
          {loginError && (
            <p className="mt-4 text-sm text-red-200">{loginError}</p>
          )}
          <button
            className="mt-6 w-full rounded-full bg-graphite px-6 py-3 text-sm font-medium text-surface transition hover:bg-clay"
            disabled={loading}
            type="submit"
          >
            {loading ? "Проверяю..." : "Войти"}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="container-page py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted-text">
            Dashboard
          </p>
          <h1 className="mt-3 font-serif text-6xl text-graphite">
            {section === "products" ? "Товары" : "Коллекции"}
          </h1>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-graphite"
          onClick={logoutAdmin}
          type="button"
        >
          <LogOut size={17} /> Выйти
        </button>
      </div>

      <div className="mt-6 inline-flex rounded-full border border-border bg-surface p-1">
        {[
          ["products", "Товары"],
          ["collections", "Коллекции"],
        ].map(([value, label]) => (
          <button
            className={`rounded-full px-5 py-2 text-sm transition ${
              section === value ? "bg-graphite text-surface" : "text-graphite"
            }`}
            key={value}
            onClick={() => setSection(value as Section)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[340px_1fr]">
        <aside className="h-fit rounded-lg bg-surface p-4">
          {section === "products" ? (
            <>
              <label className="relative block">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                  size={17}
                />
                <input
                  className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none focus:border-clay"
                  placeholder="Поиск товара"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>

              <button
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-graphite px-5 py-3 text-sm text-surface transition hover:bg-clay"
                onClick={() => {
                  const draft = {
                    ...emptyProduct,
                    id: "",
                    slug: slugify(emptyProduct.title),
                    category: categoryOptions[0] ?? emptyProduct.category,
                    collection: collections[0]?.title ?? emptyProduct.collection,
                  };
                  setItems((current) => [draft, ...current]);
                  setSelectedId("");
                }}
                type="button"
              >
                <PackagePlus size={17} /> Добавить товар
              </button>

              <div className="mt-5 max-h-[62vh] space-y-2 overflow-auto pr-1">
                {loading ? (
                  <div className="flex items-center gap-2 p-4 text-sm text-muted-text">
                    <Loader2 className="animate-spin" size={16} /> Загружаю товары
                  </div>
                ) : (
                  filtered.map((product) => (
                    <button
                      className={`grid w-full grid-cols-[56px_1fr] gap-3 rounded-md p-2 text-left transition ${
                        product.id === selected?.id
                          ? "bg-background"
                          : "hover:bg-background"
                      }`}
                      key={product.id || "new-product"}
                      onClick={() => setSelectedId(product.id)}
                      type="button"
                    >
                      <img
                        alt={product.title}
                        className="aspect-square rounded-md object-cover"
                        src={product.image || "/brand-logo.png"}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-graphite">
                          {product.title}
                        </span>
                        <span className="mt-1 block text-xs text-muted-text">
                          {formatPrice(product.price)} ·{" "}
                          {product.visible ? "на сайте" : "скрыт"}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-graphite px-5 py-3 text-sm text-surface transition hover:bg-clay"
                onClick={() => {
                  const draft = {
                    ...emptyCollection,
                    id: "",
                    slug: slugify(emptyCollection.title),
                  };
                  setCollections((current) => [draft, ...current]);
                  setSelectedCollectionId("");
                }}
                type="button"
              >
                <Plus size={17} /> Добавить коллекцию
              </button>

              <div className="mt-5 max-h-[62vh] space-y-2 overflow-auto pr-1">
                {collections.map((collection) => (
                  <button
                    className={`grid w-full grid-cols-[56px_1fr] gap-3 rounded-md p-2 text-left transition ${
                      collection.id === selectedCollection?.id
                        ? "bg-background"
                        : "hover:bg-background"
                    }`}
                    key={collection.id || "new-collection"}
                    onClick={() => setSelectedCollectionId(collection.id)}
                    type="button"
                  >
                    <img
                      alt={collection.title}
                      className="aspect-square rounded-md object-cover"
                      src={collection.image || "/brand-logo.png"}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-graphite">
                        {collection.title}
                      </span>
                      <span className="mt-1 block text-xs text-muted-text">
                        {collection.visible ? "на сайте" : "скрыта"}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>

        {section === "products" && selected ? (
          <div className="rounded-lg bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
              <div>
                <p className="text-sm text-muted-text">Редактирование</p>
                <h2 className="mt-1 font-serif text-4xl text-graphite">
                  {selected.title}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-graphite"
                  onClick={() => updateSelected({ visible: !selected.visible })}
                  type="button"
                >
                  {selected.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                  {selected.visible ? "Скрыть" : "Показать"}
                </button>
                {selected.id && (
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-graphite"
                    onClick={deleteSelected}
                    type="button"
                  >
                    <Trash2 size={16} /> Удалить
                  </button>
                )}
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-graphite px-5 py-2 text-sm text-surface transition hover:bg-clay"
                  disabled={saving}
                  onClick={saveSelected}
                  type="button"
                >
                  {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Сохранить
                </button>
              </div>
            </div>

            {message && (
              <p className="mt-4 rounded-lg bg-background px-4 py-3 text-sm text-muted-text">
                {message}
              </p>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="text-sm text-muted-text">
                Название
                <input
                  className={fieldClassName()}
                  value={selected.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    updateSelected({ title, slug: slugify(title) });
                  }}
                />
              </label>
              <label className="text-sm text-muted-text">
                Ссылка создаётся автоматически
                <input
                  className={`${fieldClassName()} cursor-not-allowed text-muted-text`}
                  readOnly
                  value={selected.slug}
                />
              </label>
              <label className="text-sm text-muted-text">
                Цена
                <input
                  className={fieldClassName()}
                  min={0}
                  type="number"
                  value={selected.price}
                  onChange={(event) =>
                    updateSelected({ price: Number(event.target.value) })
                  }
                />
              </label>
              <label className="text-sm text-muted-text">
                Статус
                <select
                  className={fieldClassName()}
                  value={selected.status}
                  onChange={(event) =>
                    updateSelected({ status: event.target.value as ProductStatus })
                  }
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-muted-text">
                Категория
                <select
                  className={fieldClassName()}
                  value={selected.category}
                  onChange={(event) =>
                    updateSelected({ category: event.target.value })
                  }
                >
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-muted-text">
                Коллекция
                <select
                  className={fieldClassName()}
                  value={selected.collection}
                  onChange={(event) =>
                    updateSelected({ collection: event.target.value })
                  }
                >
                  {collections.map((collection) => (
                    <option key={collection.id || collection.title} value={collection.title}>
                      {collection.title}
                    </option>
                  ))}
                </select>
              </label>
              <ImageUploadField
                label="Главное фото"
                removing={removingImage}
                value={selected.image}
                onChange={(image) => {
                  updateSelected({ image });
                  if (selected.id) {
                    void persistSelectedPatch({ image }, "Фото загружено и сохранено.");
                  }
                }}
                onRemove={() => void persistSelectedPatch({ image: "" })}
              />
              <label className="text-sm text-muted-text md:col-span-2">
                Галерея
                <div className="mt-2 rounded-lg border border-border bg-background p-3">
                  {selected.gallery.length > 0 ? (
                    <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {selected.gallery.map((image, index) => (
                        <div className="overflow-hidden rounded-md bg-surface" key={`${image}-${index}`}>
                          <img
                            alt=""
                            className="aspect-square w-full object-cover"
                            src={image}
                          />
                          <button
                            className="w-full px-3 py-2 text-xs text-muted-text transition hover:text-graphite"
                            onClick={() =>
                              void persistSelectedPatch({
                                gallery: selected.gallery.filter(
                                  (_, imageIndex) => imageIndex !== index,
                                ),
                              })
                            }
                            type="button"
                          >
                            Убрать
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mb-3 rounded-md bg-surface px-4 py-5 text-center text-xs leading-5 text-muted-text">
                      Дополнительных фото пока нет
                    </p>
                  )}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-graphite">
                    {uploadingGallery ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <ImagePlus size={16} />
                    )}
                    Добавить фото
                    <input
                      accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                      className="sr-only"
                      disabled={uploadingGallery}
                      multiple
                      type="file"
                      onChange={async (event) => {
                        const files = Array.from(event.target.files ?? []);
                        event.target.value = "";
                        if (files.length === 0) return;

                        setUploadingGallery(true);
                        try {
                          const uploaded = await Promise.all(files.map(uploadImage));
                          const gallery = [...selected.gallery, ...uploaded];
                          updateSelected({ gallery });
                          if (selected.id) {
                            await persistSelectedPatch(
                              { gallery },
                              "Галерея загружена и сохранена.",
                            );
                          }
                        } finally {
                          setUploadingGallery(false);
                        }
                      }}
                    />
                  </label>
                </div>
              </label>
              <label className="text-sm text-muted-text md:col-span-2">
                Краткое описание
                <textarea
                  className={`${fieldClassName()} min-h-24 resize-none`}
                  value={selected.shortDescription}
                  onChange={(event) =>
                    updateSelected({ shortDescription: event.target.value })
                  }
                />
              </label>
              <label className="text-sm text-muted-text md:col-span-2">
                Полное описание
                <textarea
                  className={`${fieldClassName()} min-h-32 resize-none`}
                  value={selected.description}
                  onChange={(event) =>
                    updateSelected({ description: event.target.value })
                  }
                />
              </label>
              {[
                ["Размер", "dimensions"],
                ["Материал", "material"],
                ["Цвет", "color"],
                ["Фактура", "texture"],
                ["Уход", "care"],
              ].map(([label, key]) => (
                <label className="text-sm text-muted-text" key={key}>
                  {label}
                  <input
                    className={fieldClassName()}
                    value={String(selected[key as keyof AdminProduct] ?? "")}
                    onChange={(event) =>
                      updateSelected({ [key]: event.target.value })
                    }
                  />
                </label>
              ))}
              <label className="flex items-center gap-3 text-sm text-graphite">
                <input
                  checked={selected.featured}
                  onChange={(event) =>
                    updateSelected({ featured: event.target.checked })
                  }
                  type="checkbox"
                />
                Показывать на главной
              </label>
            </div>
          </div>
        ) : section === "products" ? (
          <div className="rounded-lg bg-surface p-10 text-muted-text">
            Товаров пока нет. Добавь первый товар.
          </div>
        ) : selectedCollection ? (
          <div className="rounded-lg bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
              <div>
                <p className="text-sm text-muted-text">Редактирование коллекции</p>
                <h2 className="mt-1 font-serif text-4xl text-graphite">
                  {selectedCollection.title}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-graphite"
                  onClick={() =>
                    updateSelectedCollection({
                      visible: !selectedCollection.visible,
                    })
                  }
                  type="button"
                >
                  {selectedCollection.visible ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                  {selectedCollection.visible ? "Скрыть" : "Показать"}
                </button>
                {selectedCollection.id && (
                  <button
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-graphite"
                    onClick={deleteSelectedCollection}
                    type="button"
                  >
                    <Trash2 size={16} /> Удалить
                  </button>
                )}
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-graphite px-5 py-2 text-sm text-surface transition hover:bg-clay"
                  disabled={saving}
                  onClick={saveSelectedCollection}
                  type="button"
                >
                  {saving ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Save size={16} />
                  )}
                  Сохранить
                </button>
              </div>
            </div>

            {message && (
              <p className="mt-4 rounded-lg bg-background px-4 py-3 text-sm text-muted-text">
                {message}
              </p>
            )}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="text-sm text-muted-text">
                Название
                <input
                  className={fieldClassName()}
                  value={selectedCollection.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    updateSelectedCollection({ title, slug: slugify(title) });
                  }}
                />
              </label>
              <label className="text-sm text-muted-text">
                Ссылка создаётся автоматически
                <input
                  className={`${fieldClassName()} cursor-not-allowed text-muted-text`}
                  readOnly
                  value={selectedCollection.slug}
                />
              </label>
              <ImageUploadField
                label="Обложка коллекции"
                removing={removingImage}
                value={selectedCollection.image}
                onChange={(image) => {
                  updateSelectedCollection({ image });
                  if (selectedCollection.id) {
                    void persistSelectedCollectionPatch({ image });
                  }
                }}
                onRemove={() =>
                  void persistSelectedCollectionPatch({ image: "" })
                }
              />
              <label className="text-sm text-muted-text md:col-span-2">
                Описание
                <textarea
                  className={`${fieldClassName()} min-h-32 resize-none`}
                  value={selectedCollection.description}
                  onChange={(event) =>
                    updateSelectedCollection({ description: event.target.value })
                  }
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-surface p-10 text-muted-text">
            Коллекций пока нет. Добавь первую коллекцию.
          </div>
        )}
      </div>
    </section>
  );
}
