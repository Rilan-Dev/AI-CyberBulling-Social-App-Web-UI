"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PostFeed } from "@/components/cyberbulling/post-feed"
import { ProtectedRoute } from "@/components/cyberbulling/protected-route"
import { Button } from "@/components/ui/button"
import { PlusCircle, TrendingUp, Clock, Filter } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useTheme } from "next-themes"

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string>("latest")
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const router = useRouter()

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = Cookies.get("visited")

    if (!hasVisited) {
      // Set the visited cookie
      Cookies.set("visited", "true", { expires: 365 })
      // Redirect to welcome page
      router.push("/welcome")
    }
  }, [router])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filters = [
    { id: "latest", label: "Latest", icon: Clock },
    { id: "trending", label: "Trending", icon: TrendingUp },
  ]

  // Only render the content after mounting to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
      <main
        className={`min-h-screen relative ${
          theme === "dark"
            ? "bg-gradient-to-b from-gray-900 to-black text-white"
            : "bg-gradient-to-b from-gray-50 to-white text-gray-900"
        }`}
      >
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className={`absolute inset-0 ${
              theme === "dark"
                ? "bg-[radial-gradient(circle_at_center,rgba(0,100,255,0.1),transparent_70%)]"
                : "bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)]"
            }`}
          ></div>
          {/* Animated grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                theme === "dark"
                  ? "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)"
                  : "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="container py-6 md:py-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-2">
                  <Filter className={`h-5 w-5 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                  <h2 className="text-xl font-semibold">Your Feed</h2>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.div
                    className={`backdrop-blur-sm rounded-full p-1 flex ${
                      theme === "dark" ? "bg-gray-800/70" : "bg-gray-200/70"
                    }`}
                    whileHover={{
                      boxShadow:
                        theme === "dark" ? "0 0 15px rgba(59, 130, 246, 0.3)" : "0 0 15px rgba(59, 130, 246, 0.2)",
                    }}
                  >
                    {filters.map((filter, index) => (
                      <motion.div
                        key={filter.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFilter(filter.id)}
                          className={`rounded-full px-4 transition-all duration-300 ${
                            selectedFilter === filter.id
                              ? theme === "dark"
                                ? "bg-blue-600 text-white"
                                : "bg-blue-500 text-white"
                              : theme === "dark"
                                ? "text-gray-400 hover:text-white hover:bg-gray-700"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-300"
                          }`}
                        >
                          <filter.icon className="h-4 w-4 mr-2" />
                          {filter.label}
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href="/create-post">
                      <Button
                        size="sm"
                        className={`text-white border-0 rounded-full ${
                          theme === "dark"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-900/20"
                            : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md shadow-blue-500/20"
                        }`}
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Post
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`backdrop-blur-sm rounded-xl p-4 animate-pulse ${
                          theme === "dark"
                            ? "bg-gray-800/50 border border-gray-700"
                            : "bg-gray-200/50 border border-gray-300"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`h-12 w-12 rounded-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
                          ></div>
                          <div className="space-y-2 flex-1">
                            <div
                              className={`h-4 rounded w-1/4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
                            ></div>
                            <div
                              className={`h-3 rounded w-1/3 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div
                            className={`h-4 rounded w-3/4 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
                          ></div>
                          <div
                            className={`h-4 rounded w-full ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
                          ></div>
                          <div
                            className={`h-4 rounded w-2/3 ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}
                          ></div>
                        </div>
                        <div className={`mt-4 h-40 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-300"}`}></div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10"
                  >
                    <PostFeed />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>
  )
}
