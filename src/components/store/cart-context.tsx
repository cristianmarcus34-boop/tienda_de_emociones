"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { CartItem, StoreProduct } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (product: StoreProduct) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const storageKey = "tienda-de-emociones-cart";
const CartContext = createContext<CartContextValue | null>(null);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStoreProduct(value: unknown): value is StoreProduct {
  if (!isRecord(value)) return false;
  const imageIsSafe =
    typeof value.image === "string" &&
    (
      (value.image.startsWith("/") && !value.image.startsWith("//")) ||
      value.image.startsWith("https://images.unsplash.com/") ||
      value.image.startsWith("https://")
    );
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.slug === "string" &&
    typeof value.description === "string" &&
    typeof value.price === "number" &&
    Number.isSafeInteger(value.price) &&
    typeof value.category === "string" &&
    imageIsSafe &&
    typeof value.alt === "string" &&
    typeof value.featured === "boolean" &&
    (value.tag === undefined || typeof value.tag === "string")
  );
}

function restoreCartItem(value: unknown): CartItem | null {
  if (!isRecord(value) || !isStoreProduct(value.product)) return null;
  if (
    typeof value.quantity !== "number" ||
    !Number.isInteger(value.quantity) ||
    value.quantity < 1 ||
    value.quantity > 20
  ) {
    return null;
  }
  return { product: value.product, quantity: value.quantity };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(stored)) {
        const restored = stored.flatMap((entry) => {
          const item = restoreCartItem(entry);
          return item ? [item] : [];
        });
        setItems(restored);
      }
    } catch (error) {
      console.warn("No se pudo restaurar el carrito guardado:", error);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (error) {
      console.warn("No se pudo guardar el carrito en este dispositivo:", error);
    }
  }, [hydrated, items]);

  const addItem = useCallback((product: StoreProduct) => {
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= 20) return current;
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, product, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      quantity < 1
        ? current.filter((item) => item.product.id !== productId)
        : current.map((item) =>
            item.product.id === productId
              ? { ...item, quantity: Math.min(quantity, 20) }
              : item
          )
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.product.id !== productId));
  }, []);
  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      hydrated,
      addItem,
      setQuantity,
      removeItem,
      clearCart
    }),
    [items, hydrated, addItem, setQuantity, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider.");
  return context;
}
