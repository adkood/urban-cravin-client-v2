"use client";

import { useMemo } from "react";
import { COLLECTIONS as collections } from "@/lib/constants";
import AnimatedContent from "./ui/AnimatedContent";
import Link from "next/link";
import { type AdminCategory } from "@/data/admin";
import { BASE_URL } from "@/lib/urls";

interface TrendingCollectionsProps {
  categories?: AdminCategory[] | null;
}

const TrendingCollections = ({ categories }: TrendingCollectionsProps) => {
  const items = useMemo(() => {
    if (categories && categories.length > 0) {
      return categories.map((category, index) => {
        const imageUrl = category.imageUrl
          ? `${BASE_URL}${category.imageUrl}`
          : collections[index % collections.length]?.image ?? "/placeholder-front.png";

        return {
          id: category.id,
          category: category.slug?.replace(/-/g, " ").toUpperCase(),
          title: category.name,
          buttonText: "SHOP HERE",
          image: imageUrl,
          link: `/collection?category=${category.name}`,
          description: category.description,
          alt: category.name,
        };
      });
    }

    return collections.map((collection) => ({
      id: String(collection.id),
      category: collection.category,
      title: collection.title,
      buttonText: collection.buttonText,
      image: collection.image,
      link: collection.link,
      description: undefined as string | undefined,
      alt: collection.title,
    }));
  }, [categories]);

  return (
    <section className="relative w-full bg-white py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Three Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {items.map((collection) => (
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
                              alt={collection.alt ?? collection.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            
                            {/* Overlay with Text */}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300">
                              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                                {/* Category */}
                             
                                
                                {/* Title */}
                                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
                                  {collection.title}
                                </h3>
                             
                                
                                {/* Button */}
                                <Link href={collection.link} className="bg-white text-black text-xs md:text-sm font-semibold tracking-wide px-6 py-2.5 md:px-8 md:py-3 hover:bg-gray-100 transition-colors duration-200">
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