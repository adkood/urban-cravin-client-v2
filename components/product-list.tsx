'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './cards/product-card'
import { Product } from '@/data/product'

export default function ProductCarousel({
  title,
  products,
  size = 'tees',
  isLoading,
  layout = 'slider', 
}: {
  title: string
  products: Product[]
  isLoading: boolean
  size: 'tees' | 'pants'
  layout?: 'slider' | 'grid' 
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // dragging logic (only used in slider mode)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollStart, setScrollStart] = useState(0)
  const [dragDistance, setDragDistance] = useState(0)

  const scrollByAmount = (amount: number) => {
    scrollContainerRef.current?.scrollBy({
      left: amount,
      behavior: 'smooth',
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current || layout !== 'slider') return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollStart(scrollContainerRef.current.scrollLeft)
    setDragDistance(0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current || layout !== 'slider') return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.2
    setDragDistance(Math.abs(walk))
    scrollContainerRef.current.scrollLeft = scrollStart - walk
  }

  const handleEndDrag = () => {
    if (layout !== 'slider') return
    setIsDragging(false)
    setTimeout(() => setDragDistance(0), 100)
  }

  const handleCardClick = (e: any) => {
    if (layout === 'slider' && dragDistance > 5) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-20 py-8 sm:py-12 bg-white">
      
      
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-tight">
          {title}
        </h1>

        {layout === 'slider' && (
          <div className="flex gap-2">
            <button
              onClick={() => scrollByAmount(-300)}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-all"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
            <button
              onClick={() => scrollByAmount(300)}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-all"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </button>
          </div>
        )}
      </div>

    {layout === 'grid' && (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} size={size} />
          </div>
        ))}
      </div>
    )}

      {/* ---- SLIDER VIEW ---- */}
      {layout === 'slider' && (
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scroll-smooth no-scrollbar select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleEndDrag}
          onMouseLeave={handleEndDrag}
          onTouchStart={(e) => handleMouseDown(e as any)}
          onTouchMove={(e) => handleMouseMove(e as any)}
          onTouchEnd={handleEndDrag}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[260px] sm:w-[320px] md:w-[360px] lg:w-[400px]"
              onClick={handleCardClick}
              onTouchEnd={handleCardClick}
            >
              <ProductCard product={product} size={size} />
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
