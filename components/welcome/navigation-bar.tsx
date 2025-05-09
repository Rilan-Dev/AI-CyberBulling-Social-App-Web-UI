"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Shield, Sun } from 'lucide-react'
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

interface NavigationItem {
  id: string
  label: string
}

interface NavigationBarProps {
  items: NavigationItem[]
  activeSection: string
  onSectionChange: (sectionId: string) => void
  onLogin: () => void
}

export function NavigationBar({ items, activeSection, onSectionChange, onLogin }: NavigationBarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Only render the content after mounting to avoid hydration mismatch
  if (!mounted) {
    return null
  }

  const currentTheme = theme === "system" 
    ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    : theme

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? theme === "dark"
            ? "bg-gray-900/90 backdrop-blur-md shadow-md"
            : "bg-white/90 backdrop-blur-md shadow-md"
          : "bg-transparent"
      } ${theme === "dark" ? "border-b border-gray-800/50" : "border-b border-gray-200/50"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Shield className={theme === "dark" ? "h-6 w-6 text-blue-400" : "h-6 w-6 text-blue-600"} />
            <span className="font-bold text-lg">CyberGuard AI</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? theme === "dark"
                      ? "text-blue-400"
                      : "text-blue-600"
                    : theme === "dark"
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`
                p-2 rounded-full transition-colors duration-200
                ${theme === "dark" 
                  ? "bg-gray-800 hover:bg-gray-700 text-blue-400" 
                  : "bg-gray-100 hover:bg-gray-200 text-blue-600"}
              `}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {currentTheme === "dark" ? (
                  <motion.div
                    key="moon"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <Button
              onClick={onLogin}
              className={
                theme === "dark" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
              }
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
