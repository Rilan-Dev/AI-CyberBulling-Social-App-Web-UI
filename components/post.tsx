"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import SafeImage from "@/components/ui/safeImage";
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Flag,
  MoreHorizontal,
  Trash2,
  Heart,
  BookmarkIcon,
  Send,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { usePosts } from "@/context/post-context";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/auth-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Post as PostType } from "@/Model/post.model";
import { Input } from "./ui/input";

export interface PostProps {
  post: PostType;
  isOwner?: boolean;
}

export function PostCard({ post, isOwner = false }: PostProps) {
  const { deletePost, likePost, unlikePost, addComment } = usePosts();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.like_count || 0);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const { userProfile: user } = useAuth();

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      addComment(post.id, comment);
      setComment("");
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await unlikePost(post.id);
        setLikesCount(likesCount - 1);
      } else {
        await likePost(post.id);
        setLikesCount(likesCount + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deletePost(post.id);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Check if the current user is the post owner
  const canDelete = isOwner || (user && post.user && user.id === post.user.id);

  return (
    <>
      <Card className="mb-4 overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-4 flex flex-row items-center gap-3">
          <Avatar>
            {/* <AvatarImage src={post.user?.profile_picture || "/placeholder.svg"} /> */}
            <AvatarFallback>
              {post.user?.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {post.user?.firstName} {post.user?.lastName}
              </span>
              <span className="text-muted-foreground text-sm">
                @{post.user?.username}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
          <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                This post has been flagged for review
              </span>
            </div>
          </div>
        )}

        {post.status === "blocked" && (
          <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-600 dark:text-red-400">
                This post has been blocked due to harmful content
              </span>
            </div>
          </div>
        )}

        <CardContent className="p-0">
          <div className="px-4 py-2">
            <p className="text-sm">{post.content}</p>
          </div>
          {post.image && (
            <div className="relative aspect-video w-full overflow-hidden">
              <SafeImage
                src={post.image}
                alt="Post image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col p-4 pt-2 space-y-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className="h-8 w-8"
              >
                <Heart
                  className={`h-4 w-4 ${
                    liked ? "fill-red-500 text-red-500" : ""
                  }`}
                  aria-label={liked ? "Unlike" : "Like"}
                />
              </Button>
              <span className="text-xs">
                {liked ? post.like_count + 1 : post.like_count}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <span className="text-xs">{post.comments.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="h-8 w-8"
              >
                <BookmarkIcon
                  className={`h-4 w-4 ${
                    saved ? "fill-primary text-primary" : ""
                  }`}
                  aria-label={saved ? "Unsave" : "Save"}
                />
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">{post.created_at}</div>

          <form
            onSubmit={handleComment}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="h-8 text-sm"
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8"
              disabled={!comment.trim()}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send comment</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post.
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
  );
}

// Export the PostCard component as Post for backward compatibility
export const Post = PostCard;
