"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DHH_SHOWCASE_LISTING as products } from "@/lib/constants";

export interface DHHProductShocase {
  id: number;
  name: string;
  price: string;
  productImage: string;
  backgroundImage: string;
  link: string;
}

const FeaturedProductsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  };

  const goNext = () => goToSlide((currentIndex + 1) % products.length);
  const goPrev = () => goToSlide((currentIndex - 1 + products.length) % products.length);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    if (!isDragging || !scrollRef.current) return;
    setIsDragging(false);

    const slideWidth = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollRef.current.scrollLeft / slideWidth);
    setCurrentIndex(newIndex);
    goToSlide(newIndex);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden ">
      <div
        ref={scrollRef}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      >
        {products.map((product) => (
          <div key={product.id} className="relative flex-shrink-0 w-full h-full snap-start">
            <div className="flex w-full h-full">
              {/* Left Half - Background Image */}
              <div className="w-1/2 h-full overflow-hidden">
                <img 
                  src={product.backgroundImage} 
                  alt="" 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Right Half - Product Card */}
              <div className="w-1/2 h-full flex items-center justify-center bg-white p-8">
                <div className="relative w-full max-w-md">
                  <div
                    className="absolute top-0 right-0 w-8 h-8 bg-gray-100"
                    style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                  />
                  <span className="absolute top-0 left-0 text-xs uppercase tracking-widest font-mono text-gray-600">
                    DHH Collection
                  </span>
                  
                  <a href={product.link} className="block text-center mt-12">
                    <img
                      src={product.productImage}
                      alt={product.name}
                      className="w-full max-w-sm mx-auto mb-6 hover:scale-105 transition-transform duration-300"
                    />
                    <h3 className="text-3xl font-semibold mb-3">{product.name}</h3>
                    <div className="text-xl font-medium text-gray-700">{product.price}</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-between px-8 pointer-events-none -translate-y-1/2">
        <button 
          onClick={goPrev} 
          className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors pointer-events-auto"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
        <button 
          onClick={goNext} 
          className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors pointer-events-auto"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="p-1"
            aria-label={`Go to slide ${index + 1}`}
            aria-pressed={currentIndex === index}
          >
            <span
              className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-gray-800 opacity-100 scale-125" : "bg-gray-800 opacity-30"
              }`}
            />
          </button>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProductsCarousel;