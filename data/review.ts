"use server"

import axios from "axios"
import { cookies } from "next/headers"
import { BASE_URL } from "@/lib/urls"

export interface AddReviewPayload {
  productId: string
  rating: number
  comment: string
}

export interface Review {
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

export interface RatingBreakdown {
  "1": number
  "2": number
  "3": number
  "4": number
  "5": number
}

export interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingBreakdown: RatingBreakdown
}

export interface ReviewsData {
  reviews: Review[]
  summary: ReviewSummary
  totalPages: number
  totalElements: number
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }


export interface ToggleLikeResponse {
  status: string;
  message: string;
  data: {
    like: {
      liked: boolean;
      likeCount: number;
    };
  };
}


async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("Authorization")?.value
  return token || null
}


export async function addProductReview(
  payload: AddReviewPayload
): Promise<ActionResponse<{review : Review}>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return { success: false, error: "Unauthorized - Login to proceed" }
    }

    const response = await axios.post<{
      status: string
      message: string
      data:  { review : Review } 
    }>(
      `${BASE_URL}/api/reviews`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    )

    const res = response.data

    if (res.status.toLowerCase() !== "success") {
      return { success: false, error: res.message }
    }

    return { success: true, data: res.data }
  } catch (error) {
    console.error("Error adding review:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getProductReviews(
  productId: string,
  page: number = 0
): Promise<ActionResponse<{ reviewsData: ReviewsData; totalPages: number }>> {
  try {
    const token = await getAuthToken()

    const response = await axios.get<{
      status: string
      message: string
      data: { data: ReviewsData }
    }>(
      `${BASE_URL}/api/reviews/product/${productId}?page=${page}`,
      {
        headers: {
          Authorization: token,
        },
      }
    )

    const res = response.data

    if (res.status.toLowerCase() !== "success") {
      return { success: false, error: res.message }
    }

    const reviewsData = res.data.data
    const totalPages = reviewsData.totalPages

    return { success: true, data: { reviewsData, totalPages } }
  } catch (error) {
    console.error("Error fetching product reviews:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}


export async function deleteProductReview(
  reviewId: string
): Promise<ActionResponse<string>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: "Unauthorized - Login to proceed" }
    }

    const response = await axios.delete<{
      status: string
      message: string
    }>(
      `${BASE_URL}/api/reviews/${reviewId}`,
      {
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      }
    )

    const res = response.data
    if (res.status.toLowerCase() !== "success") {
      return { success: false, error: res.message }
    }

    return { success: true, data: res.message }
  } catch (error) {
    console.error("Error deleting review:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function toggleReviewLike(
  reviewId: string
): Promise<ActionResponse<string>> {
  try {
    const token = await getAuthToken()
    if (!token) {
      return { success: false, error: "Unauthorized - Login to proceed" }
    }

    const response = await axios.post<ToggleLikeResponse>(
      `${BASE_URL}/api/product-reviews/${reviewId}/like`,
      {},
      {
        headers: {
          Authorization: token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`,
        },
      }
    )

    const res = response.data
    if (res.status.toLowerCase() !== "success") {
      return { success: false, error: res.message }
    }

    return { success: true, data: res.message }
  } catch (error) {
    console.error("Error toggling like:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
