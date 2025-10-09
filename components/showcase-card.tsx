import React from 'react';

export default function ProductFeatureCard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-amber-50 w-full">
        <div className="flex flex-col lg:flex-row min-h-screen lg:h-[783px]">
          {/* Image Section */}
          <div className="relative w-full lg:w-1/2 p-4 lg:p-6">
            <div className="relative h-[400px] lg:h-full rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://www.peregrineclothing.co.uk/cdn/shop/files/Hudson-Aran-Cardigan-Skiddaw-Feature-Product_707x759_crop_center.jpg?v=1759142463"
                alt="Hudson Aran Cardigan"
                className="w-full h-full object-cover"
              />
              
              {/* Badge */}
              <div className="absolute top-[-30px] right-2 md:top-4 lg:top-8 lg:right-[-100px] text-center z-10">
                <span className="text-orange-600 text-3xl md:text-4xl font-serif italic block mb-1">
                  100% British Wool
                </span>
                <svg
                  className="inline-block text-orange-600"
                  fill="currentColor"
                  height="40"
                  viewBox="0 0 79 50"
                  width="79"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M35.8775 28.547c.1946-.044.3935-.0281.4785-.1191.2832-.3031.658-.4589.9917-.6754.4091-.2656.8964-.4327 1.2797-.706.5265-.3755 1.0813-.719 1.6284-1.0409.5639-.332 1.0743-.7536 1.6779-1.0278.27-.1227.477-.3827.7178-.5744.0258-.0205.0851.0006.1409.003.0187.0575.0384.1188.0637.1969-.3409.1951-.7305.3293-.9888.5927-.2319.2362-.5893.2401-.7475.4519-.1903.2548-.5394.216-.6657.4466-.1485.2715-.4849.1737-.6241.4009-.1667.2723-.5296.2101-.7099.4013-.2531.2685-.6865.2741-.8615.5213-.2372.3351-.7365.2109-.8741.6175-.3814.0618-.6296.3607-.9492.5325-.3612.1942-.767.3377-1.0678.6009-.2566.2247-.6181.2667-.8078.4841-.176.2019-.4364.1982-.5643.3634-.1727.2227-.4144.272-.6281.3964-.1781.1037-.3535.217-.5242.3371-.3139.2212-.608.489-1.0033.5752-.0915.02-.2395.0512-.2543.1063-.0927.3437-.4917.2293-.6548.467-.1859.2706-.5296.2685-.7929.4088-.0832.0444-.2227.0476-.2549.1113-.1216.2382-.4114.2275-.5479.3818-.1884.2124-.4383.1146-.632.2327-.2898.1758-.586.3419-.8828.5068-.2532.1407-.5108.2734-.7976.4264-.0123-.0041-.0731-.0245-.1075-.0361-.1233.1417-.2332.2683-.3161.364-.3303-.0269-.5752.058-.7595.2906-.2033.2566-.4961.1745-.7537.1951-.2966.0237-.3366.491-.7573.3594-.2109-.0659-.5074.1399-.7944.2326.3268-.4132.7363-.6301 1.1813-.7328.458-.105.7318-.5786 1.2325-.5649.1764-.2846.4565-.2399.737-.2179z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="relative flex w-full lg:w-1/2 p-6 lg:p-12">
            <div className="max-w-2xl my-auto">
              <a href="#" className="group inline-block">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 text-gray-900 transition-colors group-hover:text-orange-700">
                  The Hudson Aran Cardigan
                </h2>
                
                <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                  Inspired by our best-selling Hudson Aran Jumper, this men's wool cardigan is crafted from 100% British wool and features a classic cable knit, providing exceptional warmth in cold weather.
                </p>

                <span className="inline-block bg-orange-600 text-white px-8 py-4 rounded-md text-lg font-semibold transition-all hover:bg-orange-700 hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer">
                  Shop now
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}