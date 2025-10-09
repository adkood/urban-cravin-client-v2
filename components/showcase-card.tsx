import React from 'react';

export default function ProductFeatureCard() {
  return (
    <div className="min-h-[80vh] bg-gray-50">
      <section className="bg-[#f5f5f5] w-full">
        <div className="flex flex-col lg:flex-row lg:h-[650px]">
          <div className="relative w-full lg:w-1/2 p-4 lg:p-6">
            <div className="relative h-[400px] lg:h-full rounded-lg overflow-hidden shadow-lg">
              <img
                src="/tee.jpg"
                alt="Showcase Photo"
                className="aspect-auto object-contain"
              />
            </div>
          </div>

          <div className="relative flex w-full lg:w-1/2 p-6 lg:p-12">
            <div className="max-w-2xl my-auto">
              <a href="#" className="group inline-block">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 text-gray-900 transition-colors">
                  Streetwise Knit
                </h2>
                
                <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                  We craft more than clothes—we craft attitude. Bold designs, premium materials, and streetwise style that speaks for itself. Every piece is made to turn heads, move freely, and last long.
                </p>

                <span className="inline-block bg-black text-white px-8 py-4 rounded-md text-lg font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
                  Explore the Collection
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
