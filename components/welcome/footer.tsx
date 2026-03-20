"use client"

import { Shield } from "lucide-react"
import { useTheme } from "next-themes"

export function Footer() {
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === "dark" || resolvedTheme === "dark"

  return (
    <footer
      className={`transition-colors duration-300 ${
        isDark ? "bg-gray-900 border-t border-gray-800" : "bg-gray-100 border-t border-gray-200"
      } py-8 px-4`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield
              className={`h-6 w-6 transition-colors duration-300 ${isDark ? "text-blue-400" : "text-blue-600"}`}
            />
            <span
              className={`font-bold text-lg transition-colors duration-300 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              CyberGuard AI
            </span>
          </div>

          <div
            className={`text-center md:text-right text-sm transition-colors duration-300 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <p>© {new Date().getFullYear()} Cyberbullying Prediction AI</p>
            <p>Raak College of Engineering and Technology</p>
            <p>Puducherry - 605110</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
