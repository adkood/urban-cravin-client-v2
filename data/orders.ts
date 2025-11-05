"use server"

import axios from "axios"
import { GET_ORDERS_URL } from "@/lib/urls"
import { ActionResponse, getAuthToken } from "./cart"

export interface ApiOrderItem {
  id: string
  productId: string
  productName: string
  productImage: string[]
  size: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface ApiOrder {
  id: string
  status: string
  paymentMethod: string
  totalPrice: number
  createdAt: string
  updatedAt: string
  items: ApiOrderItem[]
}

export async function getUserOrders(): Promise<ActionResponse<ApiOrder[]>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - No token found",
      }
    }

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: GET_ORDERS_URL,
      headers: {
        Authorization: token,
      },
    }

    const response = (
      await axios.request<{
        status: string
        message: string
        data?: ApiOrder[]
      }>(config)
    ).data

    // Handle failed status or missing data
    if (response.status?.toLowerCase() !== "success" || !response.data) {
      return {
        success: false,
        error: response.message || "Failed to fetch orders",
      }
    }

    return {
      success: true,
      data: response.data,
    }
  } catch (error: any) {
    // Handle explicit 400 (no orders found)
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        return {
          success: false,
          error: "No orders found for this user",
        }
      }
    }

    console.error("Error fetching user orders:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
