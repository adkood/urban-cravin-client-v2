"use client"

import { useEffect, useState } from "react"
import { getUserOrders } from "@/data/orders"
import { ApiOrder, ApiOrdersResponse } from "@/data/orders"
import { Button } from "@/components/ui/button"
import { Package, Truck, CreditCard, AlertCircle } from "lucide-react"
import { BASE_URL } from "@/lib/urls"
import { Skeleton } from "./ui/skeleton"

export default function AccountOrders() {
  const [orders, setOrders] = useState<ApiOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Pagination state
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 3 // can be adjusted if needed

  const fetchOrders = async (currentPage: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await getUserOrders(currentPage, pageSize)
      if (res.success) {
        setOrders(res.data.orders)
        setTotalPages(res.data.totalPages)
      } else {
        setError(res.error || "Failed to fetch orders")
      }
    } catch {
      setError("Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders(page)
  }, [page])

  const handleNext = () => {
    if (page + 1 < totalPages) setPage((p) => p + 1)
  }

  const handlePrevious = () => {
    if (page > 0) setPage((p) => p - 1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-6">
        <h1 className="text-2xl font-semibold font-mono">My Orders</h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <p>{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-6 space-y-4"
            >
              {/* Header skeleton */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              {/* Items skeleton */}
              {[1, 2].map((j) => (
                <div key={j} className="flex items-center gap-4 py-2">
                  <Skeleton className="w-16 h-16 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}

              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Orders list */}
          {orders.length > 0 ? (
            <>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 p-6 hover:border-gray-300 transition-colors rounded-lg"
                >
                  {/* Order header */}
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

                  {/* Order items */}
                  <div className="divide-y divide-gray-100 mb-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 py-4"
                      >
                        <img
                          src={BASE_URL + item.productImage?.[0]}
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

                  {/* Order summary */}
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
              ))}

              {/* Pagination controls */}
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  onClick={handlePrevious}
                >
                  Previous
                </Button>

                <span className="text-sm text-gray-600">
                  Page {page + 1} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  disabled={page + 1 >= totalPages}
                  onClick={handleNext}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="border border-dashed border-gray-300 p-12 text-center rounded-lg">
              <p className="text-gray-500 mb-4">
                You haven’t placed any orders yet.
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
