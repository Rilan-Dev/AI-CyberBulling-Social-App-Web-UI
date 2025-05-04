"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

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

  return (
    <section id={id} className={`py-20 px-4 ${className}`} ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </section>
  )
}
