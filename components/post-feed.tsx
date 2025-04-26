"use client"

import { usePosts } from "@/context/post-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { use, useEffect } from "react"
import { apiService } from "@/services/api.service"
import { API_PATHS } from "@/services/api-endpoints"
import { PostCard } from "./post"
import { Post } from "@/Model/post.model"


export function PostFeed() {
  const { posts, loading, refreshPosts } = usePosts()

  const handleRefresh = async () => {
    await refreshPosts()
  }

  useEffect( () => {
      // const data = apiService.getAll<Post>({ endpoint: API_PATHS.POSTS });
      console.log("Fetched PostFeed:", posts)
  }, [posts]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Feed</h2>
        <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        // Loading skeletons
        Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4 flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
            <Skeleton className="h-[300px] w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))
      ) : posts.length > 0 ? (
        posts.map((post: Post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
        </div>
      )}
    </div>
  )
}
