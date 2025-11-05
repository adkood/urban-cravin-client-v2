"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CartSummaryProps {
  subtotal: number
  giftWrapPrice: number
  total: number
}

export function CartSummary({ subtotal, giftWrapPrice, total }: CartSummaryProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-6 text-xl font-bold">Order Summary</h2>

      <div className="space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="font-semibold">Subtotal:</span>
          <span>Rs.{subtotal.toLocaleString()}</span>
        </div>

        {/* Gift Wrap */}
        {giftWrapPrice > 0 && (
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Gift Wrap:</span>
            <span>Rs.{giftWrapPrice.toLocaleString()}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-border pt-4"></div>

        {/* Total */}
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>Rs.{total.toLocaleString()}</span>
        </div>

        {/* Tax Info */}
        <p className="text-xs text-muted-foreground">Tax included and shipping calculated at checkout</p>

        {/* Checkout Button */}
        <Link href={"/checkout"}>
        <Button className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
          Check Out
        </Button>
        </Link>


        {/* Continue Shopping */}
        <Button variant="outline" className="w-full bg-transparent">
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}
