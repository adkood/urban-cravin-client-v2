"use server"

import { ADD_CART_URL, GET_CART_URL, REMOVE_CART_URL } from "@/lib/urls"
import axios, { isAxiosError } from "axios"
import { cookies } from "next/headers"

export interface ApiProduct {
  id: string
  name: string
  price: number
  discountAmount: number | null
  discountPercentage: number
  taxPercentage: number
  active: boolean
  weight: number
  sku: string
  images : string[]
}

export interface ApiCartItem {
  id: string
  quantity: number
  unitPrice: number
  itemTotalPrice: number
  product: ApiProduct
}

export interface ApiCart {
  id: string
  userId: string
  username: string
  cartTotalPrice: number
  createdAt: string
  updatedAt: string
  items: ApiCartItem[]
}

export interface GetCartResponse {
  cart: ApiCart
}

export type ActionResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("Authorization")?.value
  return token || null
}

// Get Cart Data
export async function getCart(): Promise<ActionResponse<GetCartResponse>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - No token found",
      }
    }

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: GET_CART_URL,
        headers: { 
            'Authorization': token
        }
    };

    const response = (await axios.request<{
        status : string
        message : string
        data : GetCartResponse
    }>(config)).data

    if(response.status.toLowerCase() !== 'success') {
        return {
            success : false,
            error : response.message
        }
    }

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error fetching cart:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export interface RemoveCartRequest {
  cartItemId: string
  qty: number
}

export interface RemoveCartResponse {
  cart: ApiCart
}

export async function removeFromCart(
  payload: RemoveCartRequest
): Promise<ActionResponse<RemoveCartResponse>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - No token found",
      }
    }

    const config = {
      method: "delete" as const,
      maxBodyLength: Infinity,
      url: REMOVE_CART_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: JSON.stringify(payload),
    }

    const response = (
      await axios.request<{
        status: string
        message: string
        data: RemoveCartResponse
      }>(config)
    ).data

    if (response.status.toLowerCase() !== "success") {
      return {
        success: false,
        error: response.message,
      }
    }

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error removing from cart:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export interface AddToCartResponse {
  cart: ApiCart
}

export interface AddToCartRequest {
  productId: string
  size: string
  qty: number
}

export async function addToCart(
  payload: AddToCartRequest
): Promise<ActionResponse<AddToCartResponse>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - No token found",
      }
    }

    const config = {
      method: "post" as const,
      maxBodyLength: Infinity,
      url: ADD_CART_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: JSON.stringify(payload),
    }

    const response = (
      await axios.request<{
        status: string
        message: string
        data: AddToCartResponse
      }>(config)
    ).data

    if (response.status.toLowerCase() !== "success") {
      return {
        success: false,
        error: response.message,
      }
    }

    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error("Error adding to cart:", error)

    if(isAxiosError(error)) {
        return {
      success: false,
      error: error.response?.data.message ||  "Couldn't add to Cart",
    }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}