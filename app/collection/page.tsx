import { Suspense } from "react";
import ProductPage from "./client-page";

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ProductPage />
    </Suspense>
  );
}

