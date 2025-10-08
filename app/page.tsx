import Footer from "@/components/footer";
import Header from "@/components/header";
import HeroSection from "@/components/hero";
import Marquee from "@/components/marque";
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
        <Footer/>
      </main>
  );
}
