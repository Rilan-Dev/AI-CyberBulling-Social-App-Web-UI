import { getHttpStatusMessage } from "./http-status-codes"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T | null
  error?: string | undefined
  message?: string
  rawResponse?: Response
  status?: number // Add status property
}

export class BaseApiService {
  protected baseUrl: string
  isLoggingError: any

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  protected buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseUrl}/${endpoint}`)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value))
        }
      })
    }
    return url.toString()
  }

  protected async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {},
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint, params)
    const method = options.method || "GET"

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorPayload = {
          path: url,
          method,
          statusCode: response.status,
          message: response.statusText || getHttpStatusMessage(response.status),
        }

        console.log("API Error:", errorPayload)

        throw new Error(errorPayload.message)
      }

      const statusCode = response.status
      if (statusCode === 204) {
        return {
          success: true,
          data: null,
          message: getHttpStatusMessage(statusCode),
        }
      }

      const data = await response.json()

      return {
        success: true,
        data: data as T,
        message: data.msg ?? getHttpStatusMessage(statusCode),
      }
    } catch (err: any) {
      const errorPayload = {
        path: url,
        method,
        statusCode: 0,
        message: err.message || "Network error",
      }

      console.log("Network Error:", errorPayload)

      return errorPayload.message
    }
  }
}
