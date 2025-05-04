"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { PostFeed } from "@/components/post-feed"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { PlusCircle, TrendingUp, Clock, Filter } from 'lucide-react'
import Link from "next/link"

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string>("latest")
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <ProtectedRoute>
      <main className="min-h-screen relative bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,100,255,0.1),transparent_70%)]"></div>
          {/* Animated grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
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
                  <Filter className="h-5 w-5 text-blue-400" />
                  <h2 className="text-xl font-semibold">Your Feed</h2>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.div 
                    className="bg-gray-800/70 backdrop-blur-sm rounded-full p-1 flex"
                    whileHover={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)" }}
                  >
                    {filters.map((filter, index) => (
                      <motion.div key={filter.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + index * 0.1 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedFilter(filter.id)}
                          className={`rounded-full px-4 transition-all duration-300 ${
                            selectedFilter === filter.id
                              ? "bg-blue-600 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-700"
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
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 rounded-full shadow-lg shadow-blue-900/20"
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
                        className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 animate-pulse"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gray-700"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-700 rounded w-full"></div>
                          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                        </div>
                        <div className="mt-4 h-40 bg-gray-700 rounded"></div>
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
    </ProtectedRoute>
  )
}
