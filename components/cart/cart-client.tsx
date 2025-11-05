"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CartItem } from "@/components/cards/cart-item"
import { CartSummary } from "@/components/cart-summary"
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

interface CartClientProps {
  initialData: ActionResponse<GetCartResponse>
}

export default function CartClient({ initialData }: CartClientProps) {
  const [cart, setCart] = useState<ApiCart | null>(null)
  const [note, setNote] = useState("")
  const [giftWrapAdded, setGiftWrapAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialData.success && initialData.data?.cart) {
      setCart(initialData.data.cart)
    }
  }, [initialData])


  if (!initialData.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 min-h-[85svh] lg:px-8">
        <div className="py-12 text-center">
          <p className="mb-4 text-lg text-red-600">{initialData.error.includes("403") ? "Error: You are not logged in" : initialData.error}</p>
          <Button variant="default" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // ⏳ Loading fallback
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
      // Add one
      const res = await addToCart({
        productId: item.product.id,
        size: "M", // or derive from product if you store it
        qty: 1,
      })
      if (res.success) setCart(res.data.cart)
      else alert(res.error)
    } else if (newQuantity < item.quantity) {
      // Remove one
      const res = await removeFromCart({
        cartItemId: item.id,
        qty: 1,
      })
      if (res.success) setCart(res.data.cart)
      else alert(res.error)
    }

    setIsLoading(false)
  }

  // ❌ Remove item completely
  const removeItem = async (itemId: string) => {
    setIsLoading(true)
    const res = await removeFromCart({
      cartItemId: itemId,
      qty: 9999, // high number to remove all qty of that item
    })
    setIsLoading(false)

    if (res.success) setCart(res.data.cart)
    else alert(res.error)
  }

  // Dummy placeholders for optional features
  const handleAddGiftWrap = async () => setGiftWrapAdded(!giftWrapAdded)
  const handleSaveNote = async () => alert("Note saved!")

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

      <div className="grid gap-8 lg:grid-cols-3">
        {/* 🧾 Cart Items */}
        <div className="lg:col-span-2">
          <div className="hidden border-b border-border pb-4 md:block">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold">
              <div className="col-span-5">Product</div>
              <div className="col-span-3 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
          </div>

          <div className="space-y-4 py-4">
            {cart.items.map((item) => {
              const product = item.product
              const discountedPrice =
                product.discountAmount !== null
                  ? product.price - product.discountAmount
                  : product.price * (1 - product.discountPercentage / 100)

              return (
                <CartItem
                  key={item.id}
                  item={{
                    id: item.id,
                    title: product.name,
                    image: `/products/${product.sku}.jpg`,
                    price: discountedPrice,
                    quantity: item.quantity,
                  }}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  disabled={isLoading}
                />
              )
            })}
          </div>

          {/* 🎁 Gift Wrap */}
          <div className="border-t border-border pt-4">
            <button
              onClick={handleAddGiftWrap}
              disabled={isLoading}
              className="flex w-full items-center gap-3 rounded-lg p-4 text-left hover:bg-secondary disabled:opacity-50"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 12 20 22 4 22 4 12"></polyline>
                <rect x="2" y="7" width="20" height="5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
              </svg>
              <span className="text-sm">
                <span className="font-semibold">Do you want a gift wrap?</span>{" "}
                Only <span className="font-semibold">Rs.100.00</span>
              </span>
              {giftWrapAdded && (
                <span className="ml-auto text-green-600">Added</span>
              )}
            </button>
          </div>

          {/* 📝 Order Notes */}
          <div className="border-t border-border pt-4">
            <label htmlFor="note" className="mb-2 block text-sm font-semibold">
              {note ? "Edit Order Note" : "Add Order Note"}
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="How can we help you?"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none"
              rows={4}
            />
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleSaveNote}
              disabled={isLoading}
            >
              Save Note
            </Button>
          </div>
        </div>

        {/* 💰 Summary */}
        <CartSummary
          subtotal={subtotal}
          giftWrapPrice={giftWrapPrice}
          total={total}
        />
      </div>
    </div>
  )
}
