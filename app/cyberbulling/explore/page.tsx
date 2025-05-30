"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Post } from "@/components/cyberbulling/post"
import { usePosts } from "@/context/post-context"
import { Search, Filter, AlertCircle, RefreshCw } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, usePathname } from "next/navigation"
import { useThemeDetector, getThemeColors } from "@/lib/Theme-Switcher/theme-utils"

export default function ExplorePage() {
  const { posts, loading, error, fetchPosts } = usePosts()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("trending")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    showClean: true,
    showFlagged: true,
    showBlocked: false,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()
  const mounted = useRef(false)
  const forceRender = useRef(0)
  const { isDarkTheme, mounted: themeIsMounted } = useThemeDetector()

  // Get theme colors
  const colors = getThemeColors(isDarkTheme)

  // Force a re-render when the component mounts
  useEffect(() => {
    mounted.current = true
    // Force a re-render after a short delay to ensure all data is loaded
    const timer = setTimeout(() => {
      forceRender.current += 1
      setFilteredPosts((prev) => [...prev]) // Force a re-render
    }, 100)

    return () => {
      clearTimeout(timer)
      mounted.current = false
    }
  }, [])

  // Debug logging
  useEffect(() => {
    console.log("Explore page mounted, pathname:", pathname)
    console.log("Posts from context:", posts)
    console.log("Loading state:", loading)
    console.log("Filtered posts:", filteredPosts)
    console.log("Force render count:", forceRender.current)
  }, [posts, loading, filteredPosts, pathname, forceRender.current])

  // Manually refresh posts when navigating to this page
  useEffect(() => {
    if (pathname === "/explore" && mounted.current) {
      console.log("Pathname is /explore, refreshing posts")
      const refreshData = async () => {
        setIsRefreshing(true)
        try {
          await fetchPosts()
        } catch (err) {
          console.error("Error refreshing posts:", err)
        } finally {
          setIsRefreshing(false)
        }
      }

      refreshData()
    }
  }, [pathname, fetchPosts])

  // Initialize filtered posts with all posts when they first load
  useEffect(() => {
    if (!loading && Array.isArray(posts) && posts.length > 0) {
      console.log("Setting filtered posts with:", posts.length, "posts")
      setFilteredPosts([...posts])
    }
  }, [loading, posts])

  // Handle filtering when search or filters change
  useEffect(() => {
    if (Array.isArray(posts)) {
      console.log("Filtering posts...")
      let filtered = [...posts]

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(
          (post) =>
            (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (post.user?.firstName && post.user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (post.user?.lastName && post.user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (post.user?.username && post.user.username.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      }

      // Filter by status - only if the post has a status property
      filtered = filtered.filter((post) => {
        // If post doesn't have a status, treat it as "clean"
        const status = post.status || "clean"

        if (status === "clean" && filters.showClean) return true
        if (status === "flagged" && filters.showFlagged) return true
        if (status === "blocked" && filters.showBlocked) return true
        return false
      })

      // Filter by tab
      if (activeTab === "trending") {
        // Sort by likes for trending
        filtered.sort((a, b) => (b.like_count || 0) - (a.like_count || 0))
      } else if (activeTab === "latest") {
        // Sort by date
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
          return dateB - dateA
        })
      } else if (activeTab === "photos") {
        filtered = filtered.filter((post) => post.image !== null && post.image !== undefined)
      }

      console.log("Filtered result:", filtered.length, "posts")
      setFilteredPosts(filtered)
    }
  }, [loading, posts, searchQuery, activeTab, filters])

  // Show error toast if there's an error loading posts
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading posts",
        description: "There was a problem loading posts. Please try again later.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  const toggleFilter = (filter: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }))
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await fetchPosts()
      toast({
        title: "Refreshed",
        description: "Posts have been refreshed",
      })
    } catch (err) {
      console.error("Error refreshing posts:", err)
      toast({
        title: "Error",
        description: "Failed to refresh posts",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Render empty state
  const renderEmptyState = () => {
    return (
      <div className={`text-center py-12 ${colors.cardBg} ${colors.backdropBlur} rounded-lg ${colors.cardBorder}`}>
        <AlertCircle className={`mx-auto h-12 w-12 ${colors.textTertiary} mb-4`} />
        <h3 className={`font-medium ${colors.textPrimary} text-xl`}>No posts found</h3>
        <p className={`text-sm ${colors.textTertiary} mt-2 max-w-md mx-auto`}>
          {activeTab === "photos"
            ? "No photo posts match your current filters. Try adjusting your search criteria or filters."
            : "No posts match your current filters. Try adjusting your search criteria or filters."}
        </p>
        <div className="mt-4 flex justify-center gap-3">
          {(searchQuery || !filters.showClean || !filters.showFlagged) && (
            <Button
              className={colors.buttonPrimary}
              onClick={() => {
                setSearchQuery("")
                setFilters({
                  showClean: true,
                  showFlagged: true,
                  showBlocked: false,
                })
              }}
            >
              Reset Filters
            </Button>
          )}
          <Button
            variant="outline"
            className={
              isDarkTheme
                ? "border-white/20 text-white hover:bg-white/10"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  // Render loading state
  const renderLoadingState = () => {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className={`h-[300px] w-full rounded-lg ${isDarkTheme ? "bg-white/5" : "bg-gray-200"}`} />
        ))}
      </div>
    )
  }

  // Render posts
  const renderPosts = () => {
    if (Array.isArray(filteredPosts) && filteredPosts.length > 0) {
      return (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id || `post-${Math.random()}`}>
              <Post post={post} />
            </div>
          ))}
        </div>
      )
    }
    return renderEmptyState()
  }

  if (!themeIsMounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className={`min-h-screen ${colors.gradientPrimary} relative overflow-hidden`}>
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />

      {/* Radial gradient overlay */}
      <div className={`absolute inset-0 ${colors.gradientAccent}`} />

      {/* Blue glow effect */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full blur-3xl opacity-20" />

      <div className="container py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1
              className={`text-4xl font-bold ${
                isDarkTheme ? "bg-gradient-to-r from-white to-blue-200" : "bg-gradient-to-r from-blue-600 to-blue-800"
              } bg-clip-text text-transparent`}
            >
              Explore
            </h1>
            <Button
              variant="outline"
              size="sm"
              className={
                isDarkTheme
                  ? "border-white/20 text-white hover:bg-white/10"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <Card className={`mb-6 border-0 ${colors.cardBg} ${colors.backdropBlur}`}>
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search posts, users, or hashtags"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} placeholder:${colors.textTertiary}`}
                />
                <Button type="submit" className={colors.buttonPrimary}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={
                    isDarkTheme
                      ? "border-white/20 text-white hover:bg-white/10"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </form>

              {showFilters && (
                <div className={`mt-4 pt-4 border-t ${isDarkTheme ? "border-white/10" : "border-gray-200"}`}>
                  <p className={`text-sm font-medium mb-3 ${colors.textSecondary}`}>Filter by content status:</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="clean-filter"
                        checked={filters.showClean}
                        onCheckedChange={() => toggleFilter("showClean")}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Label htmlFor="clean-filter" className={colors.textPrimary}>
                        Clean{" "}
                        <Badge
                          variant="outline"
                          className={
                            isDarkTheme
                              ? "ml-1 bg-green-500/10 text-green-400 border-green-500/30"
                              : "ml-1 bg-green-100 text-green-700 border-green-200"
                          }
                        >
                          Safe
                        </Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="flagged-filter"
                        checked={filters.showFlagged}
                        onCheckedChange={() => toggleFilter("showFlagged")}
                        className="data-[state=checked]:bg-yellow-500"
                      />
                      <Label htmlFor="flagged-filter" className={colors.textPrimary}>
                        Flagged{" "}
                        <Badge
                          variant="outline"
                          className={
                            isDarkTheme
                              ? "ml-1 bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                              : "ml-1 bg-yellow-100 text-yellow-700 border-yellow-200"
                          }
                        >
                          Warning
                        </Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="blocked-filter"
                        checked={filters.showBlocked}
                        onCheckedChange={() => toggleFilter("showBlocked")}
                        className="data-[state=checked]:bg-red-500"
                      />
                      <Label htmlFor="blocked-filter" className={colors.textPrimary}>
                        Blocked{" "}
                        <Badge
                          variant="outline"
                          className={
                            isDarkTheme
                              ? "ml-1 bg-red-500/10 text-red-400 border-red-500/30"
                              : "ml-1 bg-red-100 text-red-700 border-red-200"
                          }
                        >
                          Harmful
                        </Badge>
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="trending" onValueChange={setActiveTab} className="w-full">
            <TabsList
              className={`grid w-full grid-cols-3 ${isDarkTheme ? "bg-white/5" : "bg-gray-100"} ${colors.backdropBlur}`}
            >
              <TabsTrigger
                value="trending"
                className={
                  isDarkTheme
                    ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    : "data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                }
              >
                Trending
              </TabsTrigger>
              <TabsTrigger
                value="latest"
                className={
                  isDarkTheme
                    ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    : "data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                }
              >
                Latest
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className={
                  isDarkTheme
                    ? "data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    : "data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                }
              >
                Photos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="mt-6">
              {loading || isRefreshing ? renderLoadingState() : renderPosts()}
            </TabsContent>

            <TabsContent value="latest" className="mt-6">
              {loading || isRefreshing ? renderLoadingState() : renderPosts()}
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              {loading || isRefreshing ? renderLoadingState() : renderPosts()}
            </TabsContent>
          </Tabs>

          {/* Debug information - remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div
              className={`mt-8 p-4 ${isDarkTheme ? "bg-black/50 text-white/70" : "bg-gray-100 text-gray-700"} rounded-lg text-xs`}
            >
              <h4 className="font-bold mb-2">Debug Info:</h4>
              <p>Loading: {loading ? "true" : "false"}</p>
              <p>Refreshing: {isRefreshing ? "true" : "false"}</p>
              <p>Posts count: {Array.isArray(posts) ? posts.length : "N/A"}</p>
              <p>Filtered posts count: {Array.isArray(filteredPosts) ? filteredPosts.length : "N/A"}</p>
              <p>Active tab: {activeTab}</p>
              <p>
                Filters: Clean: {filters.showClean ? "✓" : "✗"}, Flagged: {filters.showFlagged ? "✓" : "✗"}, Blocked:{" "}
                {filters.showBlocked ? "✓" : "✗"}
              </p>
              <p>Search query: {searchQuery || "None"}</p>
              <p>Pathname: {pathname}</p>
              <p>Force render count: {forceRender.current}</p>
              <p>Theme: {isDarkTheme ? "Dark" : "Light"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
