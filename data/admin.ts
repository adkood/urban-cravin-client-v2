"use server"

import { BASE_URL, GET_ORDERS_URL_ADMIN } from "@/lib/urls"
import { ActionResponse, getAuthToken } from "./cart"
import { ApiOrdersResponse } from "./orders"
import { Product } from "./product"
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

export interface AdminCreateProductPayload {
  name: string
  description: string
  price: number
  discountPercentage: number
  taxPercentage: number
  active: boolean
  sku: string
  categoryId: string
  sizeQuantities: Record<string, number>
  images?: string[]
  tags?: string[]
}

interface ApiAdminCreateProductResponse {
  product: Product
}

export async function createProductAdmin(
  payload: AdminCreateProductPayload
): Promise<ActionResponse<ApiAdminCreateProductResponse>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      }
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/categories/products/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: payload,
    }

    const response = await axios.request<{
      status: string
      message: string
      data?: ApiAdminCreateProductResponse
    }>(config)

    const { status, message, data } = response.data

    if (status?.toLowerCase() !== "success" || !data?.product) {
      return {
        success: false,
        error: message || "Failed to create product",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        return { success: false, error: error.response?.data?.message || "Invalid product payload" }
      }
      if (error.response?.status === 403) {
        return { success: false, error: "You need to login as admin" }
      }

      return {
        success: false,
        error: error.response?.data?.message || "Failed to create product",
      }
    }

    console.error("Error creating product:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export interface AdminUploadProductImagePayload {
  productId: string
  file: File
  altText: string
  isPrimary?: boolean
  tag?: string
}

interface ApiAdminUploadProductImageResponse {
  product: Product
}

export interface AdminUpdateProductTagsResponse {
  productId: string
  tags: string[]
}

export async function uploadProductImageAdmin({
  productId,
  file,
  altText,
  isPrimary = false,
  tag,
}: AdminUploadProductImagePayload): Promise<
  ActionResponse<ApiAdminUploadProductImageResponse>
> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      }
    }

    console.log("isPrimary: ", isPrimary)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("altText", altText)
    formData.append("isPrimary", String(isPrimary))
    if (tag) {
      formData.append("tag", tag)
    }

    const response = await fetch(
      `${BASE_URL}/categories/products/images/${productId}`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: errorText || "Failed to upload product image",
      }
    }

    const json = (await response.json()) as {
      status: string
      message: string
      data?: ApiAdminUploadProductImageResponse
    }

    if (json.status?.toLowerCase() !== "success" || !json.data?.product) {
      return {
        success: false,
        error: json.message || "Failed to upload product image",
      }
    }

    return {
      success: true,
      data: json.data,
    }
  } catch (error: any) {
    console.error("Error uploading product image:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function updateProductTagsAdmin(
  productId: string,
  tags: string[]
): Promise<ActionResponse<AdminUpdateProductTagsResponse>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      }
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/categories/products/${productId}/tags`,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: JSON.stringify(tags),
    }

    const response = await axios.request<{
      status: string
      message: string
      data?: AdminUpdateProductTagsResponse
    }>(config)

    const { status, message, data } = response.data

    if (status?.toLowerCase() !== "success" || !data) {
      return {
        success: false,
        error: message || "Failed to update product tags",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        return {
          success: false,
          error: error.response?.data?.message || "Invalid tags payload",
        }
      }
      if (error.response?.status === 403) {
        return {
          success: false,
          error: "You need to login as admin",
        }
      }

      return {
        success: false,
        error: error.response?.data?.message || "Failed to update product tags",
      }
    }

    console.error("Error updating product tags:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deleteProductAdmin(
  productId: string
): Promise<ActionResponse<null>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      }
    }

    const response = await axios.request<{
      status: string
      message: string
    }>({
      method: "delete",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/categories/products/${productId}`,
      headers: {
        Authorization: token,
      },
    })

    const { status, message } = response.data

    if (status?.toLowerCase() !== "success") {
      return {
        success: false,
        error: message || "Failed to delete product",
      }
    }

    return {
      success: true,
      data: null,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return { success: false, error: "Product not found" }
      }
      if (error.response?.status === 403) {
        return { success: false, error: "You need to login as admin" }
      }

      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete product",
      }
    }

    console.error("Error deleting product:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deleteProductImageAdmin(
  imageId: string
): Promise<ActionResponse<null>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      }
    }

    const response = await axios.request<{
      status: string
      message: string
    }>({
      method: "delete",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/categories/products/images/${imageId}`,
      headers: {
        Authorization: token,
      },
    })

    const { status, message } = response.data

    if (status?.toLowerCase() !== "success") {
      return {
        success: false,
        error: message || "Failed to delete image",
      }
    }

    return {
      success: true,
      data: null,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return { success: false, error: "Image not found" }
      }
      if (error.response?.status === 403) {
        return { success: false, error: "You need to login as admin" }
      }

      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete image",
      }
    }

    console.error("Error deleting product image:", error)
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
      url: `${BASE_URL}/api/reviews/${reviewId}`,
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

export interface AdminCategory {
  id: string
  name: string
  description: string
  slug: string
  active: boolean
  imageUrl: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
  parentCategory: AdminCategory | null
}

interface AdminCategoriesResponse {
  categories: AdminCategory[]
}

export async function getCategoriesAdmin(): Promise<
  ActionResponse<AdminCategoriesResponse>
> {
  try {
    const token = await getAuthToken()

    const response = await fetch(`${BASE_URL}/categories/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: errorText || "Failed to fetch categories",
      }
    }

    const json = (await response.json()) as {
      status: string
      message: string
      data?: AdminCategoriesResponse
    }

    if (json.status?.toLowerCase() !== "success" || !json.data) {
      return {
        success: false,
        error: json.message || "Failed to fetch categories",
      }
    }

    return {
      success: true,
      data: json.data,
    }
  } catch (error: any) {
    console.error("Error fetching categories:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}