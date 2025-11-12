"use client"

import { useEffect, useState } from "react"
import { getUserOrders } from "@/data/admin"
import { OrdersTable } from "@/components/orders/orders-table"
import { OrdersPagination } from "@/components/orders/orders-pagination"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ApiOrdersResponse } from "@/data/orders"

export default function AdminOrdersPage() {
  const [data, setData] = useState<ApiOrdersResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const loadOrders = async (page: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getUserOrders(page - 1, 10)

      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || "Failed to load orders")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders(currentPage)
  }, [currentPage])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Orders</h1>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <Spinner className="h-8 w-8" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          </div>
        ) : data && data.orders.length > 0 ? (
          <div className="space-y-6">
            <OrdersTable orders={data.orders} onStatusChange={() => loadOrders(currentPage)} />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing page {data.currentPage + 1} of {data.totalPages} ({data.totalElements} total orders)
              </p>
              {data.totalPages > 1 && (
                <OrdersPagination
                  currentPage={currentPage}
                  totalPages={data.totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          </div>
        ) : (
          <Alert>
            <AlertDescription>No orders found</AlertDescription>
          </Alert>
        )}
      </div>
    </main>
  )
}
