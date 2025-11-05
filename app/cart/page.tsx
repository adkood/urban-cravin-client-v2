// app/cart/page.tsx
import { getCart } from "@/data/cart"
import CartClient from "@/components/cart/cart-client"
import { redirect } from "next/navigation"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

export default async function CartPage() {
  const result = await getCart()

  // Redirect to login if unauthorized
  if (!result.success && result.error?.includes("Unauthorized")) {
    redirect("/login?redirect=/cart")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartClient initialData={result} />
      <Footer />
    </div>
  )
}