import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios'
import { apiLogger } from './api-logger'

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

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  error?: string
  status: number
  rawResponse?: AxiosResponse
}

class APIService {
  private axiosInstance: AxiosInstance
  private isRefreshing = false
  private refreshSubscribers: ((token: string) => void)[] = []

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api',
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor for adding token
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAccessToken()
        if (token && config.headers && typeof config.headers.set === 'function') {
          config.headers.set('Authorization', `Bearer ${token}`)
        }
        return config
      },
      (error) => Promise.reject(error)
    )
    

    // Response interceptor for token refresh
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                }
                resolve(this.axiosInstance(originalRequest))
              })
            })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            const newToken = await this.refreshToken()
            if (newToken) {
              this.setAccessToken(newToken)
              this.refreshSubscribers.forEach((cb) => cb(newToken))
              this.refreshSubscribers = []

              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`
              }

              return this.axiosInstance(originalRequest)
            } else {
              this.clearTokens()
              window.location.href = '/login'
              return Promise.reject(error)
            }
          } catch (refreshError) {
            this.clearTokens()
            window.location.href = '/login'
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  private setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token)
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return null

    try {
      const response = await axios.post(`${this.axiosInstance.defaults.baseURL}/token/refresh/`, {
        refresh: refreshToken,
      })

      return response.data.access || null
    } catch (error) {
      console.error('Token refresh failed:', error)
      return null
    }
  }

  private buildUrl(endpoint: string, queryParams?: Record<string, any>): string {
    let url = endpoint
    if (queryParams) {
      const queryString = new URLSearchParams(queryParams as any).toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }
    return url
  }

  private async handleRequest<T>(method: string, url: string, config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    apiLogger.logRequest(url, method);
    try {
      const response = await this.axiosInstance.request<T>({ method, url, ...config })
      return {
        success: true,
        data: response.data,
        status: response.status,
        rawResponse: response,
      }
    } catch (error) {
      const axiosError = error as AxiosError
      const errorData = axiosError.response?.data as { detail?: string }
      apiLogger.logError(url, method, axiosError);
      return {
        success: false,
        data: null,
        error: errorData?.detail || axiosError.message || 'Unknown error',
        status: axiosError.response?.status || 0,
        rawResponse: axiosError.response,
      }
    }
  }

  async create<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const headers = params.body instanceof FormData
      ? params.headers
      : { 'Content-Type': 'application/json', ...(params.headers || {}) }

    const body = params.body instanceof FormData ? params.body : JSON.stringify(params.body)

    const url = this.buildUrl(params.endpoint)
    return this.handleRequest<T>('POST', url, { headers, data: body })
  }

  async getAllData<T>(params: ApiRequestParams): Promise<ApiResponse<T[]>> {
    const url = this.buildUrl(params.endpoint, params.queryParams)
    return this.handleRequest<T[]>('GET', url, {})
  }

  async getData<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const url = this.buildUrl(params.endpoint, params.queryParams)
    return this.handleRequest<T>('GET', url, {})
  }

  async getById<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const id = params.queryParams?.id
    const url = this.buildUrl(`${params.endpoint}/${id}`)
    return this.handleRequest<T>('GET', url, {})
  }

  async update<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const headers = params.body instanceof FormData
      ? params.headers
      : { 'Content-Type': 'application/json', ...(params.headers || {}) }

    const body = params.body instanceof FormData ? params.body : JSON.stringify(params.body)

    const id = params.queryParams?.id
    const url = this.buildUrl(`${params.endpoint}/${id}`)
    return this.handleRequest<T>('PUT', url, { headers, data: body })
  }

  async deleteItem<T>(params: ApiRequestParams): Promise<boolean> {
    const id = params.queryParams?.id
    const url = this.buildUrl(`${params.endpoint}/${id}`)
    const result = await this.handleRequest<T>('DELETE', url, {})
    return result.success
  }

  async getAllPaginated<T>(params: ApiRequestParams): Promise<PaginatedResponse<T>> {
    const url = this.buildUrl(params.endpoint, params.queryParams)
    const result = await this.handleRequest<PaginatedResponse<T>>('GET', url, {})

    if (!result.success || !result.data) {
      return { results: [], count: 0, next: null, previous: null }
    } 

    return result.data
  }
}

export const apiService = new APIService()
