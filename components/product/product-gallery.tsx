"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { BASE_URL } from "@/lib/urls"

interface ProductGalleryProps {
  images: Array<{
    id: string
    url: string
    primaryImage: boolean
    altText: string
    tag: string
  }>
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  images = [...images.filter(v => v.tag !== "bg")].sort((a, b) => (b.primaryImage ? 1 : 0) - (a.primaryImage ? 1 : 0));
  const [selectedImageIndex, setSelectedImageIndex] = useState(images.findIndex((i) => i.primaryImage))
  const [isZoomed, setIsZoomed] = useState(false)

  const selectedImage = images[selectedImageIndex]

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Image */}
      <div className="relative rounded-lg overflow-hidden aspect-square group">
        <Image
          src={BASE_URL+selectedImage.url}
          alt={selectedImage.altText}
          fill
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          priority={selectedImageIndex === 0}
        />

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-lg transition md:opacity-0 md:group-hover:opacity-100"
        >
          <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Navigation Arrows - Always visible on mobile, hover on desktop */}
        <button
          onClick={handlePrevious}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-lg transition md:opacity-0 md:group-hover:opacity-100"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-white/90 hover:bg-white rounded-lg transition md:opacity-0 md:group-hover:opacity-100"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 bg-black/50 text-white text-xs rounded-full">
          {selectedImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery - Responsive grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1.5 sm:gap-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition ${
              selectedImageIndex === index ? "border-primary" : "border-border hover:border-primary/50"
            }`}
          >
            <Image src={BASE_URL+image.url || "/placeholder.svg"} alt={image.altText} fill className="object-contain" />
          </button>
        ))}
      </div>
    </div>
  )
}