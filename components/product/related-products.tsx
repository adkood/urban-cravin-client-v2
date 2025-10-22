"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef } from "react"
import ProductCard from "@/components/cards/product-card"
import { First_PRODUCT_LIST } from "@/lib/constants" // your RelatedProduct[] list

export default function RelatedProducts() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const displayProducts = First_PRODUCT_LIST;


  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current
    if (container) {
      const scrollAmount = 320 // how far to move per click
      const newPosition =
        direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount
      container.scrollTo({ left: newPosition, behavior: "smooth" })
      setScrollPosition(newPosition)
    }
  }

  return (
    <section className="border-t border-border mt-12 py-12 ">
      <div className="container mx-auto px-4 max-w-[90%]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">Related Products</h2>
            <p className="text-muted-foreground">You might also like these items</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2 border border-border rounded-lg hover:bg-muted transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2 border border-border rounded-lg hover:bg-muted transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Carousel - 4 visible cards */}
        <div className="hidden md:block relative overflow-hidden">
          <div
            ref={containerRef}
            id="related-products-scroll"
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
            style={{
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
            }}
          >
            {displayProducts.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-96 scroll-snap-align-start"
              >
                <ProductCard product={product} size="tees" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Grid - shows only 2x2 (4 items) */}
        <div className="md:hidden grid grid-cols-1 items-center justify-center mx-auto gap-4">
          {displayProducts.slice(0, 4).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              size="tees"
              isfull={true} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
