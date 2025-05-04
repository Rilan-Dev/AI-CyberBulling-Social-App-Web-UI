"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Database, BarChart, Server, Layers } from "lucide-react"

export function TechnologyShowcase() {
  const [activeTab, setActiveTab] = useState("nlp")

  const technologies = {
    nlp: {
      title: "Natural Language Processing",
      description:
        "Our system uses advanced NLP techniques to understand the context and nuances of language in online communications.",
      icon: Brain,
      details: [
        "Tokenization and Part-of-Speech Tagging",
        "Named Entity Recognition",
        "Semantic Analysis",
        "Sentiment Analysis",
        "Context-aware text processing",
      ],
      color: "bg-blue-500",
    },
    rnn: {
      title: "Recurrent Neural Networks",
      description:
        "RNNs help our system capture sequential patterns in text data, essential for understanding the flow of conversation.",
      icon: Layers,
      details: [
        "Sequential data processing",
        "Temporal pattern recognition",
        "Bidirectional information flow",
        "Context retention across text",
        "Dynamic memory management",
      ],
      color: "bg-purple-500",
    },
    lstm: {
      title: "Long Short-Term Memory",
      description: "LSTM networks enhance our ability to remember important information over long sequences of text.",
      icon: Database,
      details: [
        "Long-term dependency learning",
        "Forget gate for irrelevant information",
        "Input gate for new information",
        "Output gate for prediction generation",
        "Memory cell for information persistence",
      ],
      color: "bg-green-500",
    },
    lenet: {
      title: "LeNet Architecture",
      description:
        "For image-based cyberbullying detection, we employ the LeNet architecture to analyze visual content.",
      icon: BarChart,
      details: [
        "Convolutional neural network design",
        "Feature extraction from images",
        "Pattern recognition in visual content",
        "Multi-layer processing",
        "Classification of harmful imagery",
      ],
      color: "bg-orange-500",
    },
    stack: {
      title: "Technology Stack",
      description: "Our application is built with modern frameworks and tools for optimal performance and scalability.",
      icon: Server,
      details: [
        "Python for backend processing",
        "Django for API development",
        "Next.js for frontend interface",
        "TensorFlow and PyTorch for ML models",
        "React for interactive UI components",
      ],
      color: "bg-teal-500",
    },
  }

  return (
    <div className="py-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Technologies Powering Our Platform</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our cyberbullying prediction system leverages cutting-edge technologies to deliver accurate and timely
          detection.
        </p>
      </div>

      <Tabs defaultValue="nlp" className="max-w-4xl mx-auto" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="nlp">NLP</TabsTrigger>
          <TabsTrigger value="rnn">RNN</TabsTrigger>
          <TabsTrigger value="lstm">LSTM</TabsTrigger>
          <TabsTrigger value="lenet">LeNet</TabsTrigger>
          <TabsTrigger value="stack">Stack</TabsTrigger>
        </TabsList>

        {Object.entries(technologies).map(([key, tech]) => (
          <TabsContent key={key} value={key} className="mt-0">
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className={`${tech.color} p-3 rounded-full text-white`}>
                    <tech.icon size={24} />
                  </div>
                  <div>
                    <CardTitle>{tech.title}</CardTitle>
                    <CardDescription className="mt-1">{tech.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tech.details.map((detail, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${tech.color}`}></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
