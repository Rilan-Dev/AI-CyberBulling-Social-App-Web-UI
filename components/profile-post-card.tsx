"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { Post } from "@/context/post-context"

interface ProfilePostCardProps {
  post: Post
}

export function ProfilePostCard({ post }: ProfilePostCardProps) {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)

  const handleClick = () => {
    // In a real app, this would navigate to the post detail page
    // router.push(`/post/${post.id}`)
    alert(`Viewing post: ${post.id}`)
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer relative aspect-square"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      {post.image ? (
        <div className="relative w-full h-full">
          <Image
            src={post.image || "/placeholder.svg"}
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
  )
}
