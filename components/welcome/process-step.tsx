"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface ProcessStepProps {
  number: number
  title: string
  description: string
  icon: LucideIcon
}

export function ProcessStep({ number, title, description, icon: Icon }: ProcessStepProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
    >
      <div className={`md:text-right ${number % 2 === 0 ? "md:order-2" : ""}`}>
        <div className="flex items-center mb-4 md:justify-end">
          <div className="bg-blue-900/30 border border-blue-800 text-blue-400 rounded-full w-8 h-8 flex items-center justify-center mr-3 md:order-2 md:ml-3 md:mr-0">
            {number}
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-gray-400">{description}</p>
      </div>

      <div className={`flex ${number % 2 === 0 ? "justify-start" : "md:justify-end"}`}>
        <div className="relative">
          {/* Circle connector */}
          <div className="absolute left-1/2 top-1/2 w-12 h-12 bg-gray-900 border-4 border-blue-900 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block"></div>

          <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-6">
            <Icon className="h-12 w-12 text-blue-400 mx-auto" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
