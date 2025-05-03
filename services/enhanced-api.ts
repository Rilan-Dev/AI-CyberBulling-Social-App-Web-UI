import { Post } from "@/Model/post.model";
import { API_PATHS } from "./api-endpoints";
import { apiService } from "./api.service";

class ApiLogger {
  private static instance: ApiLogger;
  private isEnabled: boolean = process.env.NODE_ENV !== "production";

  private constructor() {}

  public static getInstance(): ApiLogger {
    if (!ApiLogger.instance) {
      ApiLogger.instance = new ApiLogger();
    }
    return ApiLogger.instance;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public logRequest(
    endpoint: string,
    method: string,
    params?: any,
    body?: any
  ): void {
    if (!this.isEnabled) return;

    console.group(`🚀 API Request: ${method} ${endpoint}`);
    console.log("Time:", new Date().toISOString());
    if (params) console.log("Params:", params);
    if (body) console.log("Body:", body);
    console.groupEnd();
  }

  public logResponse(
    endpoint: string,
    method: string,
    status: number,
    data: any
  ): void {
    if (!this.isEnabled) return;

    console.group(`✅ API Response: ${status} ${method} ${endpoint}`);
    console.log("Time:", new Date().toISOString());
    console.log("Status:", status);
    console.log("Data:", data);
    console.groupEnd();
  }

  public logError(endpoint: string, method: string, error: any): void {
    if (!this.isEnabled) return;

    console.group(`❌ API Error: ${method} ${endpoint}`);
    console.log("Time:", new Date().toISOString());
    console.log("enhanced-api.ts: logError Error:", error);
    if (error.response) {
      console.log("enhanced-api.ts: logError Response:", error.response);
    }
    console.groupEnd();
  }
}

export const apiLogger = ApiLogger.getInstance();

export class EnhancedApiService {
  // Get all posts
  async getPosts(): Promise<Post[]> {
    apiLogger.logRequest(API_PATHS.POSTS, "GET");

    try {
      const response = await apiService.getAllData<Post[]>({
        endpoint: API_PATHS.POSTS,
      });

      if (!response.success || !response.data) {
        throw new Error("Failed to fetch posts");
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
      apiLogger.logError(API_PATHS.POSTS, "GET", error);
      throw error;
    }
  }

  // Analyze text
  async analyzeText(text: string): Promise<any> {
    apiLogger.logRequest(API_PATHS.ANALYZE_TEXT, "POST", null, { text });

    try {
      const response = await apiService.create({
        endpoint: API_PATHS.ANALYZE_TEXT,
        body: { text },
      });

      if (!response.success || !response.data) {
        return Error("Failed to analyze text");
      }

      apiLogger.logResponse(API_PATHS.ANALYZE_TEXT, "POST", 200, response.data);
      return response.data;
    } catch (error) {
      apiLogger.logError(API_PATHS.ANALYZE_TEXT, "POST", error);
      throw error;
    }
  }

  // Analyze image
  async analyzeImage(image: File): Promise<any> {
    apiLogger.logRequest(API_PATHS.ANALYZE_IMAGE, "POST", null, {
      image: "[File]",
    });

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await apiService.create({
        endpoint: API_PATHS.ANALYZE_IMAGE,
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.success || !response.data) {
        throw new Error(`Failed to analyze image: ${response.message}`);
      }

      apiLogger.logResponse(
        API_PATHS.ANALYZE_IMAGE,
        "POST",
        200,
        response.data
      );
      return response.data;
    } catch (error) {
      apiLogger.logError(API_PATHS.ANALYZE_IMAGE, "POST", error);
      throw error;
    }
  }

  // Like a post
  async likePost(postId: string | number): Promise<any> {
    const endpoint = `${API_PATHS.POST_LIKE}${postId}/like/`;
    apiLogger.logRequest(endpoint, "POST");

    try {
      const response = await apiService.create({
        endpoint,
        body: {},
      });

      if (!response.success) {
        throw new Error("Failed to like post");
      }

      apiLogger.logResponse(endpoint, "POST", 200, response.data);
      return response.data;
    } catch (error) {
      apiLogger.logError(endpoint, "POST", error);
      throw error;
    }
  }

  // Add a comment to a post
  async addComment(postId: string | number, content: string): Promise<any> {
    apiLogger.logRequest(API_PATHS.COMMENTS, "POST", null, {
      post: postId,
      content,
    });

    try {
      const response = await apiService.create({
        endpoint: API_PATHS.COMMENTS,
        body: { post: postId, content },
      });

      if (!response.success || !response.data) {
        throw new Error("Failed to add comment");
      }

      apiLogger.logResponse(API_PATHS.COMMENTS, "POST", 200, response.data);
      return response.data;
    } catch (error) {
      apiLogger.logError(API_PATHS.COMMENTS, "POST", error);
      throw error;
    }
  }

  async addPosts(content: string): Promise<any> {
    apiLogger.logRequest(API_PATHS.POSTS, "POST", null, {
      content,
    });

    try {
      const response = await apiService.create({
        endpoint: API_PATHS.POSTS,
        body: { content },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.success || !response.data) {
        throw new Error("Failed to add comment");
      }

      apiLogger.logResponse(API_PATHS.POSTS, "POST", 200, response.data);
      return response.data;
    } catch (error) {
      apiLogger.logError(API_PATHS.POSTS, "POST", error);
      throw error;
    }
  }
}

export const enhancedApiService = new EnhancedApiService();
