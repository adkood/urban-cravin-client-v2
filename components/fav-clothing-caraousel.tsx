"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
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

  const products: Product[] = [
    {
      id: 1,
      name: "Makers Crew Jumper",
      price: "$151",
      productImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/Makers-Crew-Jumper-Oak-Main_3cbd0d15-5c49-4527-9631-ac12c84f9c08_323x387_crop_center.jpg?v=1751292274",
      backgroundImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/Makers-Crew-neck-jumper-Campo-Desktop_1440x787_crop_center.jpg?v=1758548679",
      link: "/products/makers-stitch",
    },
    {
      id: 2,
      name: "Wilkinson Cardigan",
      price: "$226",
      productImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/Wilkinson-cardigan-oak-merino-wool-flatlay-2_1_323x387_crop_center.png?v=1738675543",
      backgroundImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/Wilkinson-cardigan-oak_1_1440x787_crop_center.jpg?v=1738675471",
      link: "/products/wilkinson-cardigan",
    },
    {
      id: 3,
      name: "Bexley Jacket",
      price: "$377",
      productImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/bexley-jacket-black-waxed-cotton-jacket-flatlay-2_323x387_crop_center.jpg?v=1726235485",
      backgroundImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/Bexley_Jacket_1440x787_crop_center.jpg?v=1726235282",
      link: "/products/bexley-jacket",
    },
    {
      id: 4,
      name: "Beckett Cable Knit Cardigan",
      price: "$199",
      productImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/beckett_-_ecru_-_Flatlay_1_323x387_crop_center.png?v=1740132609",
      backgroundImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/becket-cable-knit-cardigan-ecru_1440x787_crop_center.jpg?v=1740132576",
      link: "/products/beckett-cable-knit-cardigan",
    },
    {
      id: 5,
      name: "Ford Crew Jumper",
      price: "$151",
      productImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/Ford_Crew_Olive_323x387_crop_center.jpg?v=1728988717",
      backgroundImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/Wool_Overshirt_-_Barney_1_1440x787_crop_center.jpg?v=1728988639",
      link: "/products/ford-crew",
    },
    {
      id: 6,
      name: "Hudson Aran Jumper",
      price: "$185",
      productImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/Cream_Aran_Jumper_2_323x387_crop_center.jpg?v=1740133153",
      backgroundImage:
        "https://www.peregrineclothing.co.uk/cdn/shop/files/Hudson_Aran_Jumper_-_Ecru_1_1440x787_crop_center.jpg?v=1740133151",
      link: "/products/hudson-aran-jumper",
    },
  ];

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

  // Mouse Handlers
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

  // Touch Handlers
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
    <section className="relative w-full h-screen overflow-hidden">
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
            <div className="absolute inset-0">
              <img src={product.backgroundImage} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="relative w-full h-full flex items-center justify-center px-4 py-8 md:justify-end md:pr-12 lg:pr-16">
              <div className="relative bg-white w-full max-w-md md:max-w-lg lg:max-w-2xl p-12 md:p-16 lg:p-20">
                <div
                  className="absolute top-0 right-0 w-8 h-8 bg-gray-100"
                  style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                />
                <span className="absolute top-6 left-7 text-xs uppercase tracking-widest font-mono text-gray-600">
                  peregrine's personal favourites
                </span>
                <a href={product.link} className="block text-center mt-8">
                  <img
                    src={product.productImage}
                    alt={product.name}
                    className="w-full max-w-xs mx-auto mb-6 hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="text-2xl md:text-3xl font-semibold mb-3">{product.name}</h3>
                  <div className="text-lg font-medium text-gray-700">{product.price}</div>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute inset-y-0 right-0 w-full md:w-3/4 lg:w-1/2 flex items-center justify-center pointer-events-none px-4">
        <div className="relative w-full max-w-2xl">
          <div className="absolute top-0 left-0 right-0 flex justify-between px-4 lg:px-12 xl:px-20 pointer-events-auto">
            <button onClick={goPrev} className="p-3 text-orange-600 hover:text-orange-700" aria-label="Previous">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={goNext} className="p-3 text-orange-600 hover:text-orange-700" aria-label="Next">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2.5 pb-6 pointer-events-auto">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="p-1"
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={currentIndex === index}
              >
                <span
                  className={`block w-2 h-2 rounded-full transition-opacity duration-300 ${
                    currentIndex === index ? "bg-gray-800 opacity-100" : "bg-gray-800 opacity-30"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
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
