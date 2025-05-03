import { BaseApiService } from "./base-api.service"
import type { ApiResponse } from "./base-api.service"

interface ApiRequestParams {
  endpoint: string
  queryParams?: Record<string, any>
  body?: any
  headers?: Record<string, string>
}

interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

// Define interceptor types
type RequestInterceptor = (config: RequestInit) => RequestInit | Promise<RequestInit>
type ResponseInterceptor = (response: Response) => Response | Promise<Response>
type ErrorInterceptor = (error: any) => Promise<any>

export class APIService extends BaseApiService {
  private isRefreshing = false
  private refreshSubscribers: ((token: string) => void)[] = []
  private requestInterceptors: RequestInterceptor[] = []
  private responseInterceptors: ResponseInterceptor[] = []
  private errorInterceptors: ErrorInterceptor[] = []

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api")
    this.setupInterceptors()
  }

  // Add request interceptor
  private addRequestInterceptor(onFulfilled?: RequestInterceptor, onRejected?: ErrorInterceptor): void {
    if (onFulfilled) {
      this.requestInterceptors.push(onFulfilled)
    }
    if (onRejected) {
      this.errorInterceptors.push(onRejected)
    }
  }

  // Add response interceptor
  private addResponseInterceptor(onFulfilled?: ResponseInterceptor, onRejected?: ErrorInterceptor): void {
    if (onFulfilled) {
      this.responseInterceptors.push(onFulfilled)
    }
    if (onRejected) {
      this.errorInterceptors.push(onRejected)
    }
  }

  private async applyRequestInterceptors(config: RequestInit): Promise<RequestInit> {
    let modifiedConfig = { ...config }
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig)
    }
    return modifiedConfig
  }

  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let modifiedResponse = response
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse)
    }
    return modifiedResponse
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.addRequestInterceptor(
      (config) => {
        const token = this.getAccessToken()
        if (token) {
          return {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${token}`,
            },
          }
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Response interceptor to handle token refresh
    this.addResponseInterceptor(
      (response) => response,
      async (error) => {
        const originalRequest = error.config || {}

        // Check if error is due to expired token (401 status)
        if (error.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, wait for the new token
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token) => {
                // Replace the expired token with the new one
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                } else {
                  originalRequest.headers = { Authorization: `Bearer ${token}` }
                }
                resolve(this.fetchApi(originalRequest.url, originalRequest))
              })
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const refreshToken = this.getRefreshToken()
            if (!refreshToken) {
              // No refresh token available, redirect to login
              this.clearTokens()
              if (typeof window !== "undefined") {
                window.location.href = "/login"
              }
              return Promise.reject(error)
            }

            const newToken = await this.refreshToken()
            if (newToken) {
              this.setAccessToken(newToken)

              // Retry all queued requests with new token
              this.refreshSubscribers.forEach((cb) => cb(newToken))
              this.refreshSubscribers = []

              // Update the original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
              } else {
                originalRequest.headers = { Authorization: `Bearer ${newToken}` }
              }

              return this.fetchApi(originalRequest.url, originalRequest)
            } else {
              // Token refresh failed, redirect to login
              this.clearTokens()
              if (typeof window !== "undefined") {
                window.location.href = "/login"
              }
              return Promise.reject(error)
            }
          } catch (refreshError) {
            this.clearTokens()
            if (typeof window !== "undefined") {
              window.location.href = "/login"
            }
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      },
    )
  }

  private getAccessToken(): string | null {
    return localStorage.getItem("accessToken")
  }

  private setAccessToken(token: string): void {
    localStorage.setItem("accessToken", token)
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken")
  }

  private clearTokens(): void {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await fetch(`${this.baseUrl}/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (!response.ok) {
        throw new Error("Refresh token failed")
      }

      const data = await response.json()
      return data.access || null
    } catch (error) {
      console.error("Error refreshing token:", error)
      return null
    }
  }

  // Override fetchApi to include interceptors
  public async fetchApi<T>(
    endpoint: string,
    config?: RequestInit,
    queryParams?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    try {
      // Apply request interceptors
      const modifiedConfig = await this.applyRequestInterceptors(config || {})

      // Build the URL with query parameters
      let url = `${this.baseUrl}${endpoint}`
      if (queryParams) {
        const params = new URLSearchParams()
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, String(value))
          }
        })
        const queryString = params.toString()
        if (queryString) {
          url += `?${queryString}`
        }
      }

      // Make the request
      const response = await fetch(url, modifiedConfig)
      let data: T | null = null
      let errorMessage: string | undefined = undefined

      // Try to parse the response as JSON
      try {
        if (response.status !== 204) {
          // No Content
          data = await response.json()
        }
      } catch (e) {
        // Response is not JSON
        errorMessage = "Invalid response format"
      }

      // Check if the response is successful
      const success = response.ok
      if (!success && !errorMessage) {
        errorMessage =
          data && typeof data === "object" && "detail" in data
            ? String(data.detail)
            : `Request failed with status ${response.status}`
      }

      // Apply response interceptors if needed
      const modifiedResponse = await this.applyResponseInterceptors(response)

      return {
        success,
        data: success ? data : null,
        error: success ? undefined : errorMessage,
        status: response.status,
        rawResponse: modifiedResponse,
      }
    } catch (error) {
      // Apply error interceptors
      for (const interceptor of this.errorInterceptors) {
        try {
          return await interceptor(error)
        } catch (e) {
          continue
        }
      }

      console.error("API request failed:", error)
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
        status: 0,
      }
    }
  }

  async create<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    let body: string | FormData
    let headers: Record<string, string> = {}

    // Check if body is FormData
    if (params.body instanceof FormData) {
      // For FormData, don't set Content-Type header - browser will set it with boundary
      body = params.body
      // Merge any other headers except Content-Type
      if (params.headers) {
        Object.entries(params.headers).forEach(([key, value]) => {
          if (key.toLowerCase() !== "content-type") {
            headers[key] = value
          }
        })
      }
    } else {
      // For JSON data, stringify and set Content-Type
      body = JSON.stringify(params.body)
      headers = {
        "Content-Type": "application/json",
        ...(params.headers || {}),
      }
    }

    const response = await this.fetchApi<T>(params.endpoint, {
      method: "POST",
      body: body,
      headers: headers,
    })
    return response
  }

  async getAllData<T>(params: ApiRequestParams): Promise<ApiResponse<T[]>> {
    const response = await this.fetchApi<T[]>(params.endpoint, { method: "GET" }, params.queryParams)
    return response
  }

  async getData<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const response = await this.fetchApi<T>(params.endpoint, { method: "GET" }, params.queryParams)
    return response
  }

  async getById<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const response = await this.fetchApi<T>(`${params.endpoint}/${params.queryParams?.id}`, { method: "GET" })
    return response
  }

  async update<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    let body: string | FormData
    let headers: Record<string, string> = {}

    // Check if body is FormData
    if (params.body instanceof FormData) {
      // For FormData, don't set Content-Type header - browser will set it with boundary
      body = params.body
      // Merge any other headers except Content-Type
      if (params.headers) {
        Object.entries(params.headers).forEach(([key, value]) => {
          if (key.toLowerCase() !== "content-type") {
            headers[key] = value
          }
        })
      }
    } else {
      // For JSON data, stringify and set Content-Type
      body = JSON.stringify(params.body)
      headers = {
        "Content-Type": "application/json",
        ...(params.headers || {}),
      }
    }

    const response = await this.fetchApi<T>(`${params.endpoint}/${params.queryParams?.id}`, {
      method: "PUT",
      body: body,
      headers: headers,
    })

    return response
  }

  async deleteItem<T>(params: ApiRequestParams): Promise<boolean> {
    const response = await this.fetchApi<T>(`${params.endpoint}/${params.queryParams?.id}`, { method: "DELETE" })
    return response.success
  }

  async getAllPaginated<T>(params: ApiRequestParams): Promise<PaginatedResponse<T>> {
    const response = await this.fetchApi<PaginatedResponse<T>>(params.endpoint, { method: "GET" }, params.queryParams)

    if (!response.success || !response.data) {
      return { results: [], count: 0, next: null, previous: null }
    }

    const data = response.data

    if (Array.isArray(data)) {
      return {
        results: data,
        count: data.length,
        next: null,
        previous: null,
      }
    }

    return data
  }
}

export const apiService = new APIService()
