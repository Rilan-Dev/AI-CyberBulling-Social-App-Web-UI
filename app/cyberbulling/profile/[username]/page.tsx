"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
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
  MapPinIcon,
  LinkIcon,
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
import { ProfilePostCard } from "@/components/cyberbulling/profile-post-card"
import { PostCard } from "@/components/cyberbulling/post"
import type { UserModel } from "@/Model/users.model"
import type { Post } from "@/Model/post.model"
import { userService } from "@/services/user.service"
import { toast } from "@/components/ui/use-toast"
import { usePosts } from "@/context/post-context"
import { useThemeDetector, getThemeColors } from "@/lib/Theme-Switcher/theme-utils"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

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
  const { refreshPosts } = usePosts()
  const { isDarkTheme, mounted } = useThemeDetector()

  // Get theme colors
  const colors = getThemeColors(isDarkTheme)

  // Check if this is the current user's profile
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const currentUser = await userService.getCurrentUser()
        setIsCurrentUser(currentUser?.user.username === username)
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
  }, [username, refreshPosts])

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

    try {
      toast({
        title: "Uploading...",
        description: "Your profile picture is being updated",
      })

      const formData = new FormData()
      formData.append("profile_picture", file)

      const updatedProfile = await userService.updateProfile(formData)
      setProfileData(updatedProfile || null)

      toast({
        title: "Success",
        description: "Profile picture updated successfully",
        variant: "default",
      })

      router.refresh()
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

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  if (loadingProfile) {
    return (
      <div className={`min-h-screen ${colors.gradientPrimary} relative overflow-hidden`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 ${colors.gradientAccent}`}></div>
          <div
            className="absolute inset-0"
            style={{ backgroundImage: colors.gridOverlay, backgroundSize: "40px 40px" }}
          ></div>
        </div>

        <div className="container py-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Skeleton className={`h-24 w-24 rounded-full ${isDarkTheme ? "bg-gray-800/50" : "bg-gray-200"}`} />
              <div className="flex-1 space-y-4">
                <Skeleton className={`h-8 w-48 ${isDarkTheme ? "bg-gray-800/50" : "bg-gray-200"}`} />
                <Skeleton className={`h-4 w-full ${isDarkTheme ? "bg-gray-800/50" : "bg-gray-200"}`} />
                <div className="flex gap-4">
                  <Skeleton className={`h-10 w-24 ${isDarkTheme ? "bg-gray-800/50" : "bg-gray-200"}`} />
                  <Skeleton className={`h-10 w-24 ${isDarkTheme ? "bg-gray-800/50" : "bg-gray-200"}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${colors.gradientPrimary} relative overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 ${colors.gradientAccent}`}></div>
        <div
          className="absolute inset-0"
          style={{ backgroundImage: colors.gridOverlay, backgroundSize: "40px 40px" }}
        ></div>
      </div>

      <div className="container py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Card className={`mb-8 ${colors.cardBg} ${colors.backdropBlur} ${colors.cardBorder}`}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar
                      className={`h-24 w-24 border-4 ${isDarkTheme ? "border-blue-500/20 ring-2 ring-blue-500/10" : "border-blue-200 ring-2 ring-blue-100"}`}
                    >
                      {profileData?.profile_picture ? (
                        <AvatarImage
                          src={profileData.profile_picture || "/placeholder.svg"}
                          alt={`${profileData.user.firstName} ${profileData.user.lastName}`}
                        />
                      ) : (
                        <AvatarFallback
                          className={isDarkTheme ? "bg-blue-900/30 text-blue-200" : "bg-blue-100 text-blue-800"}
                        >
                          {profileData?.user.firstName?.charAt(0) || ""}
                          {profileData?.user.lastName?.charAt(0) || ""}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isCurrentUser && (
                      <motion.label
                        htmlFor="profile-picture-upload"
                        className="absolute bottom-0 right-0 cursor-pointer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <input
                          id="profile-picture-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePictureUpdate}
                        />
                        <div className="rounded-full bg-blue-600 text-white p-2 shadow-lg hover:bg-blue-700 transition-colors">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      </motion.label>
                    )}
                  </motion.div>

                  <motion.div className="flex-1 text-center md:text-left" variants={slideUp}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                      <div>
                        <h1 className={`text-2xl font-bold ${colors.textPrimary}`}>
                          {profileData?.user.firstName} {profileData?.user.lastName}
                        </h1>
                        <p className={isDarkTheme ? "text-blue-300" : "text-blue-600"}>@{profileData?.user.username}</p>
                      </div>

                      <div className="flex gap-2">
                        {!isCurrentUser ? (
                          <>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant={isFollowing ? "outline" : "default"}
                                onClick={handleFollow}
                                className={
                                  isFollowing
                                    ? isDarkTheme
                                      ? "border-blue-500 text-blue-300 hover:bg-blue-900/20"
                                      : "border-blue-300 text-blue-600 hover:bg-blue-50"
                                    : "bg-blue-600 hover:bg-blue-700 text-white"
                                }
                              >
                                {isFollowing ? "Following" : "Follow"}
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="icon"
                                className={
                                  isDarkTheme
                                    ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                }
                              >
                                <MessageSquareIcon className="h-4 w-4" />
                              </Button>
                            </motion.div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className={
                                      isDarkTheme
                                        ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }
                                  >
                                    <MoreHorizontalIcon className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className={
                                  isDarkTheme ? "bg-gray-900 border border-gray-800" : "bg-white border border-gray-200"
                                }
                              >
                                <DropdownMenuItem
                                  className={
                                    isDarkTheme
                                      ? "text-gray-300 hover:bg-gray-800 focus:bg-gray-800"
                                      : "text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                                  }
                                >
                                  <Share2Icon className="h-4 w-4 mr-2" />
                                  Share profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className={isDarkTheme ? "bg-gray-800" : "bg-gray-200"} />
                                <DropdownMenuItem
                                  className={
                                    isDarkTheme
                                      ? "text-red-400 hover:bg-gray-800 focus:bg-gray-800"
                                      : "text-red-600 hover:bg-gray-100 focus:bg-gray-100"
                                  }
                                >
                                  Block user
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </>
                        ) : (
                          <>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                onClick={() => router.push("/settings")}
                                className={
                                  isDarkTheme
                                    ? "border-blue-500 text-blue-300 hover:bg-blue-900/20"
                                    : "border-blue-300 text-blue-600 hover:bg-blue-50"
                                }
                              >
                                Edit Profile
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="icon"
                                className={
                                  isDarkTheme
                                    ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                }
                              >
                                <SettingsIcon className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          </>
                        )}
                      </div>
                    </div>

                    <motion.div
                      className="flex justify-center md:justify-start gap-6 mb-4"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      <motion.div className="text-center" variants={slideUp}>
                        <p className={`font-bold ${colors.textPrimary}`}>{profileData?.post_count || 0}</p>
                        <p className={`text-sm ${colors.textTertiary}`}>Posts</p>
                      </motion.div>
                      <motion.div
                        className="text-center cursor-pointer hover:opacity-80"
                        onClick={handleViewFollowers}
                        variants={slideUp}
                      >
                        <p className={`font-bold ${colors.textPrimary}`}>{followers}</p>
                        <p className={`text-sm ${colors.textTertiary}`}>Followers</p>
                      </motion.div>
                      <motion.div
                        className="text-center cursor-pointer hover:opacity-80"
                        onClick={handleViewFollowing}
                        variants={slideUp}
                      >
                        <p className={`font-bold ${colors.textPrimary}`}>{following}</p>
                        <p className={`text-sm ${colors.textTertiary}`}>Following</p>
                      </motion.div>
                    </motion.div>

                    <motion.p className={`text-sm mb-3 ${colors.textSecondary}`} variants={slideUp}>
                      {profileData?.bio || "No bio available"}
                    </motion.p>

                    <motion.div
                      className="flex flex-col gap-1 text-sm"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {profileData?.location && (
                        <motion.div className={`flex items-center gap-2 ${colors.textTertiary}`} variants={slideUp}>
                          <MapPinIcon className={`h-4 w-4 ${isDarkTheme ? "text-blue-400" : "text-blue-600"}`} />
                          <span>{profileData.location}</span>
                        </motion.div>
                      )}

                      {profileData?.website && (
                        <motion.div className="flex items-center gap-2" variants={slideUp}>
                          <LinkIcon className={`h-4 w-4 ${isDarkTheme ? "text-blue-400" : "text-blue-600"}`} />
                          <a
                            href={profileData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${isDarkTheme ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"} hover:underline transition-colors`}
                          >
                            {profileData.website.replace(/^https?:\/\//, "")}
                          </a>
                        </motion.div>
                      )}

                      {profileData?.createdAt && (
                        <motion.div className={`flex items-center gap-2 ${colors.textTertiary}`} variants={slideUp}>
                          <CalendarIcon className={`h-4 w-4 ${isDarkTheme ? "text-blue-400" : "text-blue-600"}`} />
                          <span>Joined {new Date(profileData.createdAt).toLocaleDateString()}</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Tabs defaultValue="posts" className={colors.textPrimary}>
              <div className="flex justify-between items-center mb-4">
                <TabsList
                  className={`grid w-full max-w-md grid-cols-3 ${isDarkTheme ? "bg-gray-800/50 border border-gray-700" : "bg-gray-100 border border-gray-200"}`}
                >
                  <TabsTrigger
                    value="posts"
                    className={
                      isDarkTheme
                        ? "data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300"
                        : "data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    }
                  >
                    Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="media"
                    className={
                      isDarkTheme
                        ? "data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300"
                        : "data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    }
                  >
                    Media
                  </TabsTrigger>
                  <TabsTrigger
                    value="saved"
                    className={
                      isDarkTheme
                        ? "data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300"
                        : "data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    }
                  >
                    Saved
                  </TabsTrigger>
                </TabsList>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleViewMode}
                    className={
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {viewMode === "grid" ? <ListIcon className="h-4 w-4" /> : <GridIcon className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline">{viewMode === "grid" ? "List View" : "Grid View"}</span>
                  </Button>
                </motion.div>
              </div>

              <TabsContent value="posts" className="mt-6">
                {loadingPosts ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className={`aspect-square w-full rounded-lg ${isDarkTheme ? "bg-gray-800/50" : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton
                          key={i}
                          className={`h-[300px] w-full rounded-lg ${isDarkTheme ? "bg-gray-800/50" : "bg-gray-200"}`}
                        />
                      ))}
                    </div>
                  )
                ) : userPosts.length > 0 ? (
                  viewMode === "grid" ? (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {userPosts.map((post) => (
                        <motion.div key={post.id} variants={fadeIn}>
                          <ProfilePostCard post={post} isOwner={isCurrentUser} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
                      {userPosts.map((post) => (
                        <motion.div key={post.id} variants={slideUp}>
                          <PostCard post={post} isOwner={isCurrentUser} />
                        </motion.div>
                      ))}
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    className={`text-center py-12 ${colors.cardBg} ${colors.backdropBlur} rounded-xl ${colors.cardBorder}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${isDarkTheme ? "bg-gray-800" : "bg-gray-100"} mb-4`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <GridIcon className={`h-6 w-6 ${isDarkTheme ? "text-blue-400" : "text-blue-600"}`} />
                    </motion.div>
                    <h3 className={`font-medium ${colors.textPrimary}`}>No Posts Yet</h3>
                    <p className={`text-sm ${colors.textTertiary} mt-1`}>
                      When {isCurrentUser ? "you" : "they"} post, {isCurrentUser ? "your" : "their"} content will appear
                      here.
                    </p>
                    {isCurrentUser && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="mt-4">
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Link href="/create-post">Create Your First Post</Link>
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="media" className="mt-6">
                {loadingPosts ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className={`aspect-square w-full rounded-lg ${isDarkTheme ? "bg-gray-800/50" : "bg-gray-200"}`}
                      />
                    ))}
                  </div>
                ) : userPosts.filter((post) => post.image).length > 0 ? (
                  <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {userPosts
                      .filter((post) => post.image)
                      .map((post) => (
                        <motion.div key={post.id} variants={fadeIn}>
                          <ProfilePostCard post={post} isOwner={isCurrentUser} />
                        </motion.div>
                      ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className={`text-center py-12 ${colors.cardBg} ${colors.backdropBlur} rounded-xl ${colors.cardBorder}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${isDarkTheme ? "bg-gray-800" : "bg-gray-100"} mb-4`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <ImageIcon className={`h-6 w-6 ${isDarkTheme ? "text-blue-400" : "text-blue-600"}`} />
                    </motion.div>
                    <h3 className={`font-medium ${colors.textPrimary}`}>No Media Posts</h3>
                    <p className={`text-sm ${colors.textTertiary} mt-1`}>
                      When {isCurrentUser ? "you" : "they"} post photos or videos, they will appear here.
                    </p>
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="saved" className="mt-6">
                <motion.div
                  className={`text-center py-12 ${colors.cardBg} ${colors.backdropBlur} rounded-xl ${colors.cardBorder}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${isDarkTheme ? "bg-gray-800" : "bg-gray-100"} mb-4`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <BookmarkIcon className={`h-6 w-6 ${isDarkTheme ? "text-blue-400" : "text-blue-600"}`} />
                  </motion.div>
                  <h3 className={`font-medium ${colors.textPrimary}`}>No Saved Posts</h3>
                  <p className={`text-sm ${colors.textTertiary} mt-1`}>Save posts to view them later.</p>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
