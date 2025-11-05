import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from 'js-cookie';
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type MethodType = "GET" | "POST" | "DELETE" | "PUT" | "UPDATE"

export const fetcher = (method: MethodType = "GET", payload: any = {}) => {
  return async (url: string): Promise<any> => {
    try {
      const token = Cookies.get("Authorization") || "";

      const response = await axios.request({
        url,
        method,
        data: method !== "GET" ? payload : undefined,
        withCredentials: true,
        headers: {
          Authorization: token ? token : "",
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const resData = response.data;

      if (resData.status?.toLowerCase() !== "success") {
        throw new Error(resData.message || "Request failed");
      }

      return resData.data;
    } catch (error: any) {
      console.error("Fetcher error:", error);
      throw new Error(
        error.response?.data?.message || error.message || "Unknown error"
      );
    }
  };
};

