"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

interface TeamMemberProps {
  name: string
  id: string
  role: string
  contribution: string
  delay?: number
}

export function TeamMember({ name, id, role, contribution, delay = 0 }: TeamMemberProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === "dark" || resolvedTheme === "dark"

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card
        className={`transition-all duration-300 hover:shadow-lg ${
          isDark
            ? "bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:shadow-blue-900/10"
            : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-blue-500/10"
        }`}
      >
        <div className="p-6 text-center">
          <div
            className={`w-20 h-20 transition-colors duration-300 ${
              isDark ? "bg-blue-900/30 border-2 border-blue-800" : "bg-blue-100 border-2 border-blue-200"
            } rounded-full flex items-center justify-center mx-auto mb-4`}
          >
            <span
              className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? "text-blue-400" : "text-blue-600"
              }`}
            >
              {name.split(" ")[0][0]}
              {name.split(" ")[1][0]}
            </span>
          </div>
          <h3
            className={`text-xl font-semibold mb-1 transition-colors duration-300 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {name}
          </h3>
          <p className={`transition-colors duration-300 ${isDark ? "text-blue-400" : "text-blue-600"} text-sm mb-2`}>
            {id}
          </p>
          <p className={`transition-colors duration-300 ${isDark ? "text-gray-400" : "text-gray-600"} text-sm mb-4`}>
            {role}
          </p>
          <Badge
            variant="outline"
            className={`transition-colors duration-300 ${
              isDark ? "bg-blue-900/20 border-blue-800 text-blue-300" : "bg-blue-100 border-blue-200 text-blue-700"
            }`}
          >
            {contribution}
          </Badge>
        </div>
      </Card>
    </motion.div>
  )
}
