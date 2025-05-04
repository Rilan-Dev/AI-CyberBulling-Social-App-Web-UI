"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Trash2, Eye, AlertTriangle, AlertCircle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import SafeImage from "./ui/safeImage"
import type { Post } from "@/Model/post.model"
import { usePosts } from "@/context/post-context"
import { useToast } from "@/components/ui/use-toast"
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
import { useAuth } from "@/context/auth-context"
import { Badge } from "@/components/ui/badge"

interface ProfilePostCardProps {
  post: Post
  isOwner?: boolean
}

export function ProfilePostCard({ post, isOwner = false }: ProfilePostCardProps) {
  const router = useRouter()
  const { deletePost } = usePosts()
  const { toast } = useToast()
  const { userProfile: user } = useAuth()
  const [isHovering, setIsHovering] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClick = () => {
    // In a real app, this would navigate to the post detail page
    router.push(`/post/${post.id}`)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the card click
    setShowDeleteDialog(true)
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

  // Get status icon
  const getStatusIcon = () => {
    switch (post.status) {
      case "clean":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "flagged":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      case "blocked":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return null
    }
  }

  // Get status color
  const getStatusColor = () => {
    switch (post.status) {
      case "clean":
        return "bg-green-500"
      case "flagged":
        return "bg-yellow-500"
      case "blocked":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
        <Card
          className="overflow-hidden cursor-pointer relative aspect-square bg-gray-900/70 backdrop-blur-sm border border-gray-800 shadow-lg"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleClick}
        >
          {post.image ? (
            <div className="relative w-full h-full">
              <SafeImage
                src={post.image}
                alt="Post image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay on hover */}
              <motion.div
                className="absolute inset-0 bg-black/60 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovering ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col gap-4 text-white">
                  <div className="flex gap-6 items-center">
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart className="h-5 w-5 text-red-400" />
                      <span>{post.like_count}</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center gap-2"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <MessageCircle className="h-5 w-5 text-blue-400" />
                      <span>{post.comments?.length || 0}</span>
                    </motion.div>
                    {canDelete && (
                      <motion.div
                        className="flex items-center gap-2 text-red-400 hover:text-red-300"
                        onClick={handleDeleteClick}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 className="h-5 w-5" />
                        <span>Delete</span>
                      </motion.div>
                    )}
                  </div>

                  {post.status && (
                    <Badge
                      className={cn(
                        "self-center",
                        post.status === "clean"
                          ? "bg-green-600"
                          : post.status === "flagged"
                            ? "bg-yellow-600"
                            : "bg-red-600",
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon()}
                        <span className="capitalize">{post.status}</span>
                      </div>
                    </Badge>
                  )}

                  <motion.div
                    className="flex items-center gap-2 justify-center mt-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Eye className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">View Details</span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Status indicator */}
              {post.status !== "clean" && (
                <div className={cn("absolute top-2 right-2 w-3 h-3 rounded-full", getStatusColor())}></div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800/50 p-4">
              <div className="text-center">
                <p className="text-sm font-medium line-clamp-4 text-gray-300">{post.content}</p>

                <div className="mt-4 flex gap-6 justify-center text-gray-400">
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Heart className="h-4 w-4 text-red-400" />
                    <span className="text-xs">{post.like_count}</span>
                  </motion.div>
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-xs">{post.comments?.length || 0}</span>
                  </motion.div>
                  {canDelete && (
                    <motion.div
                      className="flex items-center gap-2 text-red-400 hover:text-red-300"
                      onClick={handleDeleteClick}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-xs">Delete</span>
                    </motion.div>
                  )}
                </div>

                {/* Status badge */}
                {post.status && (
                  <div className="mt-3">
                    <Badge
                      className={cn(
                        post.status === "clean"
                          ? "bg-green-600"
                          : post.status === "flagged"
                            ? "bg-yellow-600"
                            : "bg-red-600",
                      )}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon()}
                        <span className="capitalize">{post.status}</span>
                      </div>
                    </Badge>
                  </div>
                )}

                {/* Status indicator */}
                {post.status !== "clean" && (
                  <div className={cn("absolute top-2 right-2 w-3 h-3 rounded-full", getStatusColor())}></div>
                )}
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-gray-900 border border-gray-800 text-gray-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
