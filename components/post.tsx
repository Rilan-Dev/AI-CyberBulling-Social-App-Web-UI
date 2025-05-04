"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import SafeImage from "@/components/ui/safeImage"
import { ThumbsUp, MessageCircle, Share2, Flag, MoreHorizontal, Trash2, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { usePosts } from "@/context/post-context"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Post as PostType } from "@/Model/post.model"
import { useRouter } from "next/navigation"

export interface PostProps {
  post: PostType
  isOwner?: boolean
}

export function PostCard({ post, isOwner = false }: PostProps) {
  const [liked, setLiked] = useState(post.is_liked || false)
  const [likesCount, setLikesCount] = useState(post.like_count || 0)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { deletePost, likePost, unlikePost } = usePosts()
  const { toast } = useToast()
  const { userProfile: user } = useAuth()
  const router = useRouter()

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikePost(post.id)
        setLikesCount(likesCount - 1)
      } else {
        await likePost(post.id)
        setLikesCount(likesCount + 1)
      }
      setLiked(!liked)
    } catch (error) {
      console.error("Error toggling like:", error)
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deletePost(post.id)
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  // Check if the current user is the post owner
  const canDelete = isOwner || (user && post.user && user.id === post.user.id)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-4 overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center gap-3">
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
              <Avatar>
                {/* <AvatarImage src={post.user?.profile_picture || "/placeholder.svg"} /> */}
                <AvatarFallback>{post.user?.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            </motion.div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {post.user?.firstName} {post.user?.lastName}
                </span>
                <span className="text-muted-foreground text-sm">@{post.user?.username}</span>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 border border-border/50 bg-card/80 backdrop-blur-sm">
                  {canDelete && (
                    <>
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete post
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem>
                    <Flag className="mr-2 h-4 w-4" /> Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          {post.status === "flagged" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-sm text-yellow-600 dark:text-yellow-400">
                  This post has been flagged for review
                </span>
              </div>
            </motion.div>
          )}

          {post.status === "blocked" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 dark:bg-red-900/20 px-4 py-2"
            >
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  This post has been blocked due to harmful content
                </span>
              </div>
            </motion.div>
          )}

<CardContent className="p-0">
            <div className="px-4 py-2">
              <p className="text-sm">{post.content}</p>
            </div>
            {post.image && (
              <div className="relative aspect-video w-full overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 rounded-md overflow-hidden"
                >
                  <SafeImage
                    src={post.image}
                    alt="Post image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </motion.div>
              </div>
            )}
          </CardContent>

          <CardFooter className="px-4 py-2 border-t flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-1 transition-colors ${liked ? "text-blue-600 dark:text-blue-400" : ""}`}
              onClick={handleLike}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                animate={liked ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <ThumbsUp className="h-4 w-4" />
              </motion.div>
              <span>{likesCount}</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-1">
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <MessageCircle className="h-4 w-4" />
              </motion.div>
              <span>{post.comments?.length || 0}</span>
            </Button>

            <Button variant="ghost" size="sm" className="gap-1">
              <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                <Share2 className="h-4 w-4" />
              </motion.div>
              <span>0</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
              onClick={() => router.push(`/post/${post.id}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="border border-border/50 bg-card/80 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-500 hover:bg-red-600">
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Export the PostCard component as Post for backward compatibility
export const Post = PostCard
