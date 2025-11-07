"use client";

import { Heart } from 'lucide-react';
import React from 'react';
import AnimatedContent from '../ui/AnimatedContent';
import Link from 'next/link';
import { Product } from '@/data/product';
import { BASE_URL } from '@/lib/urls';

const toggleFavorite = (id: number | string) => {
    // Add your favorite toggle logic here
};

const ProductCard = ({
  product,
  size,
  isfull = false,
  animate = true
}: {
  size : 'tees' | 'pants'
  product: Product
  isfull ?: boolean
  animate ?: boolean
}) => {

  if(animate) return (
    <AnimatedContent
      distance={150}
      key={product.id}
      direction="vertical"
      reverse={false}
      duration={0.8}
      initialOpacity={0}
      animateOpacity
      scale={1.1}
      threshold={0.2}
      delay={0.3}
    > 
      <ProductCard product={product} isfull animate={false} size={size}/>
    </AnimatedContent>
  )

  return (
    
      <div
        key={product.id}
        className={`flex-none ${isfull ? "w-full" : "w-[calc(25%-18px)] min-w-[400px]"}`}
      >
        <div className="group relative bg-white rounded-lg overflow-hidden mb-4">
         
          
          <button
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full hover:scale-110 transition-transform"
            aria-label={false ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 ${
                (false) 
                  ? 'fill-red-500 stroke-red-500'
                  : 'stroke-gray-700'
              }`}
            />
          </button>

          <Link href={`/product/${product.id}`}>
          <img 
            src={BASE_URL+product.images.find((i) => i.primaryImage)?.url} 
            alt={product.name}
            className={`${
              size == 'tees' ? "aspect-[4/4]" : "aspect-auto"
            } w-full h-full object-cover group-hover:scale-105 transition-transform duration-300`}
          />
          </Link>
        </div>

        <Link href={`/product/${product.id}`}>
         <h3 className="text-xl font-normal mb-1">{product.name}</h3>
        </Link>
<p className="text-lg font-light mb-2">
  <span className="text-sm font-light align-middle mr-1 text-pink-50">₹</span>
  {product.price.toLocaleString("en-IN")}
</p>


        {(
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(product.avgRating)
                      ? 'text-yellow-500'
                      : i < product.avgRating
                      ? 'text-yellow-500'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600">({product.reviewCount+""})</span>
          </div>
        )}
      </div> 
  );
};

export default ProductCard;