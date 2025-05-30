"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Palette, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "../utils"
import { themes } from "./themes"

export function EnhancedThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Set mounted state to true after component mounts to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine if we're in dark mode
  const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark")

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      setTheme("default")
    } else {
      setTheme("dark")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed right-4 z-50 flex flex-col items-end gap-2">
      {/* Quick dark/light mode toggle */}
      <Button
        onClick={toggleDarkMode}
        className={cn(
          "rounded-full h-12 w-12 shadow-lg",
          isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-yellow-300" : "bg-blue-100 hover:bg-blue-200 text-blue-800",
        )}
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      {/* Theme selector button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "rounded-full h-12 w-12 shadow-lg",
          theme === "royal-blue" &&
            "bg-gradient-to-b from-[#0288d1] to-[#01579b] hover:from-[#039be5] hover:to-[#0277bd]",
          theme === "sky-blue-dark" &&
            "bg-gradient-to-br from-[#90CAF9] to-[#82B1FF] hover:from-[#82B1FF] hover:to-[#90CAF9]",
          theme !== "royal-blue" && theme !== "sky-blue-dark" && isDarkMode && "bg-gray-800 hover:bg-gray-700",
          theme !== "royal-blue" &&
            theme !== "sky-blue-dark" &&
            !isDarkMode &&
            "bg-white hover:bg-gray-100 border border-gray-200",
        )}
        aria-label="Open theme switcher"
      >
        <Palette
          className={cn(
            "h-5 w-5",
            theme !== "royal-blue" && theme !== "sky-blue-dark" && isDarkMode && "text-gray-200",
            theme !== "royal-blue" && theme !== "sky-blue-dark" && !isDarkMode && "text-gray-700",
          )}
        />
      </Button>

      {/* Theme selector panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-20 right-4 rounded-lg shadow-lg p-4 w-[280px] border",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
          )}
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className={cn("font-medium", isDarkMode ? "text-white" : "text-gray-900")}>Select Theme</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className={isDarkMode ? "text-gray-300 hover:text-white hover:bg-gray-700" : ""}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {themes.map((t) => {
              const isGradientTheme = t.id === "royal-blue" || t.id === "sky-blue-dark"
              const isActive = theme === t.id

              return (
                <button
                  key={t.id}
                  className={cn(
                    "flex flex-col items-center p-2 rounded border text-center text-xs hover:border-primary relative",
                    isActive && "border-primary",
                    isActive && isDarkMode && "border-blue-500 bg-gray-700/50",
                    isActive && !isDarkMode && "border-blue-500 bg-blue-50",
                    !isActive && isDarkMode && "border-gray-700 hover:border-gray-500",
                    isGradientTheme && "overflow-hidden",
                  )}
                  onClick={() => {
                    setTheme(t.id)
                  }}
                >
                  {isGradientTheme && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] px-1 rotate-12 translate-x-2 -translate-y-1 font-medium">
                      Gradient
                    </div>
                  )}
                  <div
                    className={cn(
                      "w-full h-12 rounded mb-1",
                      isGradientTheme && t.id === "royal-blue" && "bg-gradient-to-b from-[#0288d1] to-[#01579b]",
                      isGradientTheme && t.id === "sky-blue-dark" && "bg-gradient-to-br from-[#1c313a] to-[#0f2027]",
                      !isGradientTheme && { backgroundColor: t.backgroundPreview },
                    )}
                  >
                    {!isGradientTheme && (
                      <div className="w-full h-3 rounded-t" style={{ backgroundColor: t.primaryColor }}></div>
                    )}
                  </div>
                  <span className={cn("font-medium", isDarkMode ? "text-gray-200" : "text-gray-800")}>{t.name}</span>
                  {isActive && <Check className={cn("h-3 w-3 mt-1", isDarkMode ? "text-blue-400" : "text-blue-600")} />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
