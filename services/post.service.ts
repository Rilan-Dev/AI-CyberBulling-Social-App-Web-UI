import { apiService } from "./api.service";
import { API_PATHS } from "./api-endpoints";
import type { Post, Comment } from "@/Model/post.model";
import type { User } from "@/Model/users.model";
import { apiLogger } from "./api-logger";

export const postService = {
  // Get all posts
  getPosts: async () => {
    try {
      const response = await apiService.getAllData<Post[]>({
        endpoint: API_PATHS.POSTS,
      });

      if (!response.success || !response.data) {
        return Promise.reject("Failed to fetch posts");
      }

      // If the response data is already an array, return it
      if (Array.isArray(response.data)) {
        apiLogger.logResponse(API_PATHS.POSTS, "GET", 200, response.data);
        return response.data.flat();
      }

      // If the response has a results property, return that
      if (
        response.data &&
        typeof response.data === "object" &&
        "results" in response.data
      ) {
        const results = (response.data as any).results;
        if (Array.isArray(results)) {
          apiLogger.logResponse(API_PATHS.POSTS, "GET", 200, results);
          return results;
        }
      }

      // If we can't find an array, return an empty array
      console.warn("API response format not recognized:", response.data);
      return [];
    } catch (error) {
      throw error;
    }
  },

  // Get a specific post
  getPost: async (id: number) => {
    const response = await apiService.getData<Post>({
      endpoint: API_PATHS.POST_EDIT(id),
    });
    return response.data;
  },

  createPost: async (formData: FormData) => {
    // Log the FormData to verify it contains the image
    console.log("FormData in postService.createPost:");
    for (const pair of formData.entries()) {
      console.log(
        `${pair[0]}: ${typeof pair[1] === "object" ? "File object" : pair[1]}`
      );
    }

    const response = await apiService.create<Post>({
      endpoint: API_PATHS.POSTS,
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Update a post
  updatePost: async (id: number, data: FormData) => {
    const response = await apiService.create<Post>({
      endpoint: API_PATHS.POST_EDIT(id),
      body: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete a post
  deletePost: async (id: number) => {
    const response = await apiService.deleteItem<void>({
      endpoint: API_PATHS.POST_DELETE,
      queryParams: { id },
    });
    return response;
  },

  // Like or unlike a post
  toggleLike: async (id: number) => {
    const response = await apiService.create<{ status: string }>({
      endpoint: API_PATHS.POST_LIKE(id),
      body: {},
    });
    return response.data;
  },

  // Get users who liked a post
  getPostLikes: async (id: number) => {
    const response = await apiService.getData<User[]>({
      endpoint: API_PATHS.POST_LIKES(id),
    });
    return response.data;
  },

  // Get comments for a post
  getPostComments: async (postId: number) => {
    const response = await apiService.getData<Comment[]>({
      endpoint: API_PATHS.POST_COMMENTS(postId),
    });
    return response.data;
  },

  // Add a comment to a post
  addComment: async (postId: number, content: string) => {
    const response = await apiService.create<Comment>({
      endpoint: API_PATHS.COMMENTS,
      body: {
        post: postId,
        content,
      },
    });
    return response.data;
  },

  // Get feed posts
  getFeed: async () => {
    try {
      const response = await apiService.getData<Post[] | any>({
        endpoint: API_PATHS.FEED,
      });

      // Check if data exists and is an array
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && typeof response.data === "object") {
        // Handle case where data might be wrapped in another object
        if (Array.isArray(response.data.results)) {
          return response.data.results;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }

      // If we can't determine the structure, return an empty array
      console.warn("Unexpected API response format:", response.data);
      return [];
    } catch (error) {
      console.error("Error fetching feed:", error);
      return [];
    }
  },
};
