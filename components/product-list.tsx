'use client'

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './cards/product-card'
import { Product } from '@/data/product'

export default function ProductCarousel({
  title,
  products,
  size = 'tees',
  isLoading,
}: {
  title: string
  products: Product[]
  isLoading: boolean
  size: 'tees' | 'pants'
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollStart, setScrollStart] = useState(0)
  const [dragDistance, setDragDistance] = useState(0)

  const scrollByAmount = (amount: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: amount,
        behavior: 'smooth',
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollStart(scrollContainerRef.current.scrollLeft)
    setDragDistance(0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.2
    setDragDistance(Math.abs(walk))
    scrollContainerRef.current.scrollLeft = scrollStart - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setTimeout(() => setDragDistance(0), 100)
  }

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false)
      setTimeout(() => setDragDistance(0), 100)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!scrollContainerRef.current) return
    setIsDragging(true)
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft)
    setScrollStart(scrollContainerRef.current.scrollLeft)
    setDragDistance(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 1.2
    setDragDistance(Math.abs(walk))
    scrollContainerRef.current.scrollLeft = scrollStart - walk
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setTimeout(() => setDragDistance(0), 100)
  }

  const handleCardClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragDistance > 5) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
          {title}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => scrollByAmount(-300)}
            className="p-1.5 sm:p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-all"
            aria-label="Previous products"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
          <button
            onClick={() => scrollByAmount(300)}
            className="p-1.5 sm:p-2 rounded-full border border-gray-300 hover:bg-gray-50 transition-all"
            aria-label="Next products"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scroll-smooth no-scrollbar select-none cursor-grab active:cursor-grabbing"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px]"
            onClick={handleCardClick}
            onTouchEnd={handleCardClick}
          >
            <ProductCard product={product} size={size} />
          </div>
        ))}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}