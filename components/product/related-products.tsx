"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ProductCard from "@/components/cards/product-card";
import { filterProductsAction, FilterProductsData } from "@/data/product";
import { Skeleton } from "@/components/ui/skeleton";

export default function RelatedProducts({category,productId} : {category : string, productId : string}) {
  const [products, setProducts] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false); // ← Only render when ready
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Fetch 3 Oversized Tees
  useEffect(() => {
    async function fetchRelated() {
      try {
        const res = (await filterProductsAction({
          categoryName: category,
          page: 0,
          size: 3,
        })) as FilterProductsData;

        setProducts(res.products.filter(v => v.id !== productId) ?? []);
      } catch (err) {
        console.error("Error:", err);
        setProducts([]);
      } finally {
        setIsReady(true);
      }
    }
    fetchRelated();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;

    const scrollAmount = 320;
    const newPos =
      direction === "left"
        ? scrollPosition - scrollAmount
        : scrollPosition + scrollAmount;

    container.scrollTo({ left: newPos, behavior: "smooth" });
    setScrollPosition(newPos);
  };

  // FULL-SECTION SKELETON (same height as final content)
  if (!isReady) {
    return (
      <section className="border-t border-border mt-12 py-12">
        <div className="container mx-auto px-4 max-w-[90%]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                Related Products
              </h2>
              <p className="text-muted-foreground">
                You might also like these items
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              <div className="p-2 border border-border rounded-lg w-9 h-9" />
              <div className="p-2 border border-border rounded-lg w-9 h-9" />
            </div>
          </div>

          {/* Desktop Skeleton */}
          <div className="hidden md:flex gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-96 space-y-4">
                <Skeleton className="h-96 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ))}
          </div>

          {/* Mobile Skeleton */}
          <div className="md:hidden space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-80 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // REAL CONTENT — mounts ONCE when ready
  return (
    <section className="border-t border-border mt-12 py-12">
      <div className="container mx-auto px-4 max-w-[90%]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              Related Products
            </h2>
            <p className="text-muted-foreground">
              You might also like these items
            </p>
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

        {/* Desktop Carousel */}
        <div className="hidden md:block">
          <div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 no-scrollbar"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-96 scroll-snap-align-start"
              >
                <ProductCard product={product} size="tees" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Grid */}
        <div className="md:hidden grid grid-cols-1 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              size="tees"
              isfull={true}
              animate={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}