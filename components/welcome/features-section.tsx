"use client"

import { MessageSquare, ImageIcon, Zap, BarChart, Lock, Users } from "lucide-react"
import { FeatureCard } from "./feature-card"

export function FeaturesSection() {
  const features = [
    {
      icon: MessageSquare,
      title: "Text Analysis",
      description: "Advanced NLP techniques to detect harmful patterns in text communications across platforms.",
      color: "blue",
    },
    {
      icon: ImageIcon,
      title: "Image Moderation",
      description: "CNN-based analysis to identify inappropriate or harmful visual content in memes and images.",
      color: "purple",
    },
    {
      icon: Zap,
      title: "Real-time Detection",
      description: "Instant analysis and alerts for potentially harmful content as it's being created.",
      color: "yellow",
    },
    {
      icon: BarChart,
      title: "Comprehensive Reporting",
      description: "Detailed insights and analytics on detected patterns and trends in cyberbullying incidents.",
      color: "green",
    },
    {
      icon: Lock,
      title: "Privacy-Focused",
      description: "Secure processing that respects user privacy while maintaining effective protection.",
      color: "red",
    },
    {
      icon: Users,
      title: "Community Protection",
      description: "Tools for moderators and community managers to maintain healthy online spaces.",
      color: "teal",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
      {features.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
          color={feature.color}
          delay={index}
        />
      ))}
    </div>
  )
}
