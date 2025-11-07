"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import ProductGallery from "@/components/product/product-gallery";
import SizeChart from "@/components/product/size-chart";
import ProductReviews from "@/components/product/product-reviews";
import RelatedProducts from "@/components/product/related-products";
import { ChevronLeft, ChevronRight, Heart, RotateCcw, Shield, Truck } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/data/cart";
import type { Product } from "@/data/product";

type SizesType = "S" | "M" | "L" | "XL";

export default function ProductClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<SizesType>("M");
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [isPending, startTransition] = useTransition();

  const discountedPrice =
    product.discountPercentage
      ? product.price - (product.price * (product.discountPercentage / 100))
      : product.price;

  async function handleAddToCart() {
    startTransition(async () => {
      try {
        const res = await addToCart({
          productId: product.id,
          size: selectedSize,
          qty: quantity,
        });

        console.log(res)
        if(res.success) {
          toast.success("Item added to cart!");
        }
        else {
          toast.error("Failed to add to cart");
        }
      } catch (error) {
        toast.error("Failed to add to cart");
        console.error(error);
      }
    });
  }

  return (
    <div className="max-w-[90%] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="flex flex-col gap-6">
          {/* Header + Favorite */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-muted-foreground">{product.category.name.toUpperCase()}</p>
              </div>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
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
                      i < Math.floor(product.avgRating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium">{product.avgRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                ₹{discountedPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              {product.discountPercentage && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="px-3 py-1 bg-[#9b1e22] text-white rounded-md text-sm font-semibold">
                    Save {product.discountPercentage}%
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-green-600 font-medium">
              In Stock ({product.stockQuantity} available)
            </p>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Sizes */}
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
              {product.availableSizes.map((size) => (
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

          {/* Quantity */}
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

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold"
            onClick={handleAddToCart}
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add to Cart"}
          </Button>

          {/* Product perks */}
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

      <RelatedProducts />
      <ProductReviews productId={product.id} />
    </div>
  );
}
