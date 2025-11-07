"use client";

import { create } from "zustand";
import type { ApiCart } from "@/data/cart"; 

interface CartStore {
  cart: ApiCart | null;
  count: number;
  setCart: (cart: ApiCart) => void;
  increase: () => void;
  decrease: () => void;
  setCount: (value: number) => void;
  reset: () => void;
}

export const useCartStore = create<CartStore>()(
    (set) => ({
      cart: null,
      count: 0,

      setCart: (cart) =>
        set({
          cart,
          count: cart.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
        }),

      increase: () => set((state) => ({ count: state.count + 1 })),

      decrease: () =>
        set((state) => ({
          count: state.count > 0 ? state.count - 1 : 0,
        })),

      setCount: (value) => set({ count: value }),

      reset: () => set({ cart: null, count: 0 }),
    }),
);
