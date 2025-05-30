"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, RefreshCw } from "lucide-react"
import ErrorBoundary from "@/components/rendering-components/error-boundary"
import { Post } from "@/Model/post.model"
import { postService } from "@/services/post.service"

export function ApiDataDisplay() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await postService.getPosts()
      setPosts(data)
    } catch (err: any) {
      setError(err.message || "Failed to fetch posts")
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const fallbackUI = (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-red-500 flex items-center">
          <AlertCircle className="mr-2 h-5 w-5" />
          Something went wrong
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>An unexpected error occurred while fetching data</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <ErrorBoundary fallback={fallbackUI}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">API Data</h2>
          <Button variant="outline" size="sm" onClick={fetchPosts} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.user.username}</CardTitle>
                  <CardDescription>
                    Posted on: {post.created_at ? new Date(post.created_at).toLocaleString() : post.created_at}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                  {post.status !== "clean" && (
                    <Alert className={`mt-4 ${post.status === "flagged" ? "bg-yellow-50" : "bg-red-50"}`}>
                      <AlertTitle>{post.status === "flagged" ? "Flagged Content" : "Blocked Content"}</AlertTitle>
                      <AlertDescription>
                        {post.reason || "This content has been flagged by our system."}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No posts available.</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}
