"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-blue-900/10">
        <div className="p-6 text-center">
          <div className="w-20 h-20 bg-blue-900/30 border-2 border-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-bold text-blue-400">
              {name.split(" ")[0][0]}
              {name.split(" ")[1][0]}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-1">{name}</h3>
          <p className="text-blue-400 text-sm mb-2">{id}</p>
          <p className="text-gray-400 text-sm mb-4">{role}</p>
          <Badge variant="outline" className="bg-blue-900/20 border-blue-800 text-blue-300">
            {contribution}
          </Badge>
        </div>
      </Card>
    </motion.div>
  )
}
