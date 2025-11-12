"use server";

import { ADD_ADDRESS_URL, BASE_URL, DELETE_ADDRESS_URL, GET_ADDRESSES_URL, UPDATE_ADDRESS_URL } from "@/lib/urls"
import { ActionResponse, getAuthToken } from "./cart"
import axios, { isAxiosError } from "axios"
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


export interface AddressPayload {
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  defaultAddress: boolean
}

export interface ApiAddress {
  id: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  defaultAddress: boolean
  createdAt: string
  updatedAt: string
}

export interface DeleteAddressResponse {
  message: string
}

export async function addUserAddress(
    payload: AddressPayload
): Promise<ActionResponse<ApiAddress>> {
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
      url: ADD_ADDRESS_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: payload,
    }

    const response = (
      await axios.request<{
        status: string
        message: string
        data: { address : ApiAddress }
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
      data: response.data.address,
    }
  } catch (error) {
    console.error("Error adding address:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getUserAddresses(): Promise<ActionResponse<ApiAddress[]>> {
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
      url: GET_ADDRESSES_URL,
      headers: {
        Authorization: token,
      },
    }

    const response = (
      await axios.request<{
        status: string
        message: string
        data: { addresses : ApiAddress[]}
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
      data: response.data.addresses,
    }
  } catch (error) {
    console.error("Error fetching user addresses:", error)
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function deleteUserAddress(
  addressId: string
): Promise<ActionResponse<DeleteAddressResponse>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      }
    }

    const url = DELETE_ADDRESS_URL(addressId);

    const config = {
      method: "delete",
      maxBodyLength: Infinity,
      url,
      headers: {
        Authorization: token,
      },
    }

    const response = (
      await axios.request<{
        status: string
        message: string
        data?: any
      }>(config)
    ).data

    if (response.status.toLowerCase() !== "success") {
      return {
        success: false,
        error: response.message || "Failed to delete address",
      }
    }

    return {
      success: true,
      data: {
        message: response.message || "Address deleted successfully",
      },
    }
  } catch (error) {
    console.error("Error deleting address:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while deleting address",
    }
  }
}

export async function updateUserAddress(
  addressId: string,
  payload: AddressPayload
): Promise<ActionResponse<ApiAddress>> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: "Unauthorized - Login to proceed",
      }
    }

    const url = UPDATE_ADDRESS_URL(addressId);

    const config = {
      method: "put",
      maxBodyLength: Infinity,
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      data: payload,
    }

    const response = (
      await axios.request<{
        status: string
        message: string
        data: { address : ApiAddress}
      }>(config)
    ).data

    if (response.status.toLowerCase() !== "success") {
      return {
        success: false,
        error: response.message || "Failed to update address",
      }
    }

    return {
      success: true,
      data: response.data.address,
    }
  } catch (error) {
    console.error("Error updating address:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while updating address",
    }
  }
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
  data: null;
}

export async function forgotPassword(
  payload: ForgotPasswordPayload
): Promise<ActionResponse<ForgotPasswordResponse>> {
  try {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/api/auth/forgot-password`,
      headers: {
        "Content-Type": "application/json",
      },
      data: payload,
    };

    const response = (
      await axios.request<{
        status: string;
        message: string;
        data: null;
      }>(config)
    ).data;

    if (response.status.toLowerCase() !== "success") {
      return {
        success: false,
        error: response.message,
      };
    }

    return {
      success: true,
      data: {
        message: response.message,
        data: response.data,
      },
    };
  } catch (error) {
    console.error("Error sending forgot password request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
  data: null;
}

export async function resendVerificationEmail(
  payload: ResendVerificationPayload
): Promise<ActionResponse<ResendVerificationResponse>> {
  try {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/api/auth/resend-verification?email=${encodeURIComponent(
        payload.email
      )}`,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = (
      await axios.request<{
        status: string;
        message: string;
        data: null;
      }>(config)
    ).data;

    if (response.status.toLowerCase() !== "success") {
      return {
        success: false,
        error: response.message,
      };
    }

    return {
      success: true,
      data: {
        message: response.message,
        data: response.data,
      },
    };
  } catch (error) {
    console.error("Error resending verification email:", error);
    if(isAxiosError(error)) {
      return {
        success : false,
        error : error.response?.data.message
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function logout() {
  // Delete the auth cookie
  (await cookies()).delete('Authorization');

  // Redirect to login page
  redirect('/login');
}

interface ApiUserDetailsResponse {
  user: {
    username: string
    email: string
    role: string
  }
}

export async function getUserDetails(): Promise<ActionResponse<ApiUserDetailsResponse>> {
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
      url: `http://3.110.127.251:8080/api/users/details`,
      headers: {
        Authorization: token,
      },
    }


    

    const response = await axios.request<{
      status: string
      message: string
      data?: ApiUserDetailsResponse
    }>(config)

    const { status, message, data } = response.data

    if (status?.toLowerCase() !== "success" || !data) {
      return {
        success: false,
        error: message || "Failed to fetch user details",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        return { success: false, error: "You need to login to access details" }
      }
    }

    console.error("Error fetching user details:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}