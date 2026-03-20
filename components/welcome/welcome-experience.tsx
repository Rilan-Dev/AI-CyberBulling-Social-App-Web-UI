"use client"

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Shield, Brain, MessageSquare, Code, ChevronRight, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export function WelcomeExperience() {
  const [currentStep, setCurrentStep] = useState(0)
  const [animationComplete, setAnimationComplete] = useState(false)
  const router = useRouter()

  const steps = [
    {
      title: "Welcome to Cyberbullying Prediction AI",
      description:
        "An advanced platform using NLP and Recurrent Neural Networks to detect and prevent cyberbullying across digital communications.",
      icon: Shield,
      color: "bg-blue-500",
    },
    {
      title: "Our Mission",
      description:
        "To create safer online environments by identifying harmful behavior patterns in text and images before they cause damage, supporting timely interventions.",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "How It Works",
      description:
        "Our system analyzes text using Natural Language Processing and deep learning to detect subtle patterns of cyberbullying that traditional methods might miss.",
      icon: Brain,
      color: "bg-purple-500",
    },
    {
      title: "Key Features",
      description:
        "Text analysis, image content moderation, real-time detection, and comprehensive reporting to help create safer digital spaces.",
      icon: MessageSquare,
      color: "bg-orange-500",
    },
    {
      title: "Technology Stack",
      description:
        "Built with cutting-edge technologies including NLP, RNNs, LSTM networks, and modern web frameworks.",
      icon: Code,
      color: "bg-teal-500",
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-2">CyberSocial</h1>
        <p className="text-muted-foreground">Next-Gen Cyberbullying Prediction with NLP and RNNs</p>
      </motion.div>

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl"
      >
        <Card className="border-none shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className={`${steps[currentStep].color} p-4 rounded-full text-white`}>
                {React.createElement(steps[currentStep].icon, { size: 32 })}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                <p className="text-muted-foreground text-lg">{steps[currentStep].description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex justify-between items-center w-full max-w-3xl mt-8">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>

        <div className="flex space-x-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${currentStep === index ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? "Get Started" : "Next"} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {animationComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground">
            A project by Latha S, Nandhini S, and Raafiya Tabassum Z
            <br />
            Under the guidance of Mrs. P. Chandini, M.Tech(DCS)
          </p>
        </motion.div>
      )}
    </div>
  )
}
