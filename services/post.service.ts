import { apiService } from "./api.service"
import { API_PATHS } from "./api-endpoints"
import type { Post, Comment } from "@/Model/post.model"
import type { User } from "@/Model/users.model"

export const postService = {
  // Get all posts
  getPosts: async () => {
    const response = await apiService.getData<Post[]>({
      endpoint: API_PATHS.POSTS,
    })
    return response.data
  },

  // Get a specific post
  getPost: async (id: number) => {
    const response = await apiService.getData<Post>({
      endpoint: API_PATHS.POST_DETAIL(id),
    })
    return response.data
  },

  // Create a new post
  createPost: async (data: FormData) => {
    const response = await apiService.create<Post>({
      endpoint: API_PATHS.POSTS,
      queryParams: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Update a post
  updatePost: async (id: number, data: FormData) => {
    const response = await apiService.update<Post>({
      endpoint: API_PATHS.POST_DETAIL(id),
      queryParams:data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  // Delete a post
  deletePost: async (id: number) => {
    const response = await apiService.deleteItem<void>({
      endpoint: API_PATHS.POST_DETAIL(id),
    })
    return response
  },

  // Like or unlike a post
  toggleLike: async (id: number) => {
    const response = await apiService.update<{ status: string }>({
      endpoint: API_PATHS.POST_LIKE(id),
      queryParams: {},
    })
    return response.data
  },

  // Get users who liked a post
  getPostLikes: async (id: number) => {
    const response = await apiService.getData<User[]>({
      endpoint: API_PATHS.POST_LIKES(id),
    })
    return response.data
  },

  // Get comments for a post
  getPostComments: async (postId: number) => {
    const response = await apiService.getData<Comment[]>({
      endpoint: API_PATHS.POST_COMMENTS(postId),
    })
    return response.data
  },

  // Add a comment to a post
  addComment: async (postId: number, content: string) => {
    const response = await apiService.create<Comment>({
      endpoint: API_PATHS.COMMENTS,
      queryParams: {
        post: postId,
        content,
      },
    })
    return response.data
  },

  // Get feed posts
  getFeed: async () => {
    const response = await apiService.getData<Post[]>({
      endpoint: API_PATHS.FEED,
    })
    return response.data
  },
}
