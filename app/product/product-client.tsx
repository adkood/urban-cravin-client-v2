"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ProductGallery from "@/components/product/product-gallery";
import SizeChart from "@/components/product/size-chart";
import ProductReviews from "@/components/product/product-reviews";
import RelatedProducts from "@/components/product/related-products";
import { ChevronLeft, ChevronRight, RotateCcw, Shield, Truck } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/data/cart";
import type { Product } from "@/data/product";
import { useCartStore } from "@/stores/cartStore";

const sizeOrder = ["XXXS","XXS","XS","S","M","L","XL","XXL","XXXL","XXXXL","XXXXXL","5XL","6XL"];
const UnitOrder = ["waist","chest","hip","bust"];

function normalizeSize(size: string): number {
  const normalizedSize = size.trim().toUpperCase();

  const match = normalizedSize.match(/(\d+(\.\d+)?)(\/(\d+(\.\d+)?))?/);
  if (match) {
    if (match[4]) {
      const numerator = parseFloat(match[1]);
      const denominator = parseFloat(match[4]);
      return numerator / denominator;
    }
    return parseFloat(match[1]);
  }

  const order = sizeOrder.indexOf(normalizedSize);
  if (order !== -1) {
    return order + 100; // Offset to ensure numeric sizes come first
  }

  const unitMatch = normalizedSize.match(new RegExp(UnitOrder.join("|"), "i"));
  if (unitMatch) {
    return sizeOrder.length + UnitOrder.indexOf(unitMatch[0].toLowerCase()) + 200;
  }

  return Number.MAX_SAFE_INTEGER;
}

function sortSizeLabels(a: string, b: string): number {
  const normalizedA = normalizeSize(a);
  const normalizedB = normalizeSize(b);

  if (normalizedA !== normalizedB) {
    return normalizedA - normalizedB;
  }

  return a.localeCompare(b);
}

export default function ProductClient({ product }: { product: Product }) {
  const sortedSizes = [...product.availableSizes].sort(sortSizeLabels);

  const [selectedSize, setSelectedSize] = useState<string>(
    () => sortedSizes[0] ?? ""
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [isPending, startTransition] = useTransition();
  const setCart = useCartStore((state) => state.setCart);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (sortedSizes.length === 0) {
      setSelectedSize("");
      return;
    }

    setSelectedSize((current) =>
      current && sortedSizes.includes(current)
        ? current
        : sortedSizes[0]
    );
  }, [sortedSizes]);

  // Calculate dates dynamically
  const today = new Date();
  const orderConfirmedDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const dispatchStart = new Date(today);
  dispatchStart.setDate(dispatchStart.getDate() + 1);
  const dispatchStartDate = dispatchStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const dispatchEnd = new Date(today);
  dispatchEnd.setDate(dispatchEnd.getDate() + 3);
  const dispatchEndDate = dispatchEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const deliveryStart = new Date(today);
  deliveryStart.setDate(deliveryStart.getDate() + 7);
  const deliveryStartDate = deliveryStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const deliveryEnd = new Date(today);
  deliveryEnd.setDate(deliveryEnd.getDate() + 11);
  const deliveryEndDate = deliveryEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

useEffect(() => {
  function updateTimeRemaining() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(23, 59, 59, 999); // end of the current day

    const diff = midnight.getTime() - now.getTime();

    if (diff <= 0) {
      setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setTimeRemaining({ hours, minutes, seconds });
  }

  updateTimeRemaining();
  const timer = setInterval(updateTimeRemaining, 1000);
  return () => clearInterval(timer);
}, []);

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
          setCart(res.data.cart);
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

        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Header + Favorite */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3 sm:mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
                <p className="text-sm sm:text-base text-muted-foreground">{product.category.name.toUpperCase()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg sm:text-2xl ${
                      i < Math.floor(product.avgRating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs sm:text-sm font-medium">{product.avgRating.toFixed(1)}</span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price - Made Responsive */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl font-bold">
                ₹{discountedPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              {product.discountPercentage && (
                <>
                  <span className="text-base sm:text-lg text-muted-foreground line-through">
                    ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#9b1e22] text-white rounded-md text-xs sm:text-sm font-semibold whitespace-nowrap">
                    Save {product.discountPercentage}%
                  </span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm text-green-600 font-medium">
              In Stock ({product.stockQuantity} available)
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{product.description}</p>

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
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {sortedSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 sm:py-3 px-3 sm:px-4 border-2 rounded-lg text-sm sm:text-base font-medium transition ${
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
            <div className="flex items-center gap-3 sm:gap-4 w-fit">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1.5 sm:p-2 border border-border rounded-lg hover:bg-muted transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-base sm:text-lg font-semibold w-6 sm:w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 sm:p-2 border border-border rounded-lg hover:bg-muted transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Shipping Timeline */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Order within
                </span>
              </div>
              <div className="flex items-center gap-0.5 font-mono text-sm font-semibold">
                <span>{String(timeRemaining.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span>{String(timeRemaining.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span>{String(timeRemaining.seconds).padStart(2, '0')}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Delivery: <span className="text-foreground font-medium">{deliveryStartDate} - {deliveryEndDate}</span>
            </p>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
            onClick={handleAddToCart}
            disabled={isPending || !selectedSize}
          >
            {isPending ? "Adding..." : "Add to Cart"}
          </Button>

          {/* Product perks */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-border">
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-[10px] sm:text-xs font-medium">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center">
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-[10px] sm:text-xs font-medium">Easy Returns</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-[10px] sm:text-xs font-medium">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts category={product.category.name} productId={product.id}/>
      <ProductReviews productId={product.id} />
    </div>
  );
}