"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { useTheme } from "next-themes"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  delay?: number
}

export function FeatureCard({ icon: Icon, title, description, color, delay = 0 }: FeatureCardProps) {
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === "dark" || resolvedTheme === "dark"

  const colorMap: Record<string, { dark: string; light: string }> = {
    blue: {
      dark: "bg-blue-900/20 border-blue-800 text-blue-400",
      light: "bg-blue-100 border-blue-200 text-blue-600",
    },
    purple: {
      dark: "bg-purple-900/20 border-purple-800 text-purple-400",
      light: "bg-purple-100 border-purple-200 text-purple-600",
    },
    green: {
      dark: "bg-green-900/20 border-green-800 text-green-400",
      light: "bg-green-100 border-green-200 text-green-600",
    },
    yellow: {
      dark: "bg-yellow-900/20 border-yellow-800 text-yellow-400",
      light: "bg-yellow-100 border-yellow-200 text-yellow-600",
    },
    red: {
      dark: "bg-red-900/20 border-red-800 text-red-400",
      light: "bg-red-100 border-red-200 text-red-600",
    },
    teal: {
      dark: "bg-teal-900/20 border-teal-800 text-teal-400",
      light: "bg-teal-100 border-teal-200 text-teal-600",
    },
  }

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card
        className={`transition-all duration-300 hover:shadow-lg h-full ${
          isDark
            ? "bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:shadow-blue-900/10"
            : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-blue-500/10"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div
            className={`p-3 rounded-full w-fit mb-4 transition-colors duration-300 ${
              isDark ? colorMap[color].dark : colorMap[color].light
            }`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <h3
            className={`text-xl font-semibold mb-2 transition-colors duration-300 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
          <p className={`transition-colors duration-300 flex-grow ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
