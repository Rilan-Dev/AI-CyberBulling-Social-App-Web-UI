"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Post } from "@/components/post"
import { usePosts } from "@/context/post-context"
import { Search, Filter } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Animation variants - using more subtle animations to prevent disappearing content
const containerVariants = {
  hidden: { opacity: 0.8 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0.8, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}

export default function ExplorePage() {
  const { posts, loading } = usePosts()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("trending")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    showClean: true,
    showFlagged: true,
    showBlocked: false,
  })
  const [initialized, setInitialized] = useState(false)

  // Initialize filtered posts with all posts when they first load
  useEffect(() => {
    if (!loading && posts.length > 0 && !initialized) {
      setFilteredPosts(posts)
      setInitialized(true)
    }
  }, [loading, posts, initialized])

  // Handle filtering when search or filters change
  useEffect(() => {
    if (!loading && posts.length > 0) {
      let filtered = [...posts]

      // Filter by search query
      if (searchQuery) {
        filtered = filtered.filter(
          (post) =>
            post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      } else if (activeTab === "photos") {
        filtered = filtered.filter((post) => post.image !== null && post.image !== undefined)
      }

      setFilteredPosts(filtered)
    }
  }, [loading, posts, searchQuery, activeTab, filters])

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

  // Safely check if we have posts to display
  const hasFilteredPosts = Array.isArray(filteredPosts) && filteredPosts.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] pointer-events-none" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Blue glow effect */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/30 rounded-full blur-3xl opacity-20" />

      <div className="container py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Explore
          </h1>

          <Card className="mb-6 border-0 bg-white/5 backdrop-blur-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search posts, users, or hashtags"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 transition-colors">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 transition-colors"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </form>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm font-medium mb-3 text-white/70">Filter by content status:</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="clean-filter"
                        checked={filters.showClean}
                        onCheckedChange={() => toggleFilter("showClean")}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Label htmlFor="clean-filter" className="text-white/90">
                        Clean{" "}
                        <Badge variant="outline" className="ml-1 bg-green-500/10 text-green-400 border-green-500/30">
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
                      <Label htmlFor="flagged-filter" className="text-white/90">
                        Flagged{" "}
                        <Badge variant="outline" className="ml-1 bg-yellow-500/10 text-yellow-400 border-yellow-500/30">
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
                      <Label htmlFor="blocked-filter" className="text-white/90">
                        Blocked{" "}
                        <Badge variant="outline" className="ml-1 bg-red-500/10 text-red-400 border-red-500/30">
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
            <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-sm">
              <TabsTrigger value="trending" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Trending
              </TabsTrigger>
              <TabsTrigger value="latest" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Latest
              </TabsTrigger>
              <TabsTrigger value="photos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                Photos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="mt-6">
              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full rounded-lg bg-white/5" />
                  ))}
                </div>
              ) : hasFilteredPosts ? (
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <div key={post.id}>
                      <Post post={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-lg">
                  <h3 className="font-medium text-white">No posts found</h3>
                  <p className="text-sm text-white/60 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="latest" className="mt-6">
              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full rounded-lg bg-white/5" />
                  ))}
                </div>
              ) : hasFilteredPosts ? (
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <div key={post.id}>
                      <Post post={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-lg">
                  <h3 className="font-medium text-white">No posts found</h3>
                  <p className="text-sm text-white/60 mt-1">Try adjusting your search or filters</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="photos" className="mt-6">
              {loading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[300px] w-full rounded-lg bg-white/5" />
                  ))}
                </div>
              ) : hasFilteredPosts ? (
                <div className="space-y-6">
                  {filteredPosts.map((post) => (
                    <div key={post.id}>
                      <Post post={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-lg">
                  <h3 className="font-medium text-white">No photo posts found</h3>
                  <p className="text-sm text-white/60 mt-1">Try adjusting your search</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
