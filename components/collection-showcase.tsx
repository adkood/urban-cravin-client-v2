import { COLLECTIONS as collections } from "@/lib/constants";
import AnimatedContent from "./ui/AnimatedContent";
import Link from "next/link";

const TrendingCollections = () => {
  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {collections.map((collection) => (
            <AnimatedContent
              distance={150}
              key={collection.id}
              direction="vertical"
              reverse={false}
              duration={0.8}
              initialOpacity={0}
              animateOpacity
              scale={1.1}
              threshold={0.2}
              delay={0.3}
            >
                        <div
                          className="relative block overflow-hidden group"
                        >
                          {/* Image */}
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <img
                              src={collection.image}
                              alt={collection.alt}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            
                            {/* Overlay with Text */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                                {/* Category */}
                                <p className="text-xs md:text-sm font-medium tracking-widest mb-2 opacity-90">
                                  {collection.category}
                                </p>
                                
                                {/* Title */}
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                                  {collection.title}
                                </h3>
                                
                                {/* Button */}
                                <Link href={`/collection/${collection.title}`} className="bg-white text-black text-xs md:text-sm font-semibold tracking-wide px-6 py-2.5 md:px-8 md:py-3 hover:bg-gray-100 transition-colors duration-200">
                                  {collection.buttonText}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
            </AnimatedContent>

          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCollections;