"use client";

import { usePosts } from "@/context/post-context";
import { Post } from "@/components/post";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Filter,
  Grid,
  List,
  Maximize2,
  Minimize2,
  X,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { createPortal } from "react-dom";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AnimatedBadge } from "./animated-ui/animated-badge";
import AnimatedWrapper from "./animated-ui/animated-wrapper";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export function PostFeed() {
  const { posts, loading, refreshPosts } = usePosts();
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "clean" | "flagged" | "blocked"
  >("all");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenViewMode, setFullScreenViewMode] = useState<"list" | "grid">(
    "grid"
  );
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  // Set up portal container for full-screen view
  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  // Handle escape key to exit full screen
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullScreen(false);
      }
    };

    if (isFullScreen) {
      window.addEventListener("keydown", handleEsc);
      // Prevent scrolling on the body when full-screen is active
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isFullScreen]);

  const handleRefresh = async () => {
    await refreshPosts();
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  const toggleFullScreenViewMode = () => {
    setFullScreenViewMode(fullScreenViewMode === "list" ? "grid" : "list");
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const filteredPosts = posts.filter((post) => {
    if (statusFilter === "all") return true;
    return post.status === statusFilter;
  });

  // Render the full-screen view in a portal
  const renderFullScreenView = () => {
    if (!isFullScreen || !portalContainer) return null;

    return createPortal(
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col"
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullScreen}
              className="mr-2 rounded-full hover:bg-gray-800/70 text-gray-300"
              aria-label="Back to normal view"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold text-white">Posts</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullScreenViewMode}
              className="border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 text-gray-300"
            >
              {fullScreenViewMode === "list" ? (
                <Grid className="h-4 w-4 mr-2 text-gray-400" />
              ) : (
                <List className="h-4 w-4 mr-2 text-gray-400" />
              )}
              {fullScreenViewMode === "list" ? "Grid" : "List"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullScreen}
              className="border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 text-gray-300"
            >
              <Minimize2 className="h-4 w-4 mr-2 text-gray-400" />
              Exit Full Screen
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullScreen}
              className="rounded-full hover:bg-gray-800/70 text-gray-300"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {fullScreenViewMode === "list" ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Post post={post} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <Post post={post} isCompact={true} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>,
      portalContainer
    );
  };

  return (
    <>
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div
          className="flex justify-between items-center"
          variants={slideUp}
        >
          <Label size="2xl" labelColor="transparent" className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Feed</Label>
          <div className="flex gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFilters}
                className="border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 hover:border-blue-500/50 text-gray-300"
              >
                <Filter
                  className={`h-4 w-4 mr-2 ${
                    showFilters ? "text-blue-400" : "text-gray-400"
                  }`}
                />
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
            {/* <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullScreen}
                className="border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 hover:border-blue-500/50 text-gray-300"
              >
                <Maximize2 className="h-4 w-4 mr-2 text-gray-400" />
                Full Screen
              </Button>
            </motion.div> */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 hover:border-blue-500/50 text-gray-300"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    loading ? "animate-spin text-blue-400" : "text-gray-400"
                  }`}
                />
                Refresh
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <AnimatedWrapper
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <Card className=" bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle size={"sm"} labelColor={"muted"}>
                    Filter by status
                  </CardTitle>
                </CardHeader>
                <CardContent direction="row" gap="1">
                  <AnimatedBadge
                    status="all"
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    label="All"
                    activeClass="bg-blue-600 hover:bg-blue-700"
                    inactiveClass="bg-gray-800 hover:bg-gray-700 text-gray-300"
                  />
                  <AnimatedBadge
                    status="clean"
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    label="Clean"
                    activeClass="bg-green-600 hover:bg-green-700"
                    inactiveClass="bg-gray-800 hover:bg-gray-700 text-gray-300"
                  />
                  <AnimatedBadge
                    status="flagged"
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    label="Flagged"
                    activeClass="bg-yellow-600 hover:bg-yellow-700"
                    inactiveClass="bg-gray-800 hover:bg-gray-700 text-gray-300"
                  />
                  <AnimatedBadge
                    status="blocked"
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    label="Blocked"
                    activeClass="bg-red-600 hover:bg-red-700"
                    inactiveClass="bg-gray-800 hover:bg-gray-700 text-gray-300"
                  />
                </CardContent>
              </Card>
            </AnimatedWrapper>
          )}
        </AnimatePresence>

        {!isFullScreen && (
          <>
            {loading ? (
              // Loading skeletons
              <motion.div
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
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
                <motion.div
                  className="space-y-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
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
                    <motion.div
                      key={post.id}
                      variants={slideUp}
                      className="h-full"
                    >
                      <Post post={post} isCompact={true} />
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
                  {statusFilter !== "all"
                    ? `No ${statusFilter} posts found.`
                    : "No posts yet. Be the first to post!"}
                </p>
              </motion.div>
            )}
          </>
        )}
      </motion.div>

      {/* Full Screen View - Rendered in Portal */}
      <AnimatePresence>{renderFullScreenView()}</AnimatePresence>
    </>
  );
}
