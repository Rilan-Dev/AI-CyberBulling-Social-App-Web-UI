"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { LogIn, PlusIcon, UserIcon } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export function AuthStatus() {
  const { isAuthenticated, loading, userProfile } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-[80px] rounded-full" />
      </div>
    )
  }

  // In development, always show authenticated UI
  const showAuthenticatedUI = process.env.NODE_ENV === "development" || isAuthenticated

  if (showAuthenticatedUI) {
    return (
      <>
        {userProfile && (
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="outline"
                size="icon"
                asChild
                className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-700/70 hover:border-blue-500/50 text-gray-200"
              >
                <Link href={`/profile/${userProfile?.user.username}`}>
                  <UserIcon className="h-4 w-4 text-blue-400" />
                  <span className="sr-only">Profile</span>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button
                variant="outline"
                size="icon"
                asChild
                className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-700/70 hover:border-blue-500/50 text-gray-200"
              >
                <Link href="/create-post">
                  <PlusIcon className="h-4 w-4 text-blue-400" />
                  <span className="sr-only">Create post</span>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <UserNav />
            </motion.div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="outline"
          asChild
          className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:bg-gray-700/70 hover:border-blue-500/50 text-gray-200"
        >
          <Link href="/login">
            <LogIn className="h-4 w-4 mr-2 text-blue-400" />
            Login
          </Link>
        </Button>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          asChild
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-900/20"
        >
          <Link href="/register">Register</Link>
        </Button>
      </motion.div>
    </div>
  )
}
