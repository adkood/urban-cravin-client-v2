"use client";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Marquee from "@/components/marque";
import {  TOP_HEADER_MARQUEE_ITEMS } from "@/lib/constants";
import { ChevronLeft, ChevronRight, Heart, RotateCcw, Shield, Star, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import ProductGallery from "@/components/product/product-gallery";
import SizeChart from "@/components/product/size-chart";
import ProductFeatureCard from "@/components/showcase-card";
import ProductReviews from "@/components/product/product-reviews";
import RelatedProducts from "@/components/product/related-products";
import { useCounterStore } from "@/providers/user-store-provider";

type SizesType = "L" | "S" | "M"

const mockProduct = {
  id: "00732618-b92c-46b0-aa4b-a9856cac6d94",
  name: "Street Art Collection",
  description: "Bold street art inspired design on premium quality fabric. Express your urban creativity.",
  price: 3499.0,
  discountAmount: 700,
  discountPercentage: 20,
  rating: 4.8,
  reviews: 289,
  stockQuantity: 30,
  sku: "SAC-002",
  category: {
    id: "bc386e70-f2ce-40d9-b162-6edda447e483",
    name: "t-shirts",
    slug: "tees",
  },
  images: [
    {
      id: "1",
      url: "/webp tshirt/Afterlife Coil/8_20250928_160829_0007.webp",
      primaryImage: true,
      altText: "Street Art Collection - Front View",
    },
    {
      id: "2",
      url: "/webp tshirt/Afterlife Coil/7_20250928_160829_0006.webp",
      primaryImage: false,
      altText: "Street Art Collection - Side View",
    },
    {
      id: "3",
      url: "/webp tshirt/Afterlife Coil/8_20250928_160829_0007.webp",
      primaryImage: false,
      altText: "Street Art Collection - Detail Zoom",
    },
  ],
  sizes: ["S", "M", "L"],
  colors: ["Black", "White", "Navy"],
  features: [
    "100% Premium Cotton",
    "Screen Printed Design",
    "Comfortable Fit",
    "Durable Quality",
    "Urban Style",
    "Eco-Friendly",
  ],
}


export default function ProductPage() {

  const [selectedSize, setSelectedSize] = useState<SizesType>("M")
  const [selectedColor, setSelectedColor] = useState<string>("Black")
  const [quantity, setQuantity] = useState<number>(1)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [showSizeChart, setShowSizeChart] = useState<boolean>(false)

  const discountedPrice = mockProduct.price - (mockProduct.discountAmount || 0)

  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  )



  return (
    <main className="min-h-screen w-full bg-white text-black">
        <Marquee 
            marqueItems={
            TOP_HEADER_MARQUEE_ITEMS
            }
        />
        <Header/>
        <div className="max-w-[90%] mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <ProductGallery images={mockProduct.images} productName={mockProduct.name} />

                <div className="flex flex-col gap-6">
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{mockProduct.name}</h1>
                            <p className="text-muted-foreground">{mockProduct.category.name.toUpperCase()}</p>
                        </div>
                        <button onClick={() => setIsFavorite(!isFavorite)} className="p-2 hover:bg-muted rounded-lg transition">
                            <Heart
                            className="w-6 h-6"
                            fill={isFavorite ? "currentColor" : "none"}
                            color={isFavorite ? "#ef4444" : "currentColor"}
                            />
                        </button>
                        </div>

                        <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`text-2xl ${
                                        i < Math.floor(mockProduct.rating)
                                        ? 'text-yellow-500'
                                        : i < mockProduct.rating
                                        ? 'text-yellow-500'
                                        : 'text-gray-300'
                                    }`}
                                    >
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="text-sm font-medium">{mockProduct.rating}</span>
                        <span className="text-sm text-muted-foreground">({mockProduct.reviews} reviews)</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-bold">
                            Rs. {discountedPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                        {mockProduct.discountAmount && (
                            <>
                            <span className="text-lg text-muted-foreground line-through">
                                Rs. {mockProduct.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </span>
                            <span className="px-3 py-1 bg-[#9b1e22] text-white rounded-md text-sm font-semibold">
                                Save {mockProduct.discountPercentage}%
                            </span>
                            </>
                        )}
                        </div>
                        <p className="text-sm text-green-600 font-medium">In Stock ({mockProduct.stockQuantity} available)</p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{mockProduct.description}</p>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">Size</label>
                        <button
                            onClick={() => setShowSizeChart(!showSizeChart)}
                            className="text-xs text-primary hover:underline"
                        >
                            Size Chart
                        </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                        {mockProduct.sizes.map((size) => (
                            <button
                            key={size}
                            onClick={() => setSelectedSize(size as SizesType)}
                            className={`py-3 px-4 border-2 rounded-lg font-medium transition ${
                                selectedSize === size
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary"
                            }`}
                            >
                            {size}
                            </button>
                        ))}
                        </div>
                        {showSizeChart && <SizeChart />}
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold">Color</label>
                        <div className="flex gap-3">
                        {mockProduct.colors.map((color) => (
                            <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition ${
                                selectedColor === color
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary"
                            }`}
                            >
                            {color}
                            </button>
                        ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold">Quantity</label>
                        <div className="flex items-center gap-4 w-fit">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 border border-border rounded-lg hover:bg-muted transition"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-2 border border-border rounded-lg hover:bg-muted transition"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                        </div>
                    </div>

                    <Button size="lg" className="w-full h-12 text-base font-semibold">
                        Add to Cart
                    </Button>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                        <div className="flex flex-col items-center gap-2 text-center">
                        <Truck className="w-5 h-5 text-primary" />
                        <span className="text-xs font-medium">Free Shipping</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center">
                        <RotateCcw className="w-5 h-5 text-primary" />
                        <span className="text-xs font-medium">Easy Returns</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center">
                        <Shield className="w-5 h-5 text-primary" />
                        <span className="text-xs font-medium">Secure Payment</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
      Count: {count}
      <hr />
      <button type="button" onClick={incrementCount}>
        Increment Count
      </button>
      <button type="button" onClick={decrementCount}>
        Decrement Count
      </button>
    </div>
        <RelatedProducts/>
        <ProductReviews />
        <Footer/>
    </main>
  );
}
