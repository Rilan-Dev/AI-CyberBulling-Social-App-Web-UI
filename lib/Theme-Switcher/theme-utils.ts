import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeDetector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkTheme = mounted && (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches))
  
  return {
    theme,
    setTheme,
    isDarkTheme,
    mounted
  }
}

export const getThemeColors = (isDark: boolean) => {
  return {
    // Background colors
    bgPrimary: isDark ? "bg-gray-950" : "bg-gray-50",
    bgSecondary: isDark ? "bg-gray-900" : "bg-white",
    bgTertiary: isDark ? "bg-gray-800" : "bg-gray-100",
    
    // Text colors
    textPrimary: isDark ? "text-white" : "text-gray-900",
    textSecondary: isDark ? "text-gray-300" : "text-gray-700",
    textTertiary: isDark ? "text-gray-400" : "text-gray-500",
    
    // Border colors
    borderPrimary: isDark ? "border-gray-800" : "border-gray-200",
    borderSecondary: isDark ? "border-gray-700" : "border-gray-300",
    
    // Accent colors
    accentPrimary: "text-blue-600",
    accentSecondary: "text-blue-500",
    accentHover: isDark ? "hover:text-blue-400" : "hover:text-blue-700",
    
    // Button colors
    buttonPrimary: isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700",
    buttonSecondary: isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-200 hover:bg-gray-300",
    
    // Status colors
    success: isDark ? "text-green-400" : "text-green-600",
    warning: isDark ? "text-yellow-400" : "text-yellow-600",
    error: isDark ? "text-red-400" : "text-red-600",
    
    // Background gradients
    gradientPrimary: isDark 
      ? "bg-gradient-to-br from-gray-900 to-black" 
      : "bg-gradient-to-br from-gray-50 to-white",
    gradientAccent: isDark
      ? "bg-[radial-gradient(circle_at_center,rgba(0,100,255,0.1),transparent_70%)]"
      : "bg-[radial-gradient(circle_at_center,rgba(0,100,255,0.05),transparent_70%)]",
    
    // Card backgrounds
    cardBg: isDark ? "bg-gray-900/70" : "bg-white/90",
    cardBorder: isDark ? "border-gray-800" : "border-gray-200",
    
    // Input backgrounds
    inputBg: isDark ? "bg-gray-800/50" : "bg-gray-100/50",
    inputBorder: isDark ? "border-gray-700" : "border-gray-300",
    
    // Backdrop blur
    backdropBlur: "backdrop-blur-lg",
    
    // Grid overlay
    gridOverlay: isDark
      ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
      : "bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]"
  }
}
