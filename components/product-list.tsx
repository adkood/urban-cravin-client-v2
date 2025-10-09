'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import ProductCard, { ProductType } from './cards/product-card';

export default function ProductCarousel({
 title,
 products,
 size = 'tees'
} : 
{
  title : string,
  products : ProductType[]
  size : 'tees' | 'pants'
}) {
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction : string) => {
    if (direction === 'left') {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(Math.min(products.length - 4, currentIndex + 1));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-6xl font-light tracking-tight">{title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={currentIndex === 0}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={currentIndex >= products.length - 4}
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Next products"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 25}%)` }}
        >
          {products.map((product) => (
              <ProductCard 
                product={product} 
                key={product.id}
                size={size}
              />
          ))}
        </div>
      </div>
    </div>
  );
}