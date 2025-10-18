"use client";

import ProductCard from "@/components/cards/collection-product-card";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Marquee from "@/components/marque";
import { Button } from "@/components/ui/button";
import {  TOP_HEADER_MARQUEE_ITEMS } from "@/lib/constants";
import { ChevronDown, Filter, LayoutGrid, List, X } from "lucide-react";
import { useState } from "react";

const mockProducts = [
  {
    id: "1",
    name: "Warlock Grey Boxy Oversized Tshirt",
    price: 1699,
    salePrice: 1299,
    discount: 24,
    image: "/grey-tshirt.jpg",
    secondaryImage: "/grey-tshirt-back.jpg",
    badge: "Save 24%",
    inStock: true,
  },
  {
    id: "2",
    name: "Tusk Tribal White Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/white-vest.jpg",
    secondaryImage: "/white-vest-back.jpg",
    badge: "Save 23%",
    inStock: true,
  },
  {
    id: "3",
    name: "Samael Grave Black Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/black-vest.jpg",
    secondaryImage: "/black-vest-back.jpg",
    badge: "Save 23%",
    inStock: true,
  },
  {
    id: "4",
    name: "Crimson Red Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/red-vest.jpg",
    secondaryImage: "/red-vest-back.jpg",
    badge: "Save 23%",
    inStock: true,
  },
  {
    id: "5",
    name: "Sinner Red Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/sinner-red-vest.jpg",
    secondaryImage: "/sinner-red-vest-back.jpg",
    badge: "Save 23%",
    inStock: true,
  },
  {
    id: "6",
    name: "Octagon Royal Blue Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/blue-vest.jpg",
    secondaryImage: "/blue-vest-back.jpg",
    badge: "Save 23%",
    inStock: true,
  },
  {
    id: "7",
    name: "Axial Olive Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/olive-vest.jpg",
    secondaryImage: "/olive-vest-back.jpg",
    badge: "Save 23%",
    inStock: true,
  },
  {
    id: "8",
    name: "Lumina Royal Blue Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/lumina-blue-vest.jpg",
    secondaryImage: "/placeholder.svg?height=400&width=400",
    badge: "Save 23%",
    inStock: true,
  },
  {
    id: "9",
    name: "Orb Black Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/placeholder.svg?height=400&width=400",
    secondaryImage: "/placeholder.svg?height=400&width=400",
    badge: "Save 23%",
    inStock: true,
  },
  {
    id: "10",
    name: "Mortal Royal Blue Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/placeholder.svg?height=400&width=400",
    secondaryImage: "/placeholder.svg?height=400&width=400",
    badge: "Save 23%",
    inStock: true,
  },
  {
    id: "11",
    name: "Hollow Sky Blue Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/placeholder.svg?height=400&width=400",
    secondaryImage: "/placeholder.svg?height=400&width=400",
    badge: "Save 23%",
    inStock: true,
  },
  {
    id: "12",
    name: "Azure Sky Blue Boxy Unisex Vest",
    price: 1299,
    salePrice: 999,
    discount: 23,
    image: "/placeholder.svg?height=400&width=400",
    secondaryImage: "/placeholder.svg?height=400&width=400",
    badge: "Save 23%",
    inStock: true,
  },
]

const categories = [
  { name: "Vests", count: 31 },
  { name: "T-Shirts", count: 25 },
  { name: "Tank Tops", count: 2 },
]

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "title-asc", label: "Alphabetically, A-Z" },
  { value: "title-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "date-asc", label: "Date, old to new" },
  { value: "date-desc", label: "Date, new to old" },
]

export default function ProductPage() {

    const [sortBy, setSortBy] = useState("featured")
    const [layout, setLayout] = useState<"grid" | "list">("grid")
    const [showFilters, setShowFilters] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 })
    const [inStockOnly, setInStockOnly] = useState(false)

    let filteredProducts = mockProducts
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter((p) => {
        if (selectedCategory === "Vests") return p.name.includes("Vest")
        if (selectedCategory === "T-Shirts") return p.name.includes("Tshirt")
        if (selectedCategory === "Tank Tops") return p.name.includes("Tank")
        return true
        })
    }

    if (inStockOnly) {
        filteredProducts = filteredProducts.filter((p) => p.inStock)
    }

    filteredProducts = filteredProducts.filter((p) => p.salePrice >= priceRange.min && p.salePrice <= priceRange.max)

    if (sortBy === "price-asc") {
        filteredProducts.sort((a, b) => a.salePrice - b.salePrice)
    } else if (sortBy === "price-desc") {
        filteredProducts.sort((a, b) => b.salePrice - a.salePrice)
    } else if (sortBy === "title-asc") {
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "title-desc") {
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
    }

  return (
    <main className="min-h-screen w-full bg-white text-black">
        <Marquee 
            marqueItems={
            TOP_HEADER_MARQUEE_ITEMS
            }
        />
        <Header/>

        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition">
                Home
            </a>
            <span>/</span>
            <span className="text-foreground">Collection</span>
            </div>
      </div>   

        <div className="container mx-auto px-4 py-8 border-b border-border">
        <h1 className="text-4xl font-bold mb-2">Our Collection</h1>
        <p className="text-muted-foreground">{filteredProducts.length} products</p>
      </div>

        <div className="sticky top-16 z-30 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Filter Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-sm font-medium appearance-none cursor-pointer pr-8"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
            </div>

            {/* Layout Toggle (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 border border-border rounded-lg p-1">
              <button
                onClick={() => setLayout("grid")}
                className={`p-2 rounded transition ${layout === "grid" ? "bg-muted" : "hover:bg-muted"}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`p-2 rounded transition ${layout === "list" ? "bg-muted" : "hover:bg-muted"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block">
            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold mb-4">Category</h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label key={cat.name} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategory === cat.name}
                        onChange={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm">
                        {cat.name} <span className="text-muted-foreground">({cat.count})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Price</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Availability</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">In stock only</span>
                </label>
              </div>
            </div>
          </aside>

          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border p-6 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-muted rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-4">Category</h3>
                    <div className="space-y-3">
                      {categories.map((cat) => (
                        <label key={cat.name} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedCategory === cat.name}
                            onChange={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                            className="w-4 h-4 rounded border-border"
                          />
                          <span className="text-sm">
                            {cat.name} <span className="text-muted-foreground">({cat.count})</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Price</h3>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                          placeholder="Min"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                        />
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                          placeholder="Max"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Availability</h3>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-border"
                      />
                      <span className="text-sm">In stock only</span>
                    </label>
                  </div>
                </div>

                <Button className="w-full mt-8">View Results</Button>
              </div>
            </div>
          )}

          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} layout={layout} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No products found</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory(null)
                    setPriceRange({ min: 0, max: 1500 })
                    setInStockOnly(false)
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
 
        <Footer/>
    </main>
  );
}
