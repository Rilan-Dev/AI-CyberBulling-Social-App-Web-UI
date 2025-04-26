"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  AlertTriangle,
  BookmarkIcon,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import {
  CustomDropdown,
  CustomDropdownItem,
} from "@/components/ui/custom-dropdown";
import { usePosts, type Post as PostType } from "@/context/post-context";
import SafeImage from "./ui/safeImage";

interface PostProps {
  post: PostType;
}

export function PostCard({ post }: PostProps) {
  const { likePost, unlikePost, addComment } = usePosts();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");

  const handleLike = () => {
    if (liked) {
      unlikePost(post.id);
    } else {
      likePost(post.id);
    }
    setLiked(!liked);
  };

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

  const [imgSrc, setImgSrc] = useState("/placeholder.svg");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!post.image) return;

    fetch(post.image, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          setImgSrc(post.image ?? "/placeholder.svg");
        }
      })
      .catch(() => {
        // silently fail to fallback
      })
      .finally(() => {
        setChecked(true);
      });
  }, [post.image]);

  return (
    <Card>
      {post.status === "flagged" && (
        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950 rounded-b-none">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertTitle className="text-yellow-700 dark:text-yellow-300 text-sm">
            Flagged Content
          </AlertTitle>
          <AlertDescription className="text-yellow-600 dark:text-yellow-400 text-xs">
            {post.reason ||
              "This content has been flagged for potential cyberbullying indicators."}
          </AlertDescription>
        </Alert>
      )}

      {post.status === "blocked" && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950 rounded-b-none">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700 dark:text-red-300 text-sm">
            Blocked Content
          </AlertTitle>
          <AlertDescription className="text-red-600 dark:text-red-400 text-xs">
            {post.reason ||
              "This content contains cyberbullying indicators and would be blocked."}
          </AlertDescription>
        </Alert>
      )}

      <CardHeader className="flex flex-row items-center p-4 space-x-4">
        <Link href={`/profile/${post.user.username}`}>
          <Avatar>
            {/* <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} /> */}
            <AvatarFallback>{post.user.firstName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link
            href={`/profile/${post.user.username}`}
            className="font-semibold hover:underline"
          >
            {post.user.username}
          </Link>
          <p className="text-xs text-muted-foreground">@{post.user.username}</p>
        </div>
        <CustomDropdown
          trigger={
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          }
          align="right"
        >
          <CustomDropdownItem>Report</CustomDropdownItem>
          <div className="h-px my-1 -mx-1 bg-muted"></div>
          <CustomDropdownItem>Copy link</CustomDropdownItem>
        </CustomDropdown>
      </CardHeader>

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
  );
}
