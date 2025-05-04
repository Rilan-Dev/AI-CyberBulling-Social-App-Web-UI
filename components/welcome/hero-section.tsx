"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronDown } from "lucide-react"
import Typewriter from "typewriter-effect"

interface HeroSectionProps {
  onGetStarted: () => void
  onExploreFeatures: () => void
}

export function HeroSection({ onGetStarted, onExploreFeatures }: HeroSectionProps) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center px-4 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,100,255,0.1),transparent_70%)]"></div>
        {/* Animated grid background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <Badge variant="outline" className="mb-4 px-3 py-1 text-sm border-blue-400 text-blue-300">
          Next-Gen AI Technology
        </Badge>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Cyberbullying Prediction AI
        </h1>

        <div className="h-12 mb-6 text-xl md:text-2xl text-blue-200">
          <Typewriter
            options={{
              strings: [
                "Protecting digital spaces with AI",
                "Powered by NLP & Neural Networks",
                "Creating safer online communities",
                "Advanced text & image analysis",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>

        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          An advanced system combining Natural Language Processing and Recurrent Neural Networks to predict and prevent
          cyberbullying across digital platforms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
          >
            Get Started
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onExploreFeatures}
            className="border-blue-400 text-blue-300 hover:bg-blue-900/20"
          >
            Explore Features
          </Button>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: showScrollIndicator ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-sm text-blue-300 mb-2">Scroll to explore</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
          <ChevronDown className="h-6 w-6 text-blue-300" />
        </motion.div>
      </motion.div>
    </section>
  )
}
