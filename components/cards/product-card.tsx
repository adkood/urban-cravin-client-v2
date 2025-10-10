import { Heart } from 'lucide-react';
import React from 'react';
import AnimatedContent from '../ui/AnimatedContent';

export type ProductType = {
  id: number;
  name: string;
  price: number;
  image: string;
  badge?: string;        
  colors: string[];      
  isFavorited: boolean;
  rating: number;
  reviews: number;
};

const toggleFavorite = (id: number) => {
    // Add your favorite toggle logic here
};

const ProductCard = ({
  product,
  size
}: {
  size : 'tees' | 'pants'
  product: ProductType
}) => {
  return (
    <AnimatedContent
      distance={150}
      key={product.id}
      direction="vertical"
      reverse={false}
      duration={0.4}
      initialOpacity={0}
      animateOpacity
      scale={1.1}
      threshold={0.2}
      delay={0.2}
    >
      <div
        key={product.id}
        className="flex-none w-[calc(25%-18px)] min-w-[400px]"
      >
        <div className="group relative bg-white rounded-lg overflow-hidden mb-4">
          <div className="absolute top-4 left-4 z-10">
            <span className={`inline-block px-3 py-1 text-xs font-medium tracking-wider rounded-full ${
              product.badge === 'BESTSELLER' 
                ? 'bg-slate-100/60 text-black' 
              : 'bg-slate-100/60 text-black'
            }`}>
              {product.badge}
            </span>
          </div>
          
          <button
            onClick={() => toggleFavorite(product.id)}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full hover:scale-110 transition-transform"
            aria-label={false ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-5 h-5 ${
                product.id % 2 == 0 
                  ? 'fill-red-500 stroke-red-500'
                  : 'stroke-gray-700'
              }`}
            />
          </button>

          <img 
            src={product.image} 
            alt={product.name}
            className={`${
              size == 'tees' ? "aspect-[4/4]" : "aspect-auto"
            } w-full h-full object-cover group-hover:scale-105 transition-transform duration-300`}
          />
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
    </AnimatedContent>
  );
};

export default ProductCard;