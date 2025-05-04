"use client"

import { Button } from "@/components/ui/button"

interface CTASectionProps {
  onGetStarted: () => void
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-80"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
        }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience the Future of Online Safety?</h2>
        <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
          Join us in creating safer digital spaces with our advanced cyberbullying prediction technology.
        </p>
        <Button size="lg" onClick={onGetStarted} className="bg-white text-blue-900 hover:bg-blue-50">
          Get Started Now
        </Button>
      </div>
    </section>
  )
}
