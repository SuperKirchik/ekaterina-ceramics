"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { Product } from "./data";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  detailedItems: Array<{ product: Product; quantity: number }>;
  total: number;
  count: number;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "ekaterina-drozdova-cart";

const listeners = new Set<() => void>();

function getCartSnapshot() {
  if (typeof window === "undefined") return "[]";
  return window.localStorage.getItem(storageKey) ?? "[]";
}

function parseCartSnapshot(snapshot: string): CartItem[] {
  try {
    return JSON.parse(snapshot) as CartItem[];
  } catch {
    return [];
  }
}

function subscribeCart(listener: () => void) {
  listeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === storageKey) listener();
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function saveCart(items: CartItem[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(items));
  listeners.forEach((listener) => listener());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const snapshot = useSyncExternalStore(subscribeCart, getCartSnapshot, () => "[]");
  const items = useMemo(() => parseCartSnapshot(snapshot), [snapshot]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let ignore = false;

    fetch("/api/public/products", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((nextProducts: Product[]) => {
        if (!ignore) setProducts(nextProducts);
      })
      .catch(() => {
        if (!ignore) setProducts([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const updateItems = useCallback((updater: (current: CartItem[]) => CartItem[]) => {
    saveCart(updater(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const detailedItems = items
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return product ? { product, quantity: 1 } : null;
      })
      .filter(Boolean) as Array<{ product: Product; quantity: number }>;

    return {
      items,
      detailedItems,
      total: detailedItems.reduce((sum, item) => sum + item.product.price, 0),
      count: items.length,
      addItem: (productId) =>
        updateItems((current) => {
          const existing = current.find((item) => item.productId === productId);
          if (existing) return current;
          return [...current, { productId, quantity: 1 }];
        }),
      removeItem: (productId) =>
        updateItems((current) =>
          current.filter((item) => item.productId !== productId),
        ),
      setQuantity: (productId, quantity) =>
        updateItems((current) =>
          current.map((item) =>
            item.productId === productId
              ? { ...item, quantity: 1 }
              : item,
          ),
        ),
      clear: () => updateItems(() => []),
    };
  }, [items, updateItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
