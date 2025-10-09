'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Jasper Knitted Shirt',
    price: 151,
    image: '/api/placeholder/320/400',
    badge: 'NEW IN',
    colors: ['#4A5568'],
    isFavorited: false
  },
  {
    id: 2,
    name: 'Intercity Crew Jumper',
    price: 151,
    image: '/api/placeholder/320/400',
    badge: 'NEW IN',
    colors: ['#CBD5E0', '#4299E1'],
    isFavorited: false
  },
  {
    id: 3,
    name: 'Shawl Shacket',
    price: 267,
    image: '/api/placeholder/320/400',
    badge: 'NEW IN',
    colors: ['#718096'],
    isFavorited: false
  },
  {
    id: 4,
    name: 'Bexley Jacket',
    price: 377,
    image: '/api/placeholder/320/400',
    badge: 'BESTSELLER',
    colors: ['#744210', '#1A202C', '#C05621', '#2D3748'],
    rating: 4.5,
    reviews: 93,
    isFavorited: false
  }
];

export default function ProductCarousel() {
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

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
        <h1 className="text-6xl font-light tracking-tight">New in AW25</h1>
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
            <div
              key={product.id}
              className="flex-none w-[calc(25%-18px)] min-w-[280px]"
            >
              <div className="group relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                <div className="absolute top-4 left-4 z-10">
                  <span className={`inline-block px-3 py-1 text-xs font-medium tracking-wider rounded-full ${
                    product.badge === 'BESTSELLER' 
                      ? 'bg-white text-black' 
                      : 'bg-white text-black'
                  }`}>
                    {product.badge}
                  </span>
                </div>
                
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full hover:scale-110 transition-transform"
                  aria-label={favorites[product.id] ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites[product.id]
                        ? 'fill-red-500 stroke-red-500'
                        : 'stroke-gray-700'
                    }`}
                  />
                </button>

                <div className="aspect-[3/4] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Product Image</span>
                </div>
              </div>

              <div className="flex gap-2 mb-3">
                {product.colors.map((color, idx) => (
                  <button
                    key={idx}
                    className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-gray-900 transition-colors"
                    style={{ backgroundColor: color }}
                    aria-label={`Color option ${idx + 1}`}
                  />
                ))}
              </div>

              <h3 className="text-xl font-normal mb-1">{product.name}</h3>
              <p className="text-lg font-light mb-2">${product.price}</p>

              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-500'
                            : i < product.rating
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({product.reviews})</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}