"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CalendarIcon,
  GridIcon,
  SettingsIcon,
  ImageIcon,
  BookmarkIcon,
  ListIcon,
  MessageSquareIcon,
  Share2Icon,
  MoreHorizontalIcon,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ProfilePostCard } from "@/components/profile-post-card"
import { PostCard } from "@/components/post"
import type { UserModel } from "@/Model/users.model"
import type { Post } from "@/Model/post.model"
import { userService } from "@/services/user.service"
import { toast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const router = useRouter()
  const { username } = useParams() as { username: string }
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [profileData, setProfileData] = useState<UserModel | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [followers, setFollowers] = useState<number>(0)
  const [following, setFollowing] = useState<number>(0)
  const [isCurrentUser, setIsCurrentUser] = useState(false)

  // Check if this is the current user's profile
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser()
        setIsCurrentUser(currentUser?.user.username === username)
        console.log("currentUser?.user.username User:", currentUser?.user.username)
        console.log("username User:", username)
        console.log("Current User:", isCurrentUser)
      } catch (error) {
        console.error("Error checking current user:", error)
      }
    }

    checkCurrentUser()
  }, [username])

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true)
      try {
        let userData: UserModel

        if (isCurrentUser) {
          const currentUser = await userService.getCurrentUser()
          if (!currentUser) {
            return Error("Failed to fetch current user")
          }
          userData = currentUser
        } else {
          const currentUser = await userService.getUserProfile(username)
          if (!currentUser) {
            return Error("Failed to fetch current user")
          }
          userData = currentUser
        }

        setProfileData(userData)
        setIsFollowing(userData.is_following)
        setFollowers(userData.follower_count)
        setFollowing(userData.following_count)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        })
      } finally {
        setLoadingProfile(false)
      }
    }

    if (username) {
      fetchProfile()
    }
  }, [username, isCurrentUser])

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      setLoadingPosts(true)
      try {
        const posts = await userService.getUserPosts(username)
        setUserPosts(posts || [])
      } catch (error) {
        console.error("Error fetching user posts:", error)
        toast({
          title: "Error",
          description: "Failed to load user posts",
          variant: "destructive",
        })
      } finally {
        setLoadingPosts(false)
      }
    }

    if (username) {
      fetchUserPosts()
    }
  }, [username])

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userService.unfollowUser(username)
        setIsFollowing(false)
        setFollowers((prev) => prev - 1)
        toast({
          title: "Unfollowed",
          description: `You are no longer following @${username}`,
        })
      } else {
        await userService.followUser(username)
        setIsFollowing(true)
        setFollowers((prev) => prev + 1)
        toast({
          title: "Following",
          description: `You are now following @${username}`,
        })
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
      toast({
        title: "Error",
        description: "Failed to update follow status",
        variant: "destructive",
      })
    }
  }

  const handleViewFollowers = async () => {
    try {
      const followers = await userService.getUserFollowers(username)
      // Here you would typically open a modal to display followers
      console.log("Followers:", followers)
      // For now, just show a toast
      toast({
        title: "Followers",
        description: `${username} has ${followers?.length} followers`,
      })
    } catch (error) {
      console.error("Error fetching followers:", error)
      toast({
        title: "Error",
        description: "Failed to load followers",
        variant: "destructive",
      })
    }
  }

  const handleViewFollowing = async () => {
    try {
      const following = await userService.getUserFollowing(username)
      // Here you would typically open a modal to display following users
      console.log("Following:", following)
      // For now, just show a toast
      toast({
        title: "Following",
        description: `${username} is following ${following?.length} users`,
      })
    } catch (error) {
      console.error("Error fetching following:", error)
      toast({
        title: "Error",
        description: "Failed to load following users",
        variant: "destructive",
      })
    }
  }

  const handleProfilePictureUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("profile_picture", file)

    try {
      const updatedProfile = await userService.updateProfile(formData)
      setProfileData(updatedProfile || null)
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile picture:", error)
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      })
    }
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid")
  }

  if (loadingProfile) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background">
                  {profileData?.profile_picture ? (
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_API_URL}${profileData.profile_picture}`}
                      alt={`${profileData.user.firstName} ${profileData.user.lastName}`}
                    />
                  ) : (
                    <AvatarFallback>
                      {profileData?.user.firstName?.charAt(0) || ""}
                      {profileData?.user.lastName?.charAt(0) || ""}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isCurrentUser && (
                  <label htmlFor="profile-picture-upload">
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureUpdate}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full bg-background h-8 w-8 cursor-pointer"
                      type="button"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </label>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">
                      {profileData?.user.firstName} {profileData?.user.lastName}
                    </h1>
                    <p className="text-sm text-muted-foreground">@{profileData?.user.username}</p>
                  </div>

                  <div className="flex gap-2">
                    {!isCurrentUser ? (
                      <>
                        <Button variant={isFollowing ? "outline" : "default"} onClick={handleFollow}>
                          {isFollowing ? "Following" : "Follow"}
                        </Button>
                        <Button variant="outline" size="icon">
                          <MessageSquareIcon className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Share2Icon className="h-4 w-4 mr-2" />
                              Share profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">Block user</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" onClick={() => router.push("/settings")}>
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="icon">
                          <SettingsIcon className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-center md:justify-start gap-6 mb-4">
                  <div className="text-center">
                    <p className="font-bold">{profileData?.post_count || 0}</p>
                    <p className="text-sm text-muted-foreground">Posts</p>
                  </div>
                  <div className="text-center cursor-pointer hover:opacity-80" onClick={handleViewFollowers}>
                    <p className="font-bold">{followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center cursor-pointer hover:opacity-80" onClick={handleViewFollowing}>
                    <p className="font-bold">{following}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>

                <p className="text-sm mb-3">{profileData?.bio || "No bio available"}</p>

                <div className="flex flex-col gap-1 text-sm">
                  {profileData?.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-map-pin"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{profileData.location}</span>
                    </div>
                  )}

                  {profileData?.website && (
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-link"
                      >
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {profileData.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}

                  {profileData?.createdAt && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Joined {new Date(profileData.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="posts">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm" onClick={toggleViewMode}>
              {viewMode === "grid" ? <ListIcon className="h-4 w-4" /> : <GridIcon className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">{viewMode === "grid" ? "List View" : "Grid View"}</span>
            </Button>
          </div>

          <TabsContent value="posts" className="mt-6">
            {loadingPosts ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
                  ))}
                </div>
              )
            ) : userPosts.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {userPosts.map((post) => (
                    <ProfilePostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {userPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <GridIcon className="h-6 w-6" />
                </div>
                <h3 className="font-medium">No Posts Yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When {isCurrentUser ? "you" : "they"} post, {isCurrentUser ? "your" : "their"} content will appear
                  here.
                </p>
                {isCurrentUser && (
                  <Button className="mt-4" asChild>
                    <Link href="/create-post">Create Your First Post</Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            {loadingPosts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-lg" />
                ))}
              </div>
            ) : userPosts.filter((post) => post.image).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {userPosts
                  .filter((post) => post.image)
                  .map((post) => (
                    <ProfilePostCard key={post.id} post={post} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <h3 className="font-medium">No Media Posts</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  When {isCurrentUser ? "you" : "they"} post photos or videos, they will appear here.
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <div className="text-center py-12">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <BookmarkIcon className="h-6 w-6" />
              </div>
              <h3 className="font-medium">No Saved Posts</h3>
              <p className="text-sm text-muted-foreground mt-1">Save posts to view them later.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
