"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CustomDropdown, CustomDropdownItem } from "@/components/ui/custom-dropdown"
import { LogOut, Settings, User, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { motion, AnimatePresence } from "framer-motion"

export function UserNav() {
  const { userProfile, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

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
            className="relative h-9 pl-2 pr-3 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:bg-gray-700/70 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Avatar className="h-7 w-7 mr-2 ring-2 ring-blue-500/30">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="bg-blue-600 text-white">{displayName?.charAt(0) ?? ""}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-200 hidden sm:inline-block max-w-[100px] truncate">
              {displayName}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400 ml-1" />
          </Button>
        </motion.div>
      }
      align="right"
      className="w-56 bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-xl shadow-blue-900/10 rounded-xl overflow-hidden"
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
                <p className="text-sm font-medium leading-none text-white">{displayName}</p>
                <p className="text-xs leading-none text-blue-400">@{userProfile.user.username}</p>
              </div>
            </div>
            <div className="h-px my-1 -mx-1 bg-gray-700/70"></div>
            <div>
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <CustomDropdownItem className="hover:bg-gray-700/50">
                  <Link
                    href={`/profile/${userProfile.user.username}`}
                    className="flex items-center w-full text-gray-200"
                  >
                    <User className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Profile</span>
                  </Link>
                </CustomDropdownItem>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                <CustomDropdownItem className="hover:bg-gray-700/50">
                  <Link href="/settings" className="flex items-center w-full text-gray-200">
                    <Settings className="mr-2 h-4 w-4 text-blue-400" />
                    <span>Settings</span>
                  </Link>
                </CustomDropdownItem>
              </motion.div>
            </div>
            <div className="h-px my-1 -mx-1 bg-gray-700/70"></div>
            <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
              <CustomDropdownItem onClick={logout} className="hover:bg-gray-700/50">
                <div className="flex items-center w-full text-gray-200">
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
