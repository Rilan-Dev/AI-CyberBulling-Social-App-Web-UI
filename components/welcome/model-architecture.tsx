"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Database, Layers, Code, ArrowRight } from "lucide-react"

export function ModelArchitecture() {
  const [activeTab, setActiveTab] = useState("text")

  return (
    <div className="py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-3">Model Architecture</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore the technical architecture behind our cyberbullying prediction models
        </p>
      </div>

      <Tabs defaultValue="text" className="max-w-5xl mx-auto" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="text">Text Analysis Model</TabsTrigger>
          <TabsTrigger value="image">Image Analysis Model</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-semibold mb-2">Text Analysis Neural Network Architecture</h3>
                  <p className="text-muted-foreground text-center max-w-3xl mb-8">
                    Our text analysis model uses a combination of NLP techniques and deep learning to detect
                    cyberbullying patterns
                  </p>
                </div>

                {/* Architecture Diagram */}
                <div className="relative">
                  <div className="absolute left-0 right-0 h-1 top-24 bg-blue-900/30 hidden md:block"></div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { title: "Text Input", icon: Database, description: "Raw text data" },
                      { title: "Preprocessing", icon: Code, description: "Tokenization, stemming, stop word removal" },
                      { title: "Embedding Layer", icon: Layers, description: "Word embeddings (GloVe, Word2Vec)" },
                      { title: "LSTM Layers", icon: Brain, description: "Bidirectional LSTM with attention mechanism" },
                      { title: "Classification", icon: ArrowRight, description: "Softmax output layer" },
                    ].map((step, i) => (
                      <div key={i} className="relative flex flex-col items-center text-center">
                        <div className="z-10 w-16 h-16 rounded-full bg-blue-900/30 border border-blue-800 flex items-center justify-center mb-3">
                          {<step.icon className="h-6 w-6 text-blue-400" />}
                        </div>
                        <h4 className="font-medium text-sm">{step.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Model Type</h4>
                    <p className="text-sm text-muted-foreground">Bidirectional LSTM with Attention</p>
                    <p className="text-xs text-muted-foreground">
                      Captures context from both directions in text sequences
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Training Data</h4>
                    <p className="text-sm text-muted-foreground">250,000+ labeled text samples</p>
                    <p className="text-xs text-muted-foreground">From social media, forums, and messaging platforms</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Performance</h4>
                    <p className="text-sm text-muted-foreground">94.2% accuracy, 92.8% F1 score</p>
                    <p className="text-xs text-muted-foreground">
                      Optimized for high recall to minimize missed instances
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="image" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div className="flex flex-col items-center">
                  <h3 className="text-xl font-semibold mb-2">Image Analysis CNN Architecture</h3>
                  <p className="text-muted-foreground text-center max-w-3xl mb-8">
                    Our image analysis model uses convolutional neural networks to detect visual cyberbullying content
                  </p>
                </div>

                {/* Architecture Diagram */}
                <div className="relative">
                  <div className="absolute left-0 right-0 h-1 top-24 bg-purple-900/30 hidden md:block"></div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { title: "Image Input", icon: Database, description: "Raw image data" },
                      { title: "Convolutional Layers", icon: Layers, description: "Feature extraction with filters" },
                      { title: "Pooling Layers", icon: Code, description: "Dimensionality reduction" },
                      { title: "Fully Connected", icon: Brain, description: "Feature interpretation" },
                      { title: "Classification", icon: ArrowRight, description: "Softmax output layer" },
                    ].map((step, i) => (
                      <div key={i} className="relative flex flex-col items-center text-center">
                        <div className="z-10 w-16 h-16 rounded-full bg-purple-900/30 border border-purple-800 flex items-center justify-center mb-3">
                          {<step.icon className="h-6 w-6 text-purple-400" />}
                        </div>
                        <h4 className="font-medium text-sm">{step.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Model Type</h4>
                    <p className="text-sm text-muted-foreground">Modified ResNet with custom layers</p>
                    <p className="text-xs text-muted-foreground">
                      Transfer learning from pre-trained image recognition models
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Training Data</h4>
                    <p className="text-sm text-muted-foreground">150,000+ labeled images</p>
                    <p className="text-xs text-muted-foreground">Includes memes, screenshots, and modified images</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Performance</h4>
                    <p className="text-sm text-muted-foreground">91.5% accuracy, 89.7% F1 score</p>
                    <p className="text-xs text-muted-foreground">
                      Optimized for detecting subtle visual cyberbullying cues
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
