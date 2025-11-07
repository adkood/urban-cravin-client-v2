"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export default function CartIcon() {
  const count = useCartStore((state) => state.count);

  return (
    <Link
      href="/cart"
      className="relative hover:opacity-70 transition-opacity"
    >
      <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#9b1e22] text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
          {count}
        </span>
      )}
    </Link>
  );
}
