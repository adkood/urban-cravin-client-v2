import { getCart } from "@/data/cart"
import CartClient from "@/components/cart/cart-client"
import { redirect } from "next/navigation"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

export default async function CartPage() {
  const result = await getCart()



  if (!result.success) {
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