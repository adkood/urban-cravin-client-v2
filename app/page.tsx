"use client";
import TrendingCollections from "@/components/collection-showcase";
import FeaturedProductsCarousel from "@/components/fav-clothing-caraousel";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import HeroSection from "@/components/common/hero";
import Marquee from "@/components/marque";
import ProductCarousel from "@/components/product-list";
import ProductFeatureCard from "@/components/showcase-card";
import Testimonials from "@/components/testimonial";
import { LAST_PRODUCT_LIST, TOP_HEADER_MARQUEE_ITEMS } from "@/lib/constants";
import {First_PRODUCT_LIST} from '@/lib/constants'
import UserProfileSWR from "@/components/cards/user-profile";
import Cookies from 'js-cookie';
import { useEffect } from "react";
import { GET_CART_URL } from "@/lib/urls";



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
        <ProductCarousel 
          title="Hot Right Now"
          products={First_PRODUCT_LIST}
          size='tees'
        />
        <ProductFeatureCard/>
        <ProductCarousel 
          title="Chill Fits"
          products={LAST_PRODUCT_LIST}
          size={'pants'}
        />
        <FeaturedProductsCarousel/>
        <Testimonials/>
        <Footer/>
      </main>
  );
}
