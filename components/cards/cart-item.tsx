"use client"

import { Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"

interface CartItemProps {
  item: {
    id: string
    title: string
    image: string
    price: number
    quantity: number
  }
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onRemove: (itemId: string) => void
  disabled?: boolean
}

export function CartItem({ item, onUpdateQuantity, onRemove, disabled = false }: CartItemProps) {
  const itemTotal = item.price * item.quantity

  return (
    <div className="border-b border-border pb-4 last:border-0">
      <div className={`grid gap-4 md:grid-cols-12 ${disabled ? "opacity-60 pointer-events-none" : ""}`}>
        {/* Product Info */}
        <div className="col-span-12 md:col-span-5">
          <div className="flex gap-4">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
              <Image src={item.image || "/placeholder.svg"} alt={item.title} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                disabled={disabled}
                className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 disabled:opacity-50"
              >
                <Trash2 size={16} />
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="hidden md:col-span-3 md:flex md:items-center md:justify-center">
          <span className="text-sm font-semibold">Rs.{item.price.toLocaleString()}</span>
        </div>

        {/* Quantity */}
        <div className="col-span-6 md:col-span-2">
          <div className="flex items-center justify-between gap-1 rounded-lg border border-border bg-secondary">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={disabled}
              className="flex items-center justify-center p-2 hover:bg-background disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => {
                const value = Number.parseInt(e.target.value) || 0
                if (value >= 0) onUpdateQuantity(item.id, value)
              }}
              className="w-12 bg-secondary text-center text-sm font-semibold outline-none"
              min="0"
              disabled={disabled}
            />
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              disabled={disabled}
              className="flex items-center justify-center p-2 hover:bg-background disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="col-span-6 flex items-center justify-end md:col-span-2 md:justify-end">
          <span className="text-right text-sm font-semibold">Rs.{itemTotal.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
