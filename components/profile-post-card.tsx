"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Trash2, AlertCircle } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import SafeImage from "./ui/safeImage"
import { Post } from "@/Model/post.model"
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

interface ProfilePostCardProps {
  post: Post
  isOwner?: boolean
}

export function ProfilePostCard({ post, isOwner = false }: ProfilePostCardProps) {
  const router = useRouter()
  const { deletePost } = usePosts()
  const { toast } = useToast()
  const { userProfile } = useAuth()
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
  const canDelete = isOwner || (userProfile && post.user && userProfile.id === post.user.id)

  return (
    <>
      <Card
        className="overflow-hidden cursor-pointer relative aspect-square"
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
            <div
              className={cn(
                "absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity",
                isHovering ? "opacity-100" : "opacity-0",
              )}
            >
              <div className="flex gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <span>{post.like_count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments.length}</span>
                </div>
                {canDelete && (
                  <div 
                    className="flex items-center gap-2 text-red-400 hover:text-red-300"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="h-5 w-5" />
                    <span>Delete</span>
                  </div>
                )}
              </div>
            </div>

            {/* Status indicator */}
            {post.status !== "clean" && (
              <div
                className={cn(
                  "absolute top-2 right-2 w-3 h-3 rounded-full",
                  post.status === "flagged" ? "bg-yellow-500" : "bg-red-500",
                )}
              ></div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted p-4">
            <div className="text-center">
              <p className="text-sm font-medium line-clamp-4">{post.content}</p>

              <div className="mt-4 flex gap-6 justify-center text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="text-xs">{post.like_count}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-xs">{post.comments.length}</span>
                </div>
                {canDelete && (
                  <div 
                    className="flex items-center gap-2 text-red-400 hover:text-red-300"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-xs">Delete</span>
                  </div>
                )}
              </div>

              {/* Status indicator */}
              {post.status !== "clean" && (
                <div
                  className={cn(
                    "absolute top-2 right-2 w-3 h-3 rounded-full",
                    post.status === "flagged" ? "bg-yellow-500" : "bg-red-500",
                  )}
                ></div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
