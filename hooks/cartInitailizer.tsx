"use client";

import { useEffect } from "react";
import { getCart } from "@/data/cart"; 
import { useCartStore } from "@/stores/cartStore";

export default function CartInitializer() {
  const setCart = useCartStore((state) => state.setCart);
  const reset = useCartStore((state) => state.reset);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart();

        if (res.success && res.data?.cart) {
          setCart(res.data.cart);
        } else {
          reset();
        }
      } catch (err) {
        console.error("Failed to initialize cart:", err);
        reset();
      }
    };

    fetchCart();
  }, [setCart, reset]);

  return null; // nothing to render
}
