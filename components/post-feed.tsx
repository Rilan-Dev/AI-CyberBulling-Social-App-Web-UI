"use client"

import { usePosts } from "@/context/post-context"
import { Post } from "@/components/post"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCw, Filter, Grid, List } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
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

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

export function PostFeed() {
  const { posts, loading, refreshPosts } = usePosts()
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [showFilters, setShowFilters] = useState(false)
  const [statusFilter, setStatusFilter] = useState<"all" | "clean" | "flagged" | "blocked">("all")

  const handleRefresh = async () => {
    await refreshPosts()
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list")
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const filteredPosts = posts.filter((post) => {
    if (statusFilter === "all") return true
    return post.status === statusFilter
  })

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={fadeIn}>
      <motion.div className="flex justify-between items-center" variants={slideUp}>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Feed
        </h2>
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFilters}
              className="border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 hover:border-blue-500/50 text-gray-300"
            >
              <Filter className={`h-4 w-4 mr-2 ${showFilters ? "text-blue-400" : "text-gray-400"}`} />
              Filter
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleViewMode}
              className="border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 hover:border-blue-500/50 text-gray-300"
            >
              {viewMode === "list" ? (
                <Grid className="h-4 w-4 mr-2 text-gray-400" />
              ) : (
                <List className="h-4 w-4 mr-2 text-gray-400" />
              )}
              {viewMode === "list" ? "Grid" : "List"}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 hover:border-blue-500/50 text-gray-300"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin text-blue-400" : "text-gray-400"}`} />
              Refresh
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Filter by status</h3>
              <div className="flex flex-wrap gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge
                    onClick={() => setStatusFilter("all")}
                    className={`cursor-pointer ${
                      statusFilter === "all"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    All
                  </Badge>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge
                    onClick={() => setStatusFilter("clean")}
                    className={`cursor-pointer ${
                      statusFilter === "clean"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    Clean
                  </Badge>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge
                    onClick={() => setStatusFilter("flagged")}
                    className={`cursor-pointer ${
                      statusFilter === "flagged"
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    Flagged
                  </Badge>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Badge
                    onClick={() => setStatusFilter("blocked")}
                    className={`cursor-pointer ${
                      statusFilter === "blocked"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }`}
                  >
                    Blocked
                  </Badge>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        // Loading skeletons
        <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div key={i} variants={slideUp}>
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-sm">
                <div className="p-4 flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-800/70" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px] bg-gray-800/70" />
                    <Skeleton className="h-4 w-[100px] bg-gray-800/70" />
                  </div>
                </div>
                <Skeleton className="h-[300px] w-full bg-gray-800/50" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-full bg-gray-800/70" />
                  <Skeleton className="h-4 w-2/3 bg-gray-800/70" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : filteredPosts.length > 0 ? (
        viewMode === "list" ? (
          <motion.div className="space-y-6" variants={staggerContainer} initial="hidden" animate="visible">
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={slideUp}>
                <Post post={post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filteredPosts.map((post) => (
              <motion.div key={post.id} variants={slideUp}>
                <Post post={post}  />
              </motion.div>
            ))}
          </motion.div>
        )
      ) : (
        <motion.div
          className="text-center py-10 rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm"
          variants={fadeIn}
        >
          <p className="text-gray-400">
            {statusFilter !== "all" ? `No ${statusFilter} posts found.` : "No posts yet. Be the first to post!"}
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
