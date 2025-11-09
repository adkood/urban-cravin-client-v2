"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  salePrice: number
  discount: number
  image: string
  secondaryImage: string
  badge: string
  inStock: boolean
}

interface ProductCardProps {
  product: Product
  layout?: "grid" | "list"
}

export default function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (layout === "list") {
    return (
      <div className="flex gap-4 p-4 border border-border rounded-lg hover:shadow-md transition">
        <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">Rs. {product.salePrice.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground line-through">Rs. {product.price.toLocaleString()}</span>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Save {product.discount}%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative mb-4 bg-muted rounded-lg overflow-hidden aspect-square">
          <img
            src={isHovered ? product.secondaryImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />

          {/* Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              {product.badge}
            </span>
          </div>

          {/* Quick Add Button */}
          <button className="absolute bottom-3 right-3 p-2 bg-primary text-primary-foreground rounded-lg opacity-0 group-hover:opacity-100 transition">
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Product Info */}
        <div>
          <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Rs. {product.salePrice.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground line-through">Rs. {product.price.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
