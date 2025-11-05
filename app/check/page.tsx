import { getCart } from "@/data/cart"

export default async function Page() {
  const cart = await getCart()

  return (
    <ul>
      {cart.data?.cart.items[0].product.name}
    </ul>
  )
}