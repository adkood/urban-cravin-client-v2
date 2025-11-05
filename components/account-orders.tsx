"use client"

import { useEffect, useState } from "react"
import { getUserOrders } from "@/data/orders"
import { ApiOrder } from "@/data/orders"
import { Button } from "@/components/ui/button"
import { Package, Truck, CreditCard, AlertCircle } from "lucide-react"
import { BASE_URL } from "@/lib/urls"

export default function AccountOrders() {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getUserOrders()
        if (res.success) {
          setOrders(res.data)
        } else {
          setError(res.error)
        }
      } catch (err) {
        setError("Failed to load orders")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-6">
        <h1 className="text-2xl font-semibold font-mono">My Orders</h1>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 rounded-lg border border-gray-200"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 p-6 hover:border-gray-300 transition-colors rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="w-4 h-4 text-gray-600" />
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-gray-100 mb-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 py-4"
                    >
                      <img
                        src={BASE_URL+item.productImage?.[0]}
                        alt={item.productName}
                        className="w-16 h-16 rounded-md object-cover border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        ₹{item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CreditCard className="w-4 h-4" />
                    {order.paymentMethod}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{order.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-dashed border-gray-300 p-12 text-center rounded-lg">
              <p className="text-gray-500 mb-4">
                You haven't placed any orders yet.
              </p>
              <Button className="bg-black text-white hover:bg-gray-800">
                Start Shopping
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
