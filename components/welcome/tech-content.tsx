"use client"

import { CheckCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useTheme } from "next-themes"

interface TechContentProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  color: string
}

export function TechContent({ icon: Icon, title, description, features, color }: TechContentProps) {
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === "dark" || resolvedTheme === "dark"

  const colorMap: Record<string, { dark: string; light: string }> = {
    blue: {
      dark: "bg-blue-900/20 text-blue-400",
      light: "bg-blue-100 text-blue-600",
    },
    purple: {
      dark: "bg-purple-900/20 text-purple-400",
      light: "bg-purple-100 text-purple-600",
    },
    green: {
      dark: "bg-green-900/20 text-green-400",
      light: "bg-green-100 text-green-600",
    },
    yellow: {
      dark: "bg-yellow-900/20 text-yellow-400",
      light: "bg-yellow-100 text-yellow-600",
    },
    teal: {
      dark: "bg-teal-900/20 text-teal-400",
      light: "bg-teal-100 text-teal-600",
    },
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div
          className={`p-4 rounded-lg transition-colors duration-300 ${
            isDark ? colorMap[color].dark : colorMap[color].light
          } mb-4 w-fit`}
        >
          <Icon className="h-8 w-8" />
        </div>
        <h3
          className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h3>
        <p className={`transition-colors duration-300 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{description}</p>
      </div>
      <div className="md:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
