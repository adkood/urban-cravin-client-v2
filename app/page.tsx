import TrendingCollections from "@/components/collection-showcase";
import FeaturedProductsCarousel from "@/components/fav-clothing-caraousel";
import Footer from "@/components/footer";
import Header from "@/components/header";
import HeroSection from "@/components/hero";
import Marquee from "@/components/marque";
import ProductCarousel from "@/components/product-list";
import ProductFeatureCard from "@/components/showcase-card";
import Testimonials from "@/components/testimonial";
import ReelsComponent from "@/components/watch-and-buy";
import { TOP_HEADER_MARQUEE_ITEMS } from "@/lib/constants";
import Image from "next/image";

export default function Home() {
  return (
      <main className="min-h-screen w-full bg-white text-black">
        <Marquee 
          marqueItems={
            TOP_HEADER_MARQUEE_ITEMS
          }
        />
        <Header/>
        <HeroSection/>
        <TrendingCollections/>
        <ProductCarousel/>
        <ProductFeatureCard/>
        <ProductCarousel/>
        <FeaturedProductsCarousel/>
        <Testimonials/>
        <Footer/>
      </main>
  );
}
