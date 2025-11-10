"use client";

import { useEffect, useState } from "react";
import TrendingCollections from "@/components/collection-showcase";
import FeaturedProductsCarousel from "@/components/fav-clothing-caraousel";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import HeroSection from "@/components/common/hero";
import Marquee from "@/components/marque";
import ProductCarousel from "@/components/product-list";
import ProductFeatureCard from "@/components/showcase-card";
import Testimonials from "@/components/testimonial";
import { TOP_HEADER_MARQUEE_ITEMS } from "@/lib/constants";
import { filterProductsAction, FilterProductsData } from "@/data/product";
import { Skeleton } from "@/components/ui/skeleton";
import { nunitoSans } from "@/lib/fonts";
import FAQ from "@/components/faq";

export default function Home() {
  const [tees, setTees] = useState<any[]>([]);
  const [pants, setPants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); 


  useEffect(() => {
    async function fetchAllProducts() {
      try {
        const [teesRes, pantsRes] = await Promise.all([
          filterProductsAction({
            categoryName: "OVERSIZED TEES",
            page: 0,
            size: 8,
          }) as Promise<FilterProductsData>,
          filterProductsAction({
            categoryName: "SWEATPANTS",
            page: 0,
            size: 8,
          }) as Promise<FilterProductsData>,
        ]);

        setTees(teesRes.products ?? []);
        setPants(pantsRes.products ?? []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false); 
      }
    }

    fetchAllProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50 overflow-hidden">
        <div className="text-center space-y-8 animate-fadeIn">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <h1 className={`${nunitoSans.className} text-[36  ] text-[40px] md:text-[50px] font-bold tracking-tight`}>
              URBAN
              <span className="text-[#9b1e22] mx-1">CRAVIN'</span>
            </h1>
          </div>

          <div className="relative w-14 h-14 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#9b1e22] animate-spin"></div>        
            <div className="absolute inset-2 rounded-full bg-[#9b1e22]/10 animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <Marquee marqueItems={TOP_HEADER_MARQUEE_ITEMS} />
      <Header />
      <HeroSection />
      <ProductCarousel
        title="Best Sellers"
        products={pants}
        isLoading={false}
        size="pants"
        layout="grid"
      />
      <TrendingCollections />

      {/* OVERSIZED TEES */}
      <ProductCarousel
        title="Oversized Tees"
        products={tees}
        isLoading={false}
        size="tees"
      />

      <ProductFeatureCard />

      {/* SWEAT PANTS */}
      <ProductCarousel
        title="SWEATPANTS"
        products={pants}
        isLoading={false}
        size="pants"
      />

      <FeaturedProductsCarousel />
      <Testimonials />
      <FAQ/>
      <Footer />
    </main>
  );
}