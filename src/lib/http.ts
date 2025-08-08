"use client"

import axios from "axios"
import { toast } from "@/components/ui/use-toast"

// Axios instance with global error handling via toast
export const api = axios.create({})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      (typeof error === "string" ? error : "Request failed")
    toast({ title: "Error", description: message, variant: "destructive" })
    return Promise.reject(error)
  }
)

// Fetch wrapper that raises toast when !ok or on network errors
export async function safeFetch(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const res = await fetch(input, init)
    if (!res.ok) {
      let message = `${res.status} ${res.statusText}`
      try {
        const data = await res.clone().json()
        if (data?.message) message = data.message
      } catch {
        // ignore JSON parse errors
      }
      toast({ title: "Error", description: message, variant: "destructive" })
      throw new Error(message)
    }
    return res
  } catch (err: any) {
    const message = err?.message || "Network error"
    toast({ title: "Error", description: message, variant: "destructive" })
    throw err
  }
}
