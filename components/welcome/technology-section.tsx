"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Database, Layers, ImageIcon, Server } from "lucide-react"
import { TechContent } from "./tech-content"

export function TechnologySection() {
  const [activeTab, setActiveTab] = useState("nlp")

  const technologies = {
    nlp: {
      icon: Brain,
      title: "Natural Language Processing",
      description:
        "Our system uses advanced NLP techniques to understand the context and nuances of language in online communications.",
      features: [
        "Tokenization and Part-of-Speech Tagging",
        "Named Entity Recognition",
        "Semantic Analysis",
        "Sentiment Analysis",
        "Context-aware text processing",
      ],
      color: "blue",
    },
    rnn: {
      icon: Layers,
      title: "Recurrent Neural Networks",
      description:
        "RNNs help our system capture sequential patterns in text data, essential for understanding the flow of conversation.",
      features: [
        "Sequential data processing",
        "Temporal pattern recognition",
        "Bidirectional information flow",
        "Context retention across text",
        "Dynamic memory management",
      ],
      color: "purple",
    },
    lstm: {
      icon: Database,
      title: "Long Short-Term Memory",
      description: "LSTM networks enhance our ability to remember important information over long sequences of text.",
      features: [
        "Long-term dependency learning",
        "Forget gate for irrelevant information",
        "Input gate for new information",
        "Output gate for prediction generation",
        "Memory cell for information persistence",
      ],
      color: "green",
    },
    cnn: {
      icon: ImageIcon,
      title: "Convolutional Neural Networks",
      description:
        "For image-based cyberbullying detection, we employ CNNs to analyze visual content and detect harmful patterns.",
      features: [
        "Feature extraction from images",
        "Pattern recognition in visual content",
        "Multi-layer processing",
        "Classification of harmful imagery",
        "Transfer learning from pre-trained models",
      ],
      color: "yellow",
    },
    stack: {
      icon: Server,
      title: "Full Technology Stack",
      description: "Our application is built with modern frameworks and tools for optimal performance and scalability.",
      features: [
        "Python for backend processing",
        "Django for API development",
        "Next.js for frontend interface",
        "TensorFlow and PyTorch for ML models",
        "React for interactive UI components",
      ],
      color: "teal",
    },
  }

  return (
    <div className="mt-12">
      <Tabs defaultValue="nlp" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8">
          <TabsTrigger value="nlp">NLP</TabsTrigger>
          <TabsTrigger value="rnn">RNN</TabsTrigger>
          <TabsTrigger value="lstm">LSTM</TabsTrigger>
          <TabsTrigger value="cnn">CNN</TabsTrigger>
          <TabsTrigger value="stack">Full Stack</TabsTrigger>
        </TabsList>

        {Object.entries(technologies).map(([key, tech]) => (
          <TabsContent key={key} value={key} className="border border-gray-800 rounded-lg p-6 bg-gray-900/50">
            <TechContent
              icon={tech.icon}
              title={tech.title}
              description={tech.description}
              features={tech.features}
              color={tech.color}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
