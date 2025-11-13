"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  addToCart,
  removeFromCart,
} from "@/data/cart" 
import {
  ActionResponse,
  GetCartResponse,
  ApiCart,
} from "@/data/cart"
import Link from "next/link"
import Image from "next/image"
import { BASE_URL } from "@/lib/urls"
import { Gift, Minus, Plus, Trash2 } from "lucide-react"
import { useCartStore } from "@/stores/cartStore"

interface CartClientProps {
  initialData: ActionResponse<GetCartResponse>
}

export default function CartClient({ initialData }: CartClientProps) {
  const [cart, setCart] = useState<ApiCart | null>(null)
  const [note, setNote] = useState("")
  const [giftWrapAdded, setGiftWrapAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const setCartCount = useCartStore((state) => state.setCart);

  useEffect(() => {
    if (initialData.success && initialData.data?.cart) {
      setCart(initialData.data.cart)
      setCartCount(initialData.data.cart)
    }
  }, [initialData])

  if (!initialData.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 min-h-[85svh] lg:px-8">
        <div className="py-12 text-center">
          <p className="mb-4 text-lg text-red-600">
            {initialData.error.includes("403") ? "Error: You are not logged in" : initialData.error}
          </p>
          <Button variant="default" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!cart) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 min-h-[85svh] lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading your cart...</p>
          </div>
        </div>
      </div>
    )
  }

  const hasItems = cart.items.length > 0

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    const item = cart.items.find((i) => i.id === itemId)
    if (!item) return

    setIsLoading(true)

    if (newQuantity > item.quantity) {
      const res = await addToCart({
        productId: item.product.id,
        size: item.size,
        qty: 1,
      })
      if (res.success) {
        setCartCount(res.data.cart)
        setCart(res.data.cart)
      }
      else alert(res.error)
    } else if (newQuantity < item.quantity) {
      const res = await removeFromCart({
        cartItemId: item.id,
        qty: 1,
      })
      if (res.success) {
        setCartCount(res.data.cart)
        setCart(res.data.cart)
      }
      else alert(res.error)
    }

    setIsLoading(false)
  }

  const removeItem = async (itemId: string) => {
    setIsLoading(true)
    const res = await removeFromCart({
      cartItemId: itemId,
      qty: 9999,
    })
    setIsLoading(false)

    if (res.success) {
      setCartCount(res.data.cart)
      setCart(res.data.cart)
    }
    else alert(res.error)
  }

  const subtotal = cart.cartTotalPrice
  const giftWrapPrice = giftWrapAdded ? 100 : 0
  const total = subtotal + giftWrapPrice

  if (!hasItems) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 min-h-[85svh] lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
        <div className="py-12 text-center">
          <p className="mb-4 text-lg text-muted-foreground">
            Your cart is empty
          </p>
          <Button variant="default" asChild>
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 min-h-[85svh] lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Your Cart</h1>
      {/* Header Row */}
      <div className="mb-6 hidden border-b pb-4 md:grid md:grid-cols-12 md:gap-4 text-sm font-semibold uppercase tracking-wide">
        <div className="col-span-5">Product</div>
        <div className="col-span-2 text-center">Price</div>
        <div className="col-span-3 text-center">Quantity</div>
        <div className="col-span-2 text-right">Total</div>
      </div>

      {/* Cart Items */}
      <div className="space-y-6 border-b pb-6">
        {cart.items.map((item) => {
          const product = item.product
          const displayPrice = item.unitPrice
          return (
            <div
              key={item.id}
              className={`${
                isLoading ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {/* Mobile Layout */}
              <div className="md:hidden flex flex-col gap-3 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex gap-3">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded">
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src={product.images[0] ? BASE_URL+product.images[0] : "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </Link>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold uppercase tracking-wide text-sm line-clamp-2">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">RS.{displayPrice.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={isLoading || item.quantity <= 1}
                      className="text-gray-600 hover:text-black disabled:opacity-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isLoading}
                      className="text-gray-600 hover:text-black disabled:opacity-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      RS.{item.itemTotalPrice.toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="text-gray-500 hover:text-red-600 disabled:opacity-50 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:grid grid-cols-12 items-center gap-4">
                <div className="col-span-5 flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded">
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src={product.images[0] ? BASE_URL+product.images[0] : "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold uppercase tracking-wide">{product.name}</h3>
                    </Link>
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={isLoading}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="col-span-2 text-center">
                  <span className="text-sm font-medium">RS.{displayPrice.toLocaleString()}</span>
                </div>

                <div className="col-span-3 flex justify-center">
                  <div className="inline-flex items-center gap-3 rounded-md border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={isLoading || item.quantity <= 1}
                      className="text-gray-600 hover:text-black disabled:opacity-50"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={isLoading}
                      className="text-gray-600 hover:text-black disabled:opacity-50"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="col-span-2 text-right">
                  <span className="text-sm font-semibold">
                    RS.{item.itemTotalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Checkout Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-6 pt-6">
        <div className="text-sm text-gray-600 max-w-md">
          TAX INCLUDED AND SHIPPING CALCULATED AT CHECKOUT
        </div>
        <div className="text-right w-full sm:w-auto">
          <div className="mb-4 flex items-baseline justify-end gap-2">
            <span className="text-sm font-medium uppercase tracking-wide">Subtotal:</span>
            <span className="text-2xl font-bold">RS.{total.toLocaleString()}</span>
          </div>
          <Button
            disabled={isLoading}
            className="w-full sm:w-auto rounded-md bg-black px-12 py-3 text-sm font-medium uppercase tracking-wide text-white hover:bg-gray-800 disabled:opacity-50"
            asChild={!isLoading}
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : (
              <Link href="/checkout">Check Out</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
