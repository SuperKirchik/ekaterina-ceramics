"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Product, products } from "./data";

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

  const updateItems = useCallback((updater: (current: CartItem[]) => CartItem[]) => {
    saveCart(updater(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const detailedItems = items
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter(Boolean) as Array<{ product: Product; quantity: number }>;

    return {
      items,
      detailedItems,
      total: detailedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      addItem: (productId) =>
        updateItems((current) => {
          const existing = current.find((item) => item.productId === productId);
          if (existing) {
            return current.map((item) =>
              item.productId === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            );
          }
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
              ? { ...item, quantity: Math.max(1, quantity) }
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
