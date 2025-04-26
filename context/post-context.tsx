"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import * as api from "@/lib/api";
import { apiService } from "@/services/api.service";
import { API_PATHS } from "@/services/api-endpoints";
import { Post } from "@/Model/post.model";
import { User } from "@/Model/users.model";
import { ApiResponse } from "@/services/base-api.service";
// Types for our posts
interface PostContextType {
  posts: Post[];
  loading: boolean;
  addPost: (
    post: Omit<Post, "id" | "likes" | "comments" | "timestamp" | "created_at"> & { image: File | string | null }
  ) => Promise<void>;
  likePost: (id: string | number) => void;
  unlikePost: (id: string | number) => void;
  addComment: (id: string | number, comment: string) => void;
  refreshPosts: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

// Sample user for demo
export const currentUser: User = {
  id: 0,
  firstName: "Current User",
  lastName: "Current User",
  username: "currentuser",
  email: "",
};


export function PostProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts on initial load
  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to fetch posts from API
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { results, count, next, previous } =
        await apiService.getAllPaginated<Post>({ endpoint: API_PATHS.POSTS });
      console.log("Fetched posts:", results);
      // Check if data exists and is an array
      if (Array.isArray(results)) {
        console.log("Data is an array:", results);
        // If data is already in the expected format (from mock API)
        if (results.length > 0 && "user" in results[0]) {
          setPosts(results as Post[]);
          console.log("Set posts:", results);
        } else {
          // Transform API data to match our Post interface
          const transformedPosts = results.map((post) => ({
            id: post.id,
            user: {
              id: post.user.id,
              firstName: `${post.user.firstName || ""}`.trim() || post.user.username,
              lastName: ` ${post.user.lastName || ""}`.trim() || post.user.username,
              username: post.user.username,
              email: post.user.email,
            },
            content: post.content,
            image: post.image,
            likes: post.like_count || 0,
            comments: Array.isArray(post.comments)
              ? post.comments.length
              : post.comments || 0,
            timestamp: new Date(post.created_at).toLocaleString(),
            status: post.status,
            reason: post.reason,
          })) as unknown as Post[];
          setPosts(transformedPosts);
        }
      } else if (
        results &&
        typeof results === "object" &&
        "results" in results
      ) {
        // Handle case where data is wrapped in an ApiResponse
        const responseData = results as unknown as ApiResponse;
        if (Array.isArray(responseData.rawResponse)) {
          setPosts(responseData.rawResponse);
        } else {
          console.warn(
            "API response data is not an array:",
            responseData.rawResponse
          );
          setPosts([]);
        }
      } else {
        // Handle case where data is not an array
        console.warn("API did not return an array of posts:", results);
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      // If we couldn't get posts, set an empty array
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new post
  const addPost = async (
    newPostData: Omit<
      Post,
      "id" | "likes" | "comments" | "timestamp" | "created_at"
    >
  ) => {
    try {
      // If image is a string URL, we need to handle it differently
      if (typeof newPostData.image === "string") {
        const newPost = await api.createPost({
          content: newPostData.content,
          image_url: newPostData.image,
          status: newPostData.status,
          reason: newPostData.reason,
        })
        // If the response is already in the expected format (from mock API)
        if (newPost && typeof newPost === "object" && "user" in newPost) {
          setPosts((prevPosts) => [newPost as Post, ...prevPosts])
          return
        }
        // Transform the response to match our Post interface
        const transformedPost: Post = {
          id: newPost.id,
          user: {
            id: newPost.user.id,
            firstName: `${newPost.user.firstName || ""}`.trim() || newPost.user.username,
            lastName: ` ${newPost.user.lastName || ""}`.trim() || newPost.user.username,
            username: newPost.user.username,
            email: newPost.user.email,
            // avatar: newPost.user.profile?.profile_picture || "/placeholder.svg?height=40&width=40",
          },
          content: newPost.content,
          image: newPost.image,
          like_count: newPost.like_count,
          comments: newPost.comments,
          created_at: newPost.created_at,
          status: newPost.status,
          reason: newPost.reason,
          confidence: newPost.confidence,
          is_liked: newPost.is_liked,
          text_analysis: newPost.text_analysis,
          image_analysis: newPost.image_analysis,
        }
        setPosts((prevPosts) => [transformedPost, ...prevPosts])
      }
      // If image is a File object
      else if (typeof newPostData.image === "object" && typeof File !== "undefined" && (newPostData.image as unknown as object) instanceof File) {
        const formData = new FormData()
        formData.append("content", newPostData.content)
        if (newPostData.image) {
          formData.append("image", newPostData.image);
        }
        const newPost = await api.createPost(formData)
        // If the response is already in the expected format (from mock API)
        if (newPost && typeof newPost === "object" && "user" in newPost) {
          setPosts((prevPosts) => [newPost as Post, ...prevPosts])
          return
        }
        // Transform the response to match our Post interface
        const transformedPost: Post = {
          id: newPost.id,
          user: {
            id: newPost.user.id,
            firstName: `${newPost.user.firstName || ""}`.trim() || newPost.user.username,
            lastName: ` ${newPost.user.lastName || ""}`.trim() || newPost.user.username,
            username: newPost.user.username,
            email: newPost.user.email,
          },
          content: newPost.content,
          image: newPost.image,
          like_count: newPost.like_count,
          comments: newPost.comments,
          created_at: newPost.created_at,
          status: newPost.status,
          reason: newPost.reason,
          confidence: newPost.confidence,
          is_liked: newPost.is_liked,
          text_analysis: newPost.text_analysis,
          image_analysis: newPost.image_analysis,
        }
        setPosts((prevPosts) => [transformedPost, ...prevPosts])
      }
      // If no image
      else {
        const newPost = await api.createPost({
          content: newPostData.content,
          status: newPostData.status,
          reason: newPostData.reason,
        })
        // If the response is already in the expected format (from mock API)
        if (newPost && typeof newPost === "object" && "user" in newPost) {
          setPosts((prevPosts) => [newPost as Post, ...prevPosts])
          return
        }
        // Transform the response to match our Post interface
        const transformedPost: Post = {
          id: newPost.id,
          user: {
            id: newPost.user.id,
            firstName: `${newPost.user.firstName || ""}`.trim() || newPost.user.username,
            lastName: ` ${newPost.user.lastName || ""}`.trim() || newPost.user.username,
            username: newPost.user.username,
            email: newPost.user.email,
          },
          content: newPost.content,
          image: newPost.image,
          like_count: newPost.like_count,
          comments: newPost.comments,
          created_at: newPost.created_at,
          status: newPost.status,
          reason: newPost.reason,
          confidence: newPost.confidence,
          is_liked: newPost.is_liked,
          text_analysis: newPost.text_analysis,
          image_analysis: newPost.image_analysis,
        }
        setPosts((prevPosts) => [transformedPost, ...prevPosts])
      }
    } catch (error) {
      console.error("Error adding post:", error);
      throw error;
    }
  };

  // Function to like a post
  const likePost = async (id: string | number) => {
    try {
      await api.likePost(id.toString());
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? { ...post, likes: (post.like_count || 0) + 1 } : post)),
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Function to unlike a post
  const unlikePost = async (id: string | number) => {
    try {
      await api.likePost(id.toString()); // Same endpoint toggles like status
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? { ...post, likes: Math.max(0, (post.like_count || 0) - 1) } : post)),
      )
    } catch (error) {
      console.error("Error unliking post:", error);
    }
  };

  // Function to add a comment to a post
  const addComment = async (id: string | number, comment: string) => {
    try {
      // await api.addComment(id.toString(), comment);
      // setPosts((prevPosts) =>
      //   prevPosts.map((post) => {
      //     if (post.id === id) {
      //       const currentComments = Array.isArray(post.comments) ? post.comments : [];
      //       return {
      //         ...post,
      //         comments: [
      //           ...currentComments,
      //           {
      //             id: Date.now(),
      //             content: comment, // Ensure 'content' is included
      //             post: id,
      //             user: currentUser,
      //             reason: "",
      //             confidence: 0,
      //             created_at: new Date().toISOString(),
      //             status: "new",
      //           },
      //         ],
      //       };
      //     }
      //     return post;
      //   })
      // );
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Function to refresh posts
  const refreshPosts = async () => {
    await fetchPosts();
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        addPost,
        likePost,
        unlikePost,
        addComment,
        refreshPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
}

export type { Post, User };
