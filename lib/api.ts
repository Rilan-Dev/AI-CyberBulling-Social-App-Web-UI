import axios from "axios"
import { apiLogger, enhancedApiService } from "./enhanced-api"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

// Flag to determine if we should use mock A
// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for authentication
})

// Authentication APIs
export const login = async (username: string, password: string) => {
  try {
    apiLogger.logRequest("/token/", "POST", null, { username })


    // Updated endpoint to match Django REST framework's token auth
    const response = await api.post("/token/", { username, password })

    // Store the token in localStorage
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access)
      localStorage.setItem("refreshToken", response.data.refresh)

      // Set the authorization header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`
    }

    apiLogger.logResponse("/token/", "POST", 200, response.data)
    return response.data
  } catch (error) {
    apiLogger.logError("/token/", "POST", error)
    console.error("Login error:", error)
    throw error
  }
}

export const register = async (userData: any) => {
  try {
    apiLogger.logRequest("/users/register/", "POST", null, { ...userData, password: "[REDACTED]" })


    const response = await api.post("/users/register/", userData)
    apiLogger.logResponse("/users/register/", "POST", 200, response.data)
    return response.data
  } catch (error) {
    apiLogger.logError("/users/register/", "POST", error)
    console.error("Registration error:", error)
    throw error
  }
}

export const logout = async () => {
  try {
    apiLogger.logRequest("/logout/", "POST")


    // For token-based auth, we just remove the tokens
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    delete api.defaults.headers.common["Authorization"]

    return { success: true }
  } catch (error) {
    apiLogger.logError("/logout/", "POST", error)
    console.error("Logout error:", error)
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    apiLogger.logRequest("/users/me/", "GET")


    // Set auth header from localStorage if available
    const token = localStorage.getItem("accessToken")
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    const response = await api.get("/users/me/")
    apiLogger.logResponse("/users/me/", "GET", 200, response.data)
    return response.data
  } catch (error) {
    apiLogger.logError("/users/me/", "GET", error)
    console.error("Get current user error:", error)
    return null
  }
}

// Post APIs
export const getPosts = async () => {
  try {

    // Use enhanced API service for better error handling and validation
    return await enhancedApiService.getPosts()
  } catch (error) {
    console.error("Error fetching posts:", error)
    // Return empty array on error
    return []
  }
}

export const getPost = async (id: string) => {
  try {
    apiLogger.logRequest(`/posts/${id}/`, "GET")
    const response = await api.get(`/posts/${id}/`)
    apiLogger.logResponse(`/posts/${id}/`, "GET", 200, response.data)
    return response.data
  } catch (error) {
    apiLogger.logError(`/posts/${id}/`, "GET", error)
    console.error("Error fetching post:", error)
    throw error
  }
}

export const createPost = async (postData: FormData | any) => {
  try {

    const response = await api.post("/posts/", postData, {
      headers: {
        "Content-Type": postData instanceof FormData ? "multipart/form-data" : "application/json",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error creating post:", error)
    throw error
  }
}

export const likePost = async (id: string) => {
  try {

    // Use enhanced API service
    return await enhancedApiService.likePost(id)
  } catch (error) {
    console.error("Error liking post:", error)
    throw error
  }
}

export const addComment = async (postId: string, content: string) => {
  try {

    // Use enhanced API service
    return await enhancedApiService.addComment(postId, content)
  } catch (error) {
    console.error("Error adding comment:", error)
    throw error
  }
}

// Analysis APIs
export const analyzeText = async (text: string) => {
  try {

    // Use enhanced API service
    return await enhancedApiService.analyzeText(text)
  } catch (error) {
    console.error("Error analyzing text:", error)
    throw error
  }
}

export const analyzeImage = async (image: File) => {
  try {

    // Use enhanced API service
    return await enhancedApiService.analyzeImage(image)
  } catch (error) {
    console.error("Error analyzing image:", error)
    throw error
  }
}

// Add a request interceptor to refresh token if needed
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we have a refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          return Promise.reject(error)
        }

        // Get a new access token
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken,
        })

        // Update tokens
        localStorage.setItem("accessToken", response.data.access)
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`

        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        delete api.defaults.headers.common["Authorization"]
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
