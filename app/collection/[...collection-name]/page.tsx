"use client";

import ProductCard from "@/components/cards/product-card";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Marquee from "@/components/marque";
import { Button } from "@/components/ui/button";
import {  First_PRODUCT_LIST, LAST_PRODUCT_LIST, TOP_HEADER_MARQUEE_ITEMS } from "@/lib/constants";
import { ChevronDown, Filter, List, X } from "lucide-react";
import { useState } from "react";


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
    const [showFilters, setShowFilters] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1500 })
    const [inStockOnly, setInStockOnly] = useState(false)

    let filteredProducts = First_PRODUCT_LIST.concat(LAST_PRODUCT_LIST)
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter((p) => {
        return true
        })
    }

    if (inStockOnly) {
        filteredProducts = filteredProducts.filter((p) => true)
    }

    filteredProducts = filteredProducts.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max)

    if (sortBy === "price-asc") {
        filteredProducts.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
        filteredProducts.sort((a, b) => b.price - a.price)
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
        <div className="max-w-[95%] mx-auto">
        <div className="container mx-auto px-4 py-4 ">
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

        <div className="top-16 z-30 bg-background border-b border-border">
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
            <div className="inset-0 z-50 lg:hidden">
              <div className="inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
              <div className=" right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border p-6 overflow-y-auto">
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
              <div className={"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} size={'tees'} isfull/>
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
 </div>
        <Footer/>
    </main>
  );
}
