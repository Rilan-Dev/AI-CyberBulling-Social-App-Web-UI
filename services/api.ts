import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for authentication
})

// Set up request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)


// Add a request interceptor to refresh token if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we have a refresh token and haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          // No refresh token, redirect to login
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname
            if (currentPath !== "/login" && currentPath !== "/register") {
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
            }
          }
          return Promise.reject(error)
        }

        // Get a new access token
        const response = await axios.post(`${API_URL}token/refresh/`, {
          refresh: refreshToken,
        })

        if (response.data.access) {
          // Update tokens
          localStorage.setItem("accessToken", response.data.access)
          api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`

          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access}`

          // Retry the original request
          return api(originalRequest)
        } else {
          throw new Error("Failed to refresh token")
        }
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        delete api.defaults.headers.common["Authorization"]

        // Redirect to login
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname
          if (currentPath !== "/login" && currentPath !== "/register") {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
          }
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
