"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle, Heart, Users, Lightbulb } from "lucide-react"

export function ProjectMotivation() {
  const motivations = [
    {
      title: "Addressing a Growing Problem",
      description:
        "Cyberbullying remains a pervasive issue in online communities, necessitating effective predictive models to identify and mitigate harmful behavior.",
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      title: "Creating Safer Digital Spaces",
      description:
        "Our goal is to foster safer online environments by providing tools that can detect potential cyberbullying incidents before they cause harm.",
      icon: Shield,
      color: "text-blue-500",
    },
    {
      title: "Supporting Mental Health",
      description:
        "By identifying harmful content early, we aim to reduce the negative psychological impact of cyberbullying on vulnerable individuals.",
      icon: Heart,
      color: "text-pink-500",
    },
    {
      title: "Empowering Communities",
      description:
        "We believe in giving communities the tools they need to self-moderate and create positive digital interactions.",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Advancing AI for Social Good",
      description:
        "This project demonstrates how advanced AI techniques can be applied to address important social challenges.",
      icon: Lightbulb,
      color: "text-yellow-500",
    },
  ]

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Why We Built This</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our project is driven by a commitment to making online spaces safer for everyone.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {motivations.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`mb-4 ${item.color}`}>
                      <item.icon size={36} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
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
