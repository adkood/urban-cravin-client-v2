"use server"

import axios from "axios"
import { cookies } from "next/headers"
import { ADD_REVIEW_URL, BASE_URL } from "@/lib/urls"
import { getAuthToken } from "./cart"

export interface ApiReview {
  id: string
  rating: number
  comment: string
  createdAt: string
  productId: string
  productName: string
  userId: string
  userName: string
  likeCount: number
  hasLiked: boolean
}

export interface AddReviewResponse {
  review: ApiReview
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }


export async function addReview({
  productId,
  rating,
  comment,
}: {
  productId: string
  rating: number
  comment: string
}): Promise<ActionResponse<AddReviewResponse>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return { success: false, error: "Unauthorized - No token found" }
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: ADD_REVIEW_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: {
        productId,
        rating,
        comment,
      },
    }

    const response = (
      await axios.request<{
        status: string
        message: string
        data: AddReviewResponse
      }>(config)
    ).data

    if (response.status.toLowerCase() !== "success") {
      return { success: false, error: response.message }
    }

    return { success: true, data: response.data }
  } catch (error) {
    console.error("Error adding review:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

interface FilterProductsParams {
  page?: number;
  size?: number;
  minPrice?: number;
  maxPrice?: number;
  categoryName?: string;
  search?: string;
  token: string;
}

export async function filterProductsAction({
  page = 0,
  size = 5,
  minPrice,
  maxPrice,
  categoryName,
  search,
  token,
}: FilterProductsParams) {
  try {

    const token = await getAuthToken()

    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
    if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
    if (categoryName) params.append("categoryName", categoryName);
    if (search) params.append("search", search);

    const res = await fetch(
      `${BASE_URL}/categories/products/filter?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: token+"",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch products: ${res.status} - ${errorText}`);
    }

    const json = await res.json();
    return json?.data;
  } catch (err) {
    console.error("FilterProductsAction Error:", err);
    throw err;
  }
}