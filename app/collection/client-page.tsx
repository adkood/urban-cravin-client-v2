"use client";

import ProductCard from "@/components/cards/product-card";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Marquee from "@/components/marque";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TOP_HEADER_MARQUEE_ITEMS } from "@/lib/constants";
import { filterProductsAction, FilterProductsData } from "@/data/product";
import { ChevronDown, Filter, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "title-asc", label: "Alphabetically, A-Z" },
  { value: "title-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "date-desc", label: "Date, new to old" },
];

interface ProductPageProps {
  categoryName: string;
}

export default function ProductPage({ categoryName }: ProductPageProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Filters
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

  const pageSize = 9; // 3x3 grid

  // Map slug → category name (you can expand this)

  const collectionName = categoryName;

  // Fetch products with filters & pagination
  const fetchProducts = useCallback(async () => {
    try {
      setIsReady(false);

      const res = (await filterProductsAction({
        categoryName,
        page: currentPage,
        size: pageSize,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      })) as FilterProductsData;

      setProducts(res.products ?? []);
      setTotalPages(res.totalPages ?? 1);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setIsReady(true);
    }
  }, [categoryName, currentPage, priceRange, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Full-section skeleton
  if (!isReady) {
    return (
      <main className="min-h-screen bg-white">
        <Marquee marqueItems={TOP_HEADER_MARQUEE_ITEMS} />
        <Header />
        <div className="max-w-[95%] mx-auto">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="container mx-auto px-4 py-8 border-b border-border">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>

          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="hidden lg:block space-y-6">
                <Skeleton className="h-64 w-full rounded-lg" />
              </aside>
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                      <Skeleton className="h-80 w-full rounded-2xl" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-5 w-1/2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <Marquee marqueItems={TOP_HEADER_MARQUEE_ITEMS} />
      <Header />

      <div className="max-w-[95%] mx-auto">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition">Collection</a>
            <span>/</span>
            <span className="text-foreground capitalize">{collectionName?.replace("-", " ")}</span>
          </div>
        </div>

        {/* Title */}
        <div className="container mx-auto px-4 py-8 border-b border-border">
          <h1 className="text-4xl font-bold mb-2 capitalize">{collectionName?.replace("-", " ")}</h1>
          <p className="text-muted-foreground">{products.length} products</p>
        </div>

        {/* Toolbar */}
        <div className="top-16 z-30 bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filter</span>
              </button>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-background text-sm font-medium appearance-none cursor-pointer pr-8"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Price</h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: +e.target.value })}
                    placeholder="Min"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: +e.target.value })}
                    placeholder="Max"
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                  />
                </div>
              </div>

        

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setPriceRange({ min: 0, max: 5000 });
                  setSortBy("featured");
                }}
              >
                Clear Filters
              </Button>
            </aside>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
                <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border p-6 overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-muted rounded-lg">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {/* Same filters as desktop */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Price</h3>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: +e.target.value })}
                          placeholder="Min"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                        />
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: +e.target.value })}
                          placeholder="Max"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-8" onClick={() => setShowFilters(false)}>
                    Apply
                  </Button>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} size="tees" isfull />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No products found</p>
                  <Button variant="outline" onClick={() => setCurrentPage(0)}>
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 0}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(i)}
                    >
                      {i + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages - 1}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}