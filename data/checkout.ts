import { CHECKOUT_CASH_ON_DELIVERY_URL, CHECKOUT_ONLINE_URL } from "@/lib/urls";
import { ActionResponse, getAuthToken } from "./cart";
import axios from "axios";

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

export interface CheckoutData {
  order: ApiOrder
  paymentType: string
  message: string
  payment: any | null
}

export interface CheckoutResponse {
  message: string
  data: CheckoutData
  status: string
}


export async function checkoutCOD(
  couponCode?: string
): Promise<ActionResponse<CheckoutData>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - No token found",
      }
    }

    const data = JSON.stringify({
      couponCode: couponCode || null,
    })

    const config = {
      method: "post" as const,
      maxBodyLength: Infinity,
      url: CHECKOUT_CASH_ON_DELIVERY_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data,
    }

    const response = (await axios.request<CheckoutResponse>(config)).data

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
    console.error("Error during checkout:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export interface ApiPayment {
  orderId: string
  key: string
  currency: string
  amount: number
}

export interface CheckoutDataOnline {
  order: ApiOrder
  paymentType: string
  message: string
  payment: ApiPayment 
}


export interface CheckoutResponseOnline {
  message: string
  data: CheckoutDataOnline
  status: string
}

export async function checkoutOnline(): Promise<
  ActionResponse<CheckoutDataOnline>
> {
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
      url: CHECKOUT_ONLINE_URL,
      headers: {
        Authorization: token,
      },
      data: "", // no body required
    }

    const response = (await axios.request<CheckoutResponseOnline>(config)).data

    if (response.status.toLowerCase() !== "success") {
      return {
        success: false,
        error: response.message,
      }
    }

    return {
      success: true,
      data: response.data as CheckoutDataOnline,
    }
  } catch (error) {
    console.error("Error during online checkout:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}