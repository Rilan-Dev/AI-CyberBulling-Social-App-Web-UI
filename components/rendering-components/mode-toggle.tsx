"use client"

import { Moon, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CustomDropdown, CustomDropdownItem } from "@/components/ui/custom-dropdown"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative overflow-hidden border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm"
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.2,
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      scale: 0.95,
      transition: { duration: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  const iconVariants = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 }
  }

  return (
    <CustomDropdown
      trigger={
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            variant="outline"
            size="icon"
            className={`
              relative overflow-hidden 
              ${currentTheme === 'dark' 
                ? 'border-gray-700 bg-gray-900/50 hover:bg-gray-800/70 hover:border-blue-500/50' 
                : 'border-gray-300 bg-white/90 hover:bg-gray-100/90 hover:border-blue-400/50'}
              backdrop-blur-sm transition-colors duration-300
            `}
          >
            <AnimatePresence mode="wait">
              {currentTheme === 'dark' ? (
                <motion.div
                  key="moon"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute"
                >
                  <Moon className="h-[1.2rem] w-[1.2rem] text-blue-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  variants={iconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* Glow effect */}
          <motion.div 
            className={`
              absolute inset-0 rounded-md -z-10 opacity-0 blur-md
              ${currentTheme === 'dark' ? 'bg-blue-500' : 'bg-yellow-400'}
            `}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      }
      align="right"
      className={`
        ${currentTheme === 'dark' 
          ? 'bg-gray-900/80 border-gray-800' 
          : 'bg-white/90 border-gray-200'} 
        backdrop-blur-md border shadow-lg
      `}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div variants={itemVariants}>
            <CustomDropdownItem
              onClick={() => setTheme("light")}
              className={`
                flex items-center gap-2 
                ${currentTheme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-black'}
                transition-colors duration-200
              `}
            >
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Sun className="h-4 w-4 text-yellow-400" />
              </motion.div>
              <span>Light</span>
              {theme === "light" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-2 w-2 rounded-full bg-blue-500"
                />
              )}
            </CustomDropdownItem>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CustomDropdownItem
              onClick={() => setTheme("dark")}
              className={`
                flex items-center gap-2 
                ${currentTheme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-black'}
                transition-colors duration-200
              `}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Moon className="h-4 w-4 text-blue-400" />
              </motion.div>
              <span>Dark</span>
              {theme === "dark" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto h-2 w-2 rounded-full bg-blue-500"
                />
              )}
            </CustomDropdownItem>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <CustomDropdownItem
              onClick={() => setTheme("system")}
              className={`
                flex items-center gap-2 
                ${currentTheme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-black'}
                transition-colors duration-200
              `}
            >
              <motion.div
                whileHover={{ y: [0, -2, 2, -2, 0] }}
                transition={{ duration: 0.5 }}
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
                  className={`h-4 w-4 ${currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-500'}`}
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </motion.div>
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
        </motion.div>
      </AnimatePresence>
    </CustomDropdown>
  )
}
