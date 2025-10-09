"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ✅ Extend the window interface for Instagram embed script
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

// ✅ Define product interface
interface Product {
  id: number;
  productName: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  inStock: boolean;
}

const ReelsComponent: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState<boolean>(false);

  // ✅ Product data
  const products: Product[] = [
    {
      id: 1,
      productName: "Everyday Hoodie - Jungle Green",
      price: "₹ 1499",
      originalPrice: "₹ 2499",
      discount: "40% Off",
      inStock: false,
    },
    {
      id: 2,
      productName: "Lounge Pants - Black",
      price: "₹ 1399",
      inStock: true,
    },
    {
      id: 3,
      productName: "Linen Pant - Black",
      price: "₹ 1999",
      inStock: true,
    },
    {
      id: 4,
      productName: "Everyday Oversized Tee - Beige",
      price: "₹ 1199",
      originalPrice: "₹ 1699",
      discount: "29% Off",
      inStock: false,
    },
    {
      id: 5,
      productName: "Everyday Hoodie - Kadak Chai Brown",
      price: "₹ 1499",
      inStock: true,
    },
  ];

  // ✅ Load Instagram Embed Script safely
  useEffect(() => {
    if (!scriptsLoaded) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        setScriptsLoaded(true);
        window.instgrm?.Embeds.process();
      };
    } else {
      window.instgrm?.Embeds.process();
    }
  }, [scriptsLoaded]);

  // ✅ Scroll handler with proper typing
  const scroll = (direction: "left" | "right"): void => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 360;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full bg-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h2 className="text-2xl font-normal mb-6 text-gray-900">Watch & Shop</h2>

        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>

          {/* Reels Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-80 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Instagram Reel Embed */}
                <div className="relative bg-gray-100 rounded-t-lg overflow-hidden">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-captioned
                    data-instgrm-permalink="https://www.instagram.com/reel/DOBWh4MEdsd/?utm_source=ig_embed&utm_campaign=loading"
                    data-instgrm-version="14"
                    style={{
                      background: "#FFF",
                      border: 0,
                      borderRadius: "3px",
                      boxShadow:
                        "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                      margin: "1px",
                      maxWidth: "540px",
                      minWidth: "326px",
                      padding: 0,
                      width: "calc(100% - 2px)",
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 border-t">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Product Icon */}
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-gray-900 font-normal line-clamp-2 mb-2">
                        {product.productName}
                      </h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base font-normal text-gray-900">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.discount && (
                        <span className="text-xs text-green-700 font-normal">
                          {product.discount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    className={`w-full py-2.5 rounded-md text-sm font-semibold transition-colors ${
                      product.inStock
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-gray-400 text-white cursor-not-allowed pointer-events-none"
                    }`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? "Buy Now" : "Out Of Stock"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Hide Scrollbar */}
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default ReelsComponent;
