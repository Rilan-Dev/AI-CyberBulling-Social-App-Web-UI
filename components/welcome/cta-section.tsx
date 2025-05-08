"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

interface CTASectionProps {
  onGetStarted: () => void
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === "dark" || resolvedTheme === "dark"

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div
        className={`absolute inset-0 transition-colors duration-500 ${
          isDark
            ? "bg-gradient-to-r from-blue-900 to-indigo-900 opacity-80"
            : "bg-gradient-to-r from-blue-500 to-indigo-500 opacity-70"
        }`}
      ></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: isDark
            ? "radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
        }}
      ></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Ready to Experience the Future of Online Safety?
        </h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Join us in creating safer digital spaces with our advanced cyberbullying prediction technology.
        </p>
        <Button
          size="lg"
          onClick={onGetStarted}
          className={`transition-colors duration-300 ${
            isDark ? "bg-white text-blue-900 hover:bg-blue-50" : "bg-blue-900 text-white hover:bg-blue-800"
          }`}
        >
          Get Started Now
        </Button>
      </motion.div>
    </section>
  )
}
