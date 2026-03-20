"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function UserNav() {
  const { userProfile, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!userProfile) {
    return null
  }

  const displayName =
    userProfile.user.firstName && userProfile.user.lastName
      ? `${userProfile.user.firstName} ${userProfile.user.lastName}`
      : userProfile.user.username

  const avatarUrl = userProfile.profile_picture || "/placeholder.svg?height=40&width=40"

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          className={`relative h-9 pl-2 pr-3 rounded-full ${
            isDark
              ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-700/70"
              : "bg-gray-100/70 backdrop-blur-sm border border-gray-200 hover:bg-gray-200/70"
          } transition-all duration-200`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <Avatar className="h-7 w-7 mr-2 ring-2 ring-blue-500/30">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
            <AvatarFallback className="bg-blue-600 text-white">{displayName?.charAt(0) ?? ""}</AvatarFallback>
          </Avatar>
          <span
            className={`text-sm font-medium ${
              isDark ? "text-gray-200" : "text-gray-700"
            } hidden sm:inline-block max-w-[100px] truncate`}
          >
            {displayName}
          </span>
          <ChevronDown
            className={`h-4 w-4 ${isDark ? "text-gray-400" : "text-gray-500"} ml-1 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 right-0 mt-2 w-56 overflow-hidden rounded-xl border shadow-lg",
              isDark
                ? "bg-gray-800/90 backdrop-blur-md border-gray-700 shadow-blue-900/10"
                : "bg-white/90 backdrop-blur-md border-gray-200 shadow-gray-200/50",
            )}
          >
            <div className="px-3 py-2 font-normal">
              <div className="flex flex-col space-y-1">
                <p className={`text-sm font-medium leading-none ${isDark ? "text-white" : "text-gray-900"}`}>
                  {displayName}
                </p>
                <p className="text-xs leading-none text-blue-400">@{userProfile.user.username}</p>
              </div>
            </div>
            <div className={`h-px my-1 -mx-1 ${isDark ? "bg-gray-700/70" : "bg-gray-200"}`}></div>
            <div className="p-1">
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                  href={`/profile/${userProfile.user.username}`}
                  className={cn(
                    "flex items-center w-full rounded-md px-2 py-1.5 text-sm",
                    isDark ? "text-gray-200 hover:bg-gray-700/50" : "text-gray-700 hover:bg-gray-100",
                    "transition-colors duration-150",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="mr-2 h-4 w-4 text-blue-400" />
                  <span>Profile</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link
                  href="/settings"
                  className={cn(
                    "flex items-center w-full rounded-md px-2 py-1.5 text-sm",
                    isDark ? "text-gray-200 hover:bg-gray-700/50" : "text-gray-700 hover:bg-gray-100",
                    "transition-colors duration-150",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="mr-2 h-4 w-4 text-blue-400" />
                  <span>Settings</span>
                </Link>
              </motion.div>
            </div>
            <div className={`h-px my-1 -mx-1 ${isDark ? "bg-gray-700/70" : "bg-gray-200"}`}></div>
            <div className="p-1">
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    logout()
                  }}
                  className={cn(
                    "flex items-center w-full rounded-md px-2 py-1.5 text-sm",
                    isDark ? "text-gray-200 hover:bg-gray-700/50" : "text-gray-700 hover:bg-gray-100",
                    "transition-colors duration-150",
                  )}
                >
                  <LogOut className="mr-2 h-4 w-4 text-blue-400" />
                  <span>Log out</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
