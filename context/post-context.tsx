"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Post } from "@/Model/post.model"
import { postService } from "@/services/post.service"
import { useToast } from "@/components/ui/use-toast"

interface PostContextType {
  posts: Post[]
  loading: boolean
  error: string | null
  fetchPosts: () => Promise<void>
  addPost: (postData: FormData) => Promise<Post | null>
  deletePost: (id: number) => Promise<void>
  likePost: (postId: number) => Promise<void>
  unlikePost: (postId: number) => Promise<void>
  addComment: (postId: number, content: string) => Promise<void>
  refreshPosts: () => Promise<void>
}

const PostContext = createContext<PostContextType | undefined>(undefined)

import { useRef } from "react"

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const hasFetched = useRef(false) // prevent multiple fetches

  const fetchPosts = useCallback(async () => {
    if (hasFetched.current) return
    hasFetched.current = true

    setLoading(true)
    setError(null)
    try {
      console.log("Fetching posts from API...")
      const fetchedPosts = await postService.getPosts()
      if (fetchedPosts && Array.isArray(fetchedPosts)) {
        console.log(`Successfully fetched ${fetchedPosts.length} posts`)
        setPosts(fetchedPosts)
      } else {
        console.warn("API did not return an array of posts:", fetchedPosts)
        setPosts([])
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      setError("Failed to fetch posts")
      toast({
        title: "Error",
        description: "Failed to load posts",
        variant: "destructive",
      })
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Load posts on initial render
  useEffect(() => {
    console.log("PostProvider mounted, fetching initial posts")
    fetchPosts()
  }, [fetchPosts])

  // Function to add a new post
  const addPost = async (formData: FormData): Promise<Post | null> => {
    try {
      // Log the FormData to verify it contains the image
      console.log("FormData being sent to API:")
      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${typeof pair[1] === "object" ? "File object" : pair[1]}`)
      }

      // Make sure we're using FormData
      const newPost = await postService.createPost(formData)

      if (newPost) {
        fetchPosts()
      }
      return null
    } catch (error) {
      console.error("Error adding post:", error)
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
      return null
    }
  }

  const deletePost = async (id: number) => {
    try {
      // Make sure we're using FormData
      const deletePost = await postService.deletePost(id)

      if (deletePost) {
        fetchPosts()
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    }
  }

  const likePost = async (postId: number) => {
    try {
      const result = await postService.toggleLike(postId)

      // Update the post in the state
      setPosts((prevPosts) => {
        if (!Array.isArray(prevPosts)) {
          console.warn("prevPosts is not an array:", prevPosts)
          return []
        }

        return prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              is_liked: !post.is_liked,
              like_count: post.is_liked ? post.like_count - 1 : post.like_count + 1,
            }
          }
          return post
        })
      })
    } catch (err) {
      console.error("Error liking post:", err)
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      })
    }
  }

  const unlikePost = async (postId: number) => {
    try {
      await postService.toggleLike(postId) // Same endpoint toggles like status

      // Update the post in the state
      setPosts((prevPosts) => {
        if (!Array.isArray(prevPosts)) {
          console.warn("prevPosts is not an array:", prevPosts)
          return []
        }

        return prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              is_liked: false,
              like_count: Math.max(0, post.like_count - 1),
            }
          }
          return post
        })
      })
    } catch (err) {
      console.error("Error unliking post:", err)
      toast({
        title: "Error",
        description: "Failed to unlike post",
        variant: "destructive",
      })
    }
  }

  const addComment = async (postId: number, content: string) => {
    try {
      const newComment = await postService.addComment(postId, content)

      // Update the post in the state with the new comment
      setPosts((prevPosts) => {
        if (!Array.isArray(prevPosts)) {
          console.warn("prevPosts is not an array:", prevPosts)
          return []
        }

        return prevPosts.map((post) => {
          if (post.id === postId && newComment) {
            return {
              ...post,
              comments: [...post.comments, newComment],
            }
          }
          return post
        })
      })
    } catch (err) {
      console.error("Error adding comment:", err)
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    }
  }

  // Function to refresh posts
  const refreshPosts = async () => {
    await fetchPosts()
  }

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        error,
        fetchPosts,
        addPost,
        deletePost,
        likePost,
        unlikePost,
        addComment,
        refreshPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostProvider")
  }
  return context
}
