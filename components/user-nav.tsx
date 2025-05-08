"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CustomDropdown, CustomDropdownItem } from "@/components/ui/custom-dropdown"
import { LogOut, Settings, User, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

export function UserNav() {
  const { userProfile, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  if (!userProfile) {
    return null
  }

  const displayName =
    userProfile.user.firstName && userProfile.user.lastName
      ? `${userProfile.user.firstName} ${userProfile.user.lastName}`
      : userProfile.user.username

  const avatarUrl = userProfile.profile_picture || "/placeholder.svg?height=40&width=40"

  return (
    <CustomDropdown
      trigger={
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            className={`relative h-9 pl-2 pr-3 rounded-full ${
              isDark
                ? "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-700/70"
                : "bg-gray-100/70 backdrop-blur-sm border border-gray-200 hover:bg-gray-200/70"
            } transition-all duration-200`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Avatar className="h-7 w-7 mr-2 ring-2 ring-blue-500/30">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="bg-blue-600 text-white">{displayName?.charAt(0) ?? ""}</AvatarFallback>
            </Avatar>
            <span
              className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-700"} hidden sm:inline-block max-w-[100px] truncate`}
            >
              {displayName}
            </span>
            <ChevronDown className={`h-4 w-4 ${isDark ? "text-gray-400" : "text-gray-500"} ml-1`} />
          </Button>
        </motion.div>
      }
      align="right"
      className={`w-56 ${
        isDark
          ? "bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-xl shadow-blue-900/10"
          : "bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg shadow-gray-200/50"
      } rounded-xl overflow-hidden`}
      // onOpenChange={setIsOpen}
      // open={isOpen}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
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
            <div>
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <CustomDropdownItem className={isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-100"}>
                  <Link
                    href={`/profile/${userProfile.user.username}`}
                    className={`flex items-center w-full ${isDark ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <User className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Profile</span>
                  </Link>
                </CustomDropdownItem>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <CustomDropdownItem className={isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-100"}>
                  <Link
                    href="/settings"
                    className={`flex items-center w-full ${isDark ? "text-gray-200" : "text-gray-700"}`}
                  >
                    <Settings className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Settings</span>
                  </Link>
                </CustomDropdownItem>
              </motion.div>
            </div>
            <div className={`h-px my-1 -mx-1 ${isDark ? "bg-gray-700/70" : "bg-gray-200"}`}></div>
            <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <CustomDropdownItem onClick={logout} className={isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-100"}>
                <div className={`flex items-center w-full ${isDark ? "text-gray-200" : "text-gray-700"}`}>
                  <LogOut className="mr-2 h-4 w-4 text-blue-400" />
                  <span>Log out</span>
                </div>
              </CustomDropdownItem>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </CustomDropdown>
  )
}
