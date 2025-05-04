import { apiService } from "./api.service"
import { API_PATHS } from "./api-endpoints"
import type { UserModel, User } from "@/Model/users.model"
import type { Post } from "@/Model/post.model"

export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    const response = await apiService.getData<UserModel>({
      endpoint: API_PATHS.CURRENT_USER,
    })
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
