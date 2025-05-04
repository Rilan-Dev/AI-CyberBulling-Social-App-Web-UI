"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextAnalysisDemo } from "./text-analysis-demo"
import { ImageAnalysisDemo } from "./image-analysis-demo"

export function DemoSection() {
  const [activeTab, setActiveTab] = useState("text")

  return (
    <div className="space-y-8">
      <Tabs defaultValue="text" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="text">Text Analysis</TabsTrigger>
          <TabsTrigger value="image">Image Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-0">
          <TextAnalysisDemo />
        </TabsContent>

        <TabsContent value="image" className="mt-0">
          <ImageAnalysisDemo />
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-gray-800/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">How Our Analysis Works</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div
            className={`rounded-lg p-4 ${activeTab === "text" ? "bg-blue-900/20 border border-blue-800/50" : "bg-gray-800/50"}`}
          >
            <h4 className="text-lg font-medium mb-3">Text Analysis Pipeline</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium">Preprocessing</h5>
                  <p className="text-xs text-gray-400">Text is cleaned, normalized, and tokenized</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium">Feature Extraction</h5>
                  <p className="text-xs text-gray-400">Key linguistic features are identified</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium">BERT Analysis</h5>
                  <p className="text-xs text-gray-400">Deep learning model analyzes context and sentiment</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium">Classification</h5>
                  <p className="text-xs text-gray-400">Content is classified with confidence score</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg p-4 ${activeTab === "image" ? "bg-purple-900/20 border border-purple-800/50" : "bg-gray-800/50"}`}
          >
            <h4 className="text-lg font-medium mb-3">Image Analysis Pipeline</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-900 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium">Image Processing</h5>
                  <p className="text-xs text-gray-400">Image is normalized and prepared for analysis</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-900 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium">CNN Feature Extraction</h5>
                  <p className="text-xs text-gray-400">Convolutional neural networks extract visual features</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-900 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium">OCR Text Detection</h5>
                  <p className="text-xs text-gray-400">Text in images is extracted and analyzed</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-900 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <div className="ml-3">
                  <h5 className="text-sm font-medium">Multi-modal Analysis</h5>
                  <p className="text-xs text-gray-400">Combined visual and text analysis for final classification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
