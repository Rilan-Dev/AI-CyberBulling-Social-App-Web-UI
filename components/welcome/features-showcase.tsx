"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { MessageSquare, ImageIcon as Image, Clock, BarChart, Shield } from "lucide-react"

export function FeaturesShowcase() {
  const features = [
    {
      title: "Text Analysis",
      description: "Advanced NLP techniques to detect harmful patterns in text communications across platforms.",
      icon: MessageSquare,
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-700 dark:text-blue-300",
    },
    {
      title: "Image Moderation",
      description: "CNN-based analysis to identify inappropriate or harmful visual content in memes and images.",
      icon: Image,
      color: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-700 dark:text-purple-300",
    },
    {
      title: "Real-time Detection",
      description: "Instant analysis and alerts for potentially harmful content as it's being created.",
      icon: Clock,
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-700 dark:text-green-300",
    },
    {
      title: "Comprehensive Reporting",
      description: "Detailed insights and analytics on detected patterns and trends in cyberbullying incidents.",
      icon: BarChart,
      color: "bg-orange-100 dark:bg-orange-900",
      textColor: "text-orange-700 dark:text-orange-300",
    },
    {
      title: "Proactive Protection",
      description: "Intervention suggestions and preventive measures to address potential cyberbullying.",
      icon: Shield,
      color: "bg-teal-100 dark:bg-teal-900",
      textColor: "text-teal-700 dark:text-teal-300",
    },
  ]

  return (
    <div className="py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Key Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our platform offers comprehensive tools to detect and prevent cyberbullying across digital communications.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full mb-4 ${feature.color}`}>
                      <feature.icon className={feature.textColor} size={24} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
