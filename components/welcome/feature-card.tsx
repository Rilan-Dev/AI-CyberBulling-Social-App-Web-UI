"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
  delay?: number
}

export function FeatureCard({ icon: Icon, title, description, color, delay = 0 }: FeatureCardProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-900/20 border-blue-800 text-blue-400",
    purple: "bg-purple-900/20 border-purple-800 text-purple-400",
    green: "bg-green-900/20 border-green-800 text-green-400",
    yellow: "bg-yellow-900/20 border-yellow-800 text-yellow-400",
    red: "bg-red-900/20 border-red-800 text-red-400",
    teal: "bg-teal-900/20 border-teal-800 text-teal-400",
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
      <Card className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-blue-900/10 h-full">
        <div className="p-6 flex flex-col h-full">
          <div className={`p-3 rounded-full w-fit mb-4 ${colorMap[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-gray-400 flex-grow">{description}</p>
        </div>
      </Card>
    </motion.div>
  )
}
