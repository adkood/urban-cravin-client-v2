// app/product/[id]/page.tsx
import { getProductById } from "@/data/product";
import ProductClient from "../product-client";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import Marquee from "@/components/marque";
import { TOP_HEADER_MARQUEE_ITEMS } from "@/lib/constants";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params
  const result = await getProductById(id);

  if (!result.success || !result.data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white text-gray-600">
        <p>{result.message || "Product not found."}</p>
      </main>
    );
  }

  const product = result.data;

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <Marquee marqueItems={TOP_HEADER_MARQUEE_ITEMS} />
      <Header />
      <ProductClient product={product} />
      <Footer />
    </main>
  );
}
