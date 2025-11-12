"use server"

import { BASE_URL, GET_ORDERS_URL_ADMIN } from "@/lib/urls"
import { ActionResponse, getAuthToken } from "./cart"
import { ApiOrdersResponse } from "./orders"
import axios, { AxiosError } from "axios"

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
      url: `${GET_ORDERS_URL_ADMIN}?page=${page}&size=${size}`,
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

interface ApiOrderStatusResponse {
  order: {
    id: string
    status: string
    paymentMethod: string
    totalPrice: number
    createdAt: string
    updatedAt: string
    items: Array<{
      id: string
      productId: string
      productName: string
      productImage: string[]
      size: string
      quantity: number
      unitPrice: number
      totalPrice: number
    }>
  }
}

export async function changeOrderStatus(
  orderId: string,
  status: "CONFIRMED" | "REFUNDED" | "COMPLETED" | "CANCELLED" | "DELIVERED"
): Promise<ActionResponse<ApiOrderStatusResponse>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      }
    }

    const config = {
      method: "put",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/api/orders/admin/${orderId}/status?status=${status}`,
      headers: {
        Authorization: token,
      },
    }

    const response = await axios.request<{
      status: string
      message: string
      data?: ApiOrderStatusResponse
    }>(config)

    const { status: respStatus, message, data } = response.data

    console.log(status)

    if (respStatus?.toLowerCase() !== "success" || !data) {
      return {
        success: false,
        error: message || "Failed to update order status",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        return { success: false, error: "Invalid order or status" }
      }
      if (error.response?.status === 403) {
        return { success: false, error: "You need to login as admin" }
      }

    return { success : false, error: error.response?.data.message}
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deleteReviewAdmin(
  reviewId: string
): Promise<ActionResponse<null>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      }
    }

    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `http://3.110.127.251:8080/api/reviews/${reviewId}`,
      headers: {
        Authorization: token,
      },
    }

    const response = await axios.request<{
      status: string
      message: string
    }>(config)

    const { status, message } = response.data

    if (status?.toLowerCase() !== "success") {
      return {
        success: false,
        error: message || "Failed to delete review",
      }
    }

    return {
      success: true,
      data: null,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return { success: false, error: "Review not found" }
      }
      if (error.response?.status === 403) {
        return { success: false, error: "You are not authorized to delete this review" }
      }
    }

    console.error("Error deleting review:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}