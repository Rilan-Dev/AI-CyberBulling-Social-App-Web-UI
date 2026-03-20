"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextAnalysisDemo } from "./text-analysis-demo"
import { ImageAnalysisDemo } from "./image-analysis-demo"
import { useTheme } from "next-themes"

export function DemoSection() {
  const [activeTab, setActiveTab] = useState("text")
  const { theme, resolvedTheme } = useTheme()
  const isDark = theme === "dark" || resolvedTheme === "dark"

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="text">Text Analysis</TabsTrigger>
          <TabsTrigger value="image">Image Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-6">
          <TextAnalysisDemo />
        </TabsContent>

        <TabsContent value="image" className="mt-6">
          <ImageAnalysisDemo />
        </TabsContent>
      </Tabs>

      <div className="mt-16">
        <h3
          className={`text-2xl font-bold text-center mb-6 transition-colors duration-300 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          How Our Analysis Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`p-6 rounded-lg border transition-colors duration-300 ${
              activeTab === "text"
                ? isDark
                  ? "border-blue-500 bg-blue-900/20"
                  : "border-blue-500 bg-blue-50"
                : isDark
                  ? "border-gray-700 bg-gray-800/30"
                  : "border-gray-300 bg-gray-100/50"
            }`}
          >
            <h4
              className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Text Analysis Pipeline
            </h4>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  1
                </span>
                <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Text preprocessing (tokenization, normalization, stop word removal)
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  2
                </span>
                <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Feature extraction using BERT embeddings and TF-IDF vectors
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  3
                </span>
                <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Multi-class classification using fine-tuned LSTM neural network
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  4
                </span>
                <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Confidence score calculation based on probability distribution
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  5
                </span>
                <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Content categorization and severity assessment
                </span>
              </li>
            </ol>
          </div>

          <div
            className={`p-6 rounded-lg border transition-colors duration-300 ${
              activeTab === "image"
                ? isDark
                  ? "border-blue-500 bg-blue-900/20"
                  : "border-blue-500 bg-blue-50"
                : isDark
                  ? "border-gray-700 bg-gray-800/30"
                  : "border-gray-300 bg-gray-100/50"
            }`}
          >
            <h4
              className={`text-xl font-semibold mb-4 transition-colors duration-300 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Image Analysis Pipeline
            </h4>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  1
                </span>
                <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Image preprocessing (resizing, normalization, augmentation)
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  2
                </span>
                <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Feature extraction using pre-trained CNN (ResNet50)
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  3
                </span>
                <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Object detection and scene classification
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  4
                </span>
                <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Multi-label classification for content categories
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                  5
                </span>
                <span className={`transition-colors duration-300 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Confidence score and risk level assessment
                </span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
