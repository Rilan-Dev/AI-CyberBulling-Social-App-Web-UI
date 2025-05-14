import { apiService } from "./api.service"
import { API_PATHS } from "./api-endpoints"
import type { UserModel, User, AuthTokens } from "@/Model/users.model"
import type { Post } from "@/Model/post.model"
import { apiLogger } from "./api-logger"

export const userService = {

  // Authentication APIs
  login: async (username: string, password: string) => {
    try {
      // Updated endpoint to match Django REST framework's token auth
      const response = await apiService.create<AuthTokens>({ endpoint: API_PATHS.LOGIN, body: { username, password }})

      if (!response.success) {
        return Promise.reject("Login failed. Please check your credentials.")
      }
      // Store the token in localStorage
      if (response.data && response.success) {
        localStorage.setItem("accessToken", response.data.access)
        localStorage.setItem("refreshToken", response.data.refresh)
      }
      return response.data
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },

  register: async (userData: any) => {
    try {
      const response = await apiService.create<AuthTokens>({endpoint: API_PATHS.REGISTER, body: userData})
      if (response.data && response.success) {
        localStorage.setItem("accessToken", response.data.access)
        localStorage.setItem("refreshToken", response.data.refresh)
      }
      return response.data
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  logout: async () => {
    try {
      apiLogger.logRequest("/logout/", "POST")
  
      // For token-based auth, we just remove the tokens
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      return { success: true }
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiService.getData<UserModel>({
      endpoint: API_PATHS.CURRENT_USER,
    })

    if (response.error && response.status === 401) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")

      // If in browser context, redirect to login
      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname
        if (currentPath !== "/login" && currentPath !== "/register") {
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
        }
      }
    }
    return response.data
  },

  // Get user profile by username
  getUserProfile: async (username: string) => {
    const response = await apiService.getData<UserModel>({
      endpoint: API_PATHS.USER_PROFILE(username),
    })
    return response.data
  },

  // Follow a user
  followUser: async (username: string) => {
    const response = await apiService.update<{ status: string }>({
      endpoint: API_PATHS.USER_FOLLOW(username),
      queryParams: {},
    })
    return response.data
  },

  // Unfollow a user
  unfollowUser: async (username: string) => {
    const response = await apiService.update<{ status: string }>({
      endpoint: API_PATHS.USER_UNFOLLOW(username),
      queryParams: {},
    })
    return response.data
  },

  // Get user followers
  getUserFollowers: async (username: string) => {
    const response = await apiService.getData<User[]>({
      endpoint: API_PATHS.USER_FOLLOWERS(username),
    })
    return response.data
  },

  // Get users that a user is following
  getUserFollowing: async (username: string) => {
    const response = await apiService.getData<User[]>({
      endpoint: API_PATHS.USER_FOLLOWING(username),
    })
    return response.data
  },

  // Get posts by a user
  getUserPosts: async (username: string) => {
    const response = await apiService.getData<Post[]>({
      endpoint: API_PATHS.USER_POSTS(username),
    })
    return response.data
  },

  // Search for users
  searchUsers: async (query: string) => {
    const response = await apiService.getData<User[]>({
      endpoint: API_PATHS.USER_SEARCH,
      queryParams: { q: query },
    })
    return response.data
  },

  // Update user profile
  updateProfile: async (data: FormData) => {
    console.log("data in updateProfile", data);
    const response = await apiService.update<UserModel>({
      endpoint: API_PATHS.CURRENT_USER,
      body: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },
}
