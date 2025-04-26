import { BaseApiService } from "./base-api.service";
import type { ApiResponse } from "./base-api.service";

interface ApiRequestParams {
  endpoint: string;
  queryParams?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
}

interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
}

// Define interceptor types
type RequestInterceptor = (
  config: RequestInit
) => RequestInit | Promise<RequestInit>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: any) => Promise<any>;

export class APIService extends BaseApiService {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api");
    this.setupInterceptors();
  }

  // Add request interceptor
  private addRequestInterceptor(
    onFulfilled?: RequestInterceptor,
    onRejected?: ErrorInterceptor
  ): void {
    if (onFulfilled) {
      this.requestInterceptors.push(onFulfilled);
    }
    if (onRejected) {
      this.errorInterceptors.push(onRejected);
    }
  }

  // Add response interceptor
  private addResponseInterceptor(
    onFulfilled?: ResponseInterceptor,
    onRejected?: ErrorInterceptor
  ): void {
    if (onFulfilled) {
      this.responseInterceptors.push(onFulfilled);
    }
    if (onRejected) {
      this.errorInterceptors.push(onRejected);
    }
  }

  private async applyRequestInterceptors(
    config: RequestInit
  ): Promise<RequestInit> {
    let modifiedConfig = { ...config };
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = await interceptor(modifiedConfig);
    }
    return modifiedConfig;
  }

  private async applyResponseInterceptors(
    response: Response
  ): Promise<Response> {
    let modifiedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = await interceptor(modifiedResponse);
    }
    return modifiedResponse;
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.addRequestInterceptor(
      (config) => {
        const token = this.getAccessToken();
        console.log("Token:", token);
        if (token) {
          return {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${token}`,
            },
          };
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.addResponseInterceptor(
      (response) => response,
      async (error) => {
        if (!error.response) return Promise.reject(error);

        const originalRequest = error.config;

        // If error is 401 and we have a refresh token
        if (error.response.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, wait for the new token
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.fetchApi(originalRequest.url, originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const newToken = await this.refreshToken();
            if (newToken) {
              this.setAccessToken(newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;

              // Retry all queued requests with new token
              this.refreshSubscribers.forEach((cb) => cb(newToken));
              this.refreshSubscribers = [];

              return this.fetchApi(originalRequest.url, originalRequest);
            }
          } catch (refreshError) {
            this.clearTokens();
            window.location.href = "/login"; // Redirect to login on refresh failure
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  private setAccessToken(token: string): void {
    localStorage.setItem("accessToken", token);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  private clearTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  private async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await this.fetchApi<{ access: string }>(
        "/token/refresh/",
        {
          method: "POST",
          body: JSON.stringify({ refresh: refreshToken }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.success && response.data?.access) {
        return response.data.access;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Override fetchApi to include interceptors
  public async fetchApi<T>(
    endpoint: string,
    config?: RequestInit,
    queryParams?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      // Apply request interceptors
      const modifiedConfig = await this.applyRequestInterceptors(config || {});

      // Call parent fetchApi
      const response = await super.fetchApi<T>(
        endpoint,
        modifiedConfig,
        queryParams
      );

      // Apply response interceptors
      if (!response.rawResponse) {
        console.log("Raw response is undefined");
        return response;
        // throw new Error("Raw response is undefined");
      }
      const modifiedResponse = await this.applyResponseInterceptors(
        response.rawResponse
      );

      return {
        ...response,
        rawResponse: modifiedResponse,
      };
    } catch (error) {
      // Apply error interceptors
      for (const interceptor of this.errorInterceptors) {
        try {
          return await interceptor(error);
        } catch (e) {
          continue;
        }
      }
      throw error;
    }
  }

  async create<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const mergedHeaders = {
      ...defaultHeaders,
      ...(params.headers || {}), // If user passes custom headers, they overwrite default
    };

    const response = await this.fetchApi<T>(params.endpoint, {
      method: "POST",
      body: JSON.stringify(params.body),
      headers: mergedHeaders,
    });
    return response;
  }

  async getAllData<T>(params: ApiRequestParams): Promise<ApiResponse<T[]>> {
    const response = await this.fetchApi<T[]>(
      params.endpoint,
      { method: "GET" },
      params.queryParams
    );
    return response;
  }

  async getData<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const response = await this.fetchApi<T>(
      params.endpoint,
      { method: "GET" },
      params.queryParams
    );
    return response;
  }

  async getById<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const response = await this.fetchApi<T>(
      `${params.endpoint}/${params.queryParams?.id}`,
      { method: "GET" }
    );
    return response;
  }

  async update<T>(params: ApiRequestParams): Promise<ApiResponse<T>> {
    const defaultHeaders = {
      "Content-Type": "application/json",
    };

    const mergedHeaders = {
      ...defaultHeaders,
      ...(params.headers || {}), // If user passes custom headers, they overwrite default
    };

    const response = await this.fetchApi<T>(
      `${params.endpoint}/${params.queryParams?.id}`,
      {
        method: "PUT",
        body: JSON.stringify(params.body),
        headers: mergedHeaders,
      }
    );

    return response;
  }

  async deleteItem<T>(params: ApiRequestParams): Promise<boolean> {
    const response = await this.fetchApi<T>(
      `${params.endpoint}/${params.queryParams?.id}`,
      { method: "DELETE" }
    );
    return response.success;
  }

  async getAllPaginated<T>(
    params: ApiRequestParams
  ): Promise<PaginatedResponse<T>> {
    const response = await this.fetchApi<PaginatedResponse<T>>(
      params.endpoint,
      { method: "GET" },
      params.queryParams
    );

    if (!response.success || !response.data) {
      return { results: [], count: 0, next: null, previous: null };
    }

    const data = response.data;

    if (Array.isArray(data)) {
      return {
        results: data,
        count: data.length,
        next: null,
        previous: null,
      };
    }

    return data;
  }
}

export const apiService = new APIService();
