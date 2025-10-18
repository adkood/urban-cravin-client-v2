"use client"

interface ProductInfoProps {
  name: string
  description: string
  price: number
  discountedPrice: number
  rating: number
  reviews: number
}

export default function ProductInfo({ name, description, price, discountedPrice, rating, reviews }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">{name}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
