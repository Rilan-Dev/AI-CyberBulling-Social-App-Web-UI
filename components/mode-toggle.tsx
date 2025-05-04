"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CustomDropdown, CustomDropdownItem } from "@/components/ui/custom-dropdown"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <CustomDropdown
      trigger={
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="icon"
            className="relative overflow-hidden border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/70 hover:border-blue-500/50"
          >
            <motion.div
              initial={{ rotate: 0, scale: 1 }}
              animate={theme === "dark" ? { rotate: -90, scale: 0 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="absolute"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-300" />
            </motion.div>
            <motion.div
              initial={{ rotate: 90, scale: 0 }}
              animate={theme === "dark" ? { rotate: 0, scale: 1 } : { rotate: 90, scale: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="absolute"
            >
              <Moon className="h-[1.2rem] w-[1.2rem] text-blue-300" />
            </motion.div>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </motion.div>
      }
      align="right"
      className="bg-gray-900/80 backdrop-blur-md border border-gray-800"
    >
      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <CustomDropdownItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 text-gray-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800"
        >
          <Sun className="h-4 w-4 text-yellow-300" />
          <span>Light</span>
          {theme === "light" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-2 w-2 rounded-full bg-blue-500"
            />
          )}
        </CustomDropdownItem>
        <CustomDropdownItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 text-gray-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800"
        >
          <Moon className="h-4 w-4 text-blue-300" />
          <span>Dark</span>
          {theme === "dark" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-2 w-2 rounded-full bg-blue-500"
            />
          )}
        </CustomDropdownItem>
        <CustomDropdownItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 text-gray-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-purple-300"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <span>System</span>
          {theme === "system" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto h-2 w-2 rounded-full bg-blue-500"
            />
          )}
        </CustomDropdownItem>
      </motion.div>
    </CustomDropdown>
  )
}
