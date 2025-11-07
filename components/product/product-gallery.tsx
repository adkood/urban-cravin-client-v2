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
  }>
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  images = [...images].sort((a, b) => (b.primaryImage ? 1 : 0) - (a.primaryImage ? 1 : 0));
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
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-muted rounded-lg overflow-hidden aspect-square group">
        <Image
          src={BASE_URL+selectedImage.url}
          alt={selectedImage.altText}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={selectedImageIndex === 0}
        />

        {/* Zoom Button */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-lg transition md:hidden"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-lg transition opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-lg transition opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/50 text-white text-xs rounded-full">
          {selectedImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      <div className="grid grid-cols-6 gap-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition ${
              selectedImageIndex === index ? "border-primary" : "border-border hover:border-primary/50"
            }`}
          >
            <Image src={BASE_URL+image.url || "/placeholder.svg"} alt={image.altText} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
