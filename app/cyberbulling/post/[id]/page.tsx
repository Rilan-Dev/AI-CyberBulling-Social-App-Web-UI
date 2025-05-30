"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, MessageCircle, Heart, Share2, AlertTriangle, Shield, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { usePosts } from "@/context/post-context"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { posts, loading, addComment, likePost, unlikePost } = usePosts()
  const [post, setPost] = useState<any>(null)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (!loading && posts.length > 0) {
      const foundPost = posts.find((p) => p.id === Number(params.id))
      if (foundPost) {
        setPost(foundPost)
      }
    }
  }, [loading, posts, params.id])

  const handleBack = () => {
    router.back()
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      await addComment(post.id, newComment)
      setNewComment("")
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeToggle = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      if (post.is_liked) {
        await unlikePost(post.id)
      } else {
        await likePost(post.id)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    } finally {
      setIsLiking(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clean":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "blocked":
        return <Shield className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clean":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "flagged":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20"
      case "blocked":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-green-500/10 text-green-500 border-green-500/20"
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-40" />
        </div>
        <Card className="overflow-hidden border border-blue-500/20 bg-black/40 backdrop-blur-xl">
          <CardHeader className="pb-0">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Post Not Found</h1>
        </div>
        <Card className="overflow-hidden border border-blue-500/20 bg-black/40 backdrop-blur-xl">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-blue-500/10 p-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Post not found</h2>
            <p className="text-muted-foreground text-center max-w-md">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <Button className="mt-6" onClick={handleBack}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-blue-500 opacity-5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="container max-w-4xl mx-auto py-8 px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 hover:bg-blue-500/10 transition-colors"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Post Details
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="overflow-hidden border border-blue-500/20 bg-black/40 backdrop-blur-xl mb-6">
            <CardHeader className="pb-0">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                  <AvatarImage src={`/abstract-geometric-shapes.png?height=40&width=40&query=${post.user.username}`} />
                  <AvatarFallback>
                    {post.user.firstName?.[0]}
                    {post.user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">
                    {post.user.firstName} {post.user.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">@{post.user.username}</div>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <Badge className={`${getStatusColor(post.status)} flex items-center gap-1`}>
                    {getStatusIcon(post.status)}
                    <span className="capitalize">{post.status}</span>
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <p className="whitespace-pre-line">{post.content}</p>

              {post.image && (
                <div className="relative rounded-lg overflow-hidden border border-blue-500/10">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt="Post image"
                    width={800}
                    height={500}
                    className="w-full h-auto object-cover max-h-[500px]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {post.text_analysis && (
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                    <h3 className="text-sm font-medium mb-2 text-blue-400">Text Analysis</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(post.text_analysis.status)}>{post.text_analysis.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prediction:</span>
                        <span>{post.text_analysis.prediction}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span>{(post.text_analysis.confidence * 100).toFixed(2)}%</span>
                      </div>
                      {post.text_analysis.reason && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reason:</span>
                          <span>{post.text_analysis.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {post.image_analysis && (
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                    <h3 className="text-sm font-medium mb-2 text-blue-400">Image Analysis</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getStatusColor(post.image_analysis.status)}>
                          {post.image_analysis.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Prediction:</span>
                        <span>{post.image_analysis.prediction}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span>{(post.image_analysis.confidence * 100).toFixed(2)}%</span>
                      </div>
                      {post.image_analysis.reason && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reason:</span>
                          <span>{post.image_analysis.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-blue-500/10 bg-blue-500/5 py-3">
              <div className="flex items-center justify-between w-full">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-1 ${post.is_liked ? "text-red-500" : "text-muted-foreground"} transition-colors`}
                  onClick={handleLikeToggle}
                  disabled={isLiking}
                >
                  <Heart className={`h-5 w-5 ${post.is_liked ? "fill-red-500" : ""}`} />
                  <span>{post.like_count}</span>
                </motion.button>
                <button className="flex items-center space-x-1 text-muted-foreground">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments?.length || 0}</span>
                </button>
                <button className="flex items-center space-x-1 text-muted-foreground">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border border-blue-500/20 bg-black/40 backdrop-blur-xl mb-6">
            <CardHeader>
              <h2 className="text-xl font-semibold">Add a Comment</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitComment}>
                <Textarea
                  placeholder="Write your comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-4 bg-blue-950/20 border-blue-500/20 focus-visible:ring-blue-500"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="border border-blue-500/20 bg-black/40 backdrop-blur-xl">
            <CardHeader>
              <h2 className="text-xl font-semibold">Comments ({post.comments?.length || 0})</h2>
            </CardHeader>
            <CardContent>
              {post.comments && post.comments.length > 0 ? (
                <div className="space-y-4">
                  {post.comments.map((comment: any, index: number) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-blue-500/20 bg-blue-950/10"
                    >
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`/abstract-geometric-shapes.png?height=40&width=40&query=${comment.user.username}`}
                          />
                          <AvatarFallback>
                            {comment.user.firstName?.[0]}
                            {comment.user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">
                                {comment.user.firstName} {comment.user.lastName}
                              </span>
                              <span className="text-sm text-muted-foreground ml-2">@{comment.user.username}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={`${getStatusColor(comment.status)} flex items-center gap-1`}>
                                {getStatusIcon(comment.status)}
                                <span className="capitalize">{comment.status}</span>
                              </Badge>
                              <div className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                          <p className="mt-2">{comment.content}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto text-blue-500/50 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No comments yet</h3>
                  <p className="text-muted-foreground">Be the first to share your thoughts!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
