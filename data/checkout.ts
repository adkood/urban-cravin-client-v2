"use server";

import { CHECKOUT_CASH_ON_DELIVERY_URL, CHECKOUT_ONLINE_URL } from "@/lib/urls";
import { ActionResponse, getAuthToken } from "./cart";
import axios from "axios";

export interface ApiOrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string[];
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ApiOrder {
  id: string;
  status: string;
  paymentMethod: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  items: ApiOrderItem[];
}

export interface CheckoutData {
  order: ApiOrder;
  paymentType: string;
  message: string;
  payment: any | null;
}

export interface CheckoutResponse {
  message: string;
  data: CheckoutData;
  status: string;
}

export async function checkoutCOD(
  addressId: string,
  couponCode?: string
): Promise<ActionResponse<CheckoutData>> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      };
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (addressId) queryParams.append("addressId", addressId);
    if (couponCode) queryParams.append("couponCode", couponCode);
    const url = `${CHECKOUT_CASH_ON_DELIVERY_URL}?${queryParams.toString()}`;

    const config = {
      method: "post" as const,
      maxBodyLength: Infinity,
      url,
      headers: {
        Authorization: token,
      },
    };

    const response = (await axios.request<CheckoutResponse>(config)).data;

    if (response.status.toLowerCase() !== "success") {
      return {
        success: false,
        error: response.message,
      };
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error during checkout:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export interface ApiPayment {
  orderId: string;
  key: string;
  currency: string;
  amount: number;
}

export interface CheckoutDataOnline {
  order: ApiOrder;
  paymentType: string;
  message: string;
  payment: ApiPayment;
}

export interface CheckoutResponseOnline {
  message: string;
  data: CheckoutDataOnline;
  status: string;
}

export async function checkoutOnline(
  addressId: string,
  couponCode?: string 
): Promise<ActionResponse<CheckoutDataOnline>> {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      };
    }

    // Build query string
    const queryParams = new URLSearchParams();
    if (addressId) queryParams.append("addressId", addressId);
    if (couponCode) queryParams.append("couponCode", couponCode);
    const url = `${CHECKOUT_ONLINE_URL}?${queryParams.toString()}`;

    const config = {
      method: "post" as const,
      maxBodyLength: Infinity,
      url,
      headers: {
        Authorization: token,
      },
    };

    const response = (await axios.request<CheckoutResponseOnline>(config)).data;

    if (response.status.toLowerCase() !== "success") {
      return {
        success: false,
        error: response.message,
      };
    }

    return {
      success: true,
      data: response.data as CheckoutDataOnline,
    };
  } catch (error) {
    console.error("Error during online checkout:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
