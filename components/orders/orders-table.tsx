"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { changeOrderStatus } from "@/data/admin"
import { StatusBadge } from "./status-badge"
import { StatusChangeModal } from "./status-change-modal"
import { ApiOrder } from "@/data/orders"
import {toast} from "sonner"

interface OrdersTableProps {
  orders: ApiOrder[]
  onStatusChange: () => void
}

const STATUS_OPTIONS = ["CONFIRMED", "DELIVERED", "CANCELLED", "REFUNDED", "COMPLETED"]

export function OrdersTable({ orders, onStatusChange }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string
    currentStatus: string
    newStatus: string
  } | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusSelect = (orderId: string, currentStatus: string, newStatus: string) => {
    if (newStatus === currentStatus) return
    setSelectedOrder({ id: orderId, currentStatus, newStatus })
  }

  const handleConfirmStatusChange = async () => {
    if (!selectedOrder) return

    console.log(selectedOrder);

    setIsUpdating(true)
    try {
      const result = await changeOrderStatus(
        selectedOrder.id,
        selectedOrder.newStatus as "CONFIRMED" | "REFUNDED" | "COMPLETED" | "CANCELLED" | "DELIVERED",
      )

      if (result.success) {
        toast.success(`Order status updated to ${selectedOrder.newStatus}`)
        onStatusChange()
      } else {
        toast.error(result.error || "Failed to update order status")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsUpdating(false)
      setSelectedOrder(null)
    }
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Shipping Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Change Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                <TableCell>{order.items.length} item(s)</TableCell>
                <TableCell className="font-semibold">₹{order.totalPrice.toFixed(2)}</TableCell>
                <TableCell className="capitalize text-sm">{order.paymentMethod}</TableCell>
                <TableCell className="text-sm">
                  <div className="space-y-0.5">
                    <div>{order.shippingAddress.street}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select onValueChange={(newStatus) => handleStatusSelect(order.id, order.status, newStatus)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <StatusChangeModal
        open={!!selectedOrder}
        orderId={selectedOrder?.id || ""}
        currentStatus={selectedOrder?.currentStatus || ""}
        newStatus={selectedOrder?.newStatus || ""}
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setSelectedOrder(null)}
        isLoading={isUpdating}
      />
    </>
  )
}
