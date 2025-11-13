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
import {
  filterProductsAction,
  FilterProductsData,
  type Product,
} from "@/data/product";
import { getCategoriesAdmin, type AdminCategory } from "@/data/admin";
import { nunitoSans } from "@/lib/fonts";
import FAQ from "@/components/faq";

export default async function Home() {
  let categories: AdminCategory[] = [];
  let tees: Product[] = [];
  let pants: Product[] = [];

  try {
    const categoriesResponse = await getCategoriesAdmin();

    if (categoriesResponse.success && categoriesResponse.data) {
      categories = categoriesResponse.data.categories;
    } else if (!categoriesResponse.success) {
      console.error(
        "Failed to fetch categories",
        categoriesResponse.error ?? "Unknown error"
      );
    }

    const oversizedName =
      categories.find((category) => category.name === "OVERSIZED TEES")?.name ??
      "OVERSIZED TEES";
    const sweatpantsName =
      categories.find((category) => category.name === "SWEATPANTS")?.name ??
      "SWEATPANTS";

    const [teesRes, pantsRes] = await Promise.all([
      filterProductsAction({
        categoryName: oversizedName,
        page: 0,
        size: 8,
      }) as Promise<FilterProductsData>,
      filterProductsAction({
        categoryName: sweatpantsName,
        page: 0,
        size: 8,
      }) as Promise<FilterProductsData>,
    ]);

    tees = teesRes.products ?? [];
    pants = pantsRes.products ?? [];
  } catch (error) {
    console.error("Error loading home page data:", error);
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
      <TrendingCollections categories={categories} />

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