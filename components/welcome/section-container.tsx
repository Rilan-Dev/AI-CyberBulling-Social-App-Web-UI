"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useTheme } from "next-themes"

interface SectionContainerProps {
  id: string
  title: string
  subtitle: string
  children: React.ReactNode
  className?: string
}

export function SectionContainer({ id, title, subtitle, children, className = "" }: SectionContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === "dark" || resolvedTheme === "dark"

  return (
    <section id={id} className={`py-20 px-4 transition-colors duration-300 ${className}`} ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-xl transition-colors duration-300 ${
              isDark ? "text-gray-300" : "text-gray-600"
            } max-w-3xl mx-auto`}
          >
            {subtitle}
          </p>
        </div>
        {children}
      </motion.div>
    </section>
  )
}
