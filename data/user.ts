"use server";

import { ADD_ADDRESS_URL, BASE_URL, DELETE_ADDRESS_URL, GET_ADDRESSES_URL, UPDATE_ADDRESS_URL } from "@/lib/urls"
import { ActionResponse, getAuthToken } from "./cart"
import axios from "axios"

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
        error: "Unauthorized - No token found",
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
        error: "Unauthorized - No token found",
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
        error: "Unauthorized - No token found",
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
        error: "Unauthorized - No token found",
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