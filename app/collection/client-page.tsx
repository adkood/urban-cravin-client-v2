"use client";

import ProductCard from "@/components/cards/product-card";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Marquee from "@/components/marque";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TOP_HEADER_MARQUEE_ITEMS } from "@/lib/constants";
import {
  filterProductsAction,
  FilterProductsData,
  Product,
} from "@/data/product";
import { ChevronDown, Filter, X } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { useSearchParams } from "next/navigation";

const sortOptions = [
  { value: "title-asc", label: "Alphabetically, A-Z" },
  { value: "title-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ProductPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReady, setIsReady] = useState(false);
  // Filters
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 5000 });

  const debouncedPriceRange = useDebounce(tempPriceRange, 500); // 500ms delay

  const categoryQuery = searchParams.get("category")?.trim() || undefined;
  const tagQuery = searchParams.get("tag")?.trim() || undefined;

  const pageSize = 9; // 3x3 grid

  const displayName = useMemo(() => {
    if (categoryQuery) {
      return categoryQuery.replace(/-/g, " ").toUpperCase();
    }
    if (tagQuery) {
      return `#${tagQuery.toUpperCase()}`;
    }
    return "All Products";
  }, [categoryQuery, tagQuery]);

  // Reset pagination when query changes
  useEffect(() => {
    setCurrentPage(0);
  }, [categoryQuery, tagQuery]);

  // Fetch products with filters & pagination
  const fetchProducts = useCallback(async () => {
    try {
      setIsReady(false);

      const res = (await filterProductsAction({
        categoryName: categoryQuery || undefined,
        tags: tagQuery || undefined,
        page: currentPage,
        size: pageSize,
        minPrice: debouncedPriceRange.min,
        maxPrice: debouncedPriceRange.max,
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
  }, [categoryQuery, tagQuery, currentPage, debouncedPriceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortedProducts = useMemo(() => {
    if (!products.length) return [];

    const sorted = [...products];

    if (sortBy === "title-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "title-desc") {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "price-asc") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => b.price - a.price);
    }
    // "featured" = default order (no sort)

    return sorted;
  }, [products, sortBy]);

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
            <span className="text-foreground">
              {displayName}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="container mx-auto px-4 py-8 border-b border-border">
          <h1 className="text-4xl font-bold mb-2">{displayName}</h1>
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
                  onChange={(e) => {
                    setCurrentPage(0);
                    setSortBy(e.target.value)
                  }}
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
    <div className="px-2">
      <Slider
        defaultValue={[tempPriceRange.min, tempPriceRange.max]}
        value={[tempPriceRange.min, tempPriceRange.max]}
        onValueChange={([min, max]) => setTempPriceRange({ min, max })}
        min={0}
        max={5000}
        step={100}
        className="w-full bg-black"
      />
      <div className="flex justify-between text-sm text-muted-foreground mt-2">
        <span>₹{tempPriceRange.min}</span>
        <span>₹{tempPriceRange.max}</span>
      </div>
    </div>
  </div>

  <Button
    variant="outline"
    className="w-full"
    onClick={() => {
      setTempPriceRange({ min: 0, max: 5000 });
      setSortBy("featured");
      setCurrentPage(0);
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
                    <Slider
                      defaultValue={[tempPriceRange.min, tempPriceRange.max]}
                      value={[tempPriceRange.min, tempPriceRange.max]}
                      onValueChange={([min, max]) => setTempPriceRange({ min, max })}
                      min={0}
                      max={5000}
                      step={100}
                      className="w-full bg-black"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>₹{tempPriceRange.min}</span>
                      <span>₹{tempPriceRange.max}</span>
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
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} size="tees" isfull animate={false} />
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