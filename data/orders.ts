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
  shippingAddress: {
    id: string
    fullName: string | null
    street: string
    city: string
    state: string
    postalCode: string
    country: string
    defaultAddress: boolean
  }
  items: ApiOrderItem[]
}

export interface ApiOrdersResponse {
  orders: ApiOrder[]
  currentPage: number
  pageSize: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export async function getUserOrders(
  page = 0,
  size = 5
): Promise<ActionResponse<ApiOrdersResponse>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      }
    }

    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${GET_ORDERS_URL}?page=${page}&size=${size}`,
      headers: {
        Authorization: token,
      },
    }

    const response = await axios.request<{
      status: string
      message: string
      data?: ApiOrdersResponse
    }>(config)

    const { status, message, data } = response.data

    if (status?.toLowerCase() !== "success" || !data) {
      return {
        success: false,
        error: message || "Failed to fetch orders",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        return { success: false, error: "No orders found for this user" }
      }
      if (error.response?.status === 403) {
        return { success: false, error: "You need to login to view your orders" }
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