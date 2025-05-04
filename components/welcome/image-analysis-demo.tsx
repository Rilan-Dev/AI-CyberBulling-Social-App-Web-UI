"use client"

import type React from "react"

import { useState, useRef } from "react"
import { AlertCircle, AlertTriangle, CheckCircle, Upload, ImageIcon, Loader2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { analyzeImage } from "@/services/api"
import type { AnalysisResult } from "@/Model/cyberbulling.model"

export function ImageAnalysisDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
        setAnalysisResult(null) // Reset previous results
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result as string)
        setAnalysisResult(null) // Reset previous results
      }
      reader.readAsDataURL(file)
    }
  }

  const resetImage = () => {
    setSelectedImage(null)
    setImageFile(null)
    setAnalysisResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAnalyze = async () => {
    if (!imageFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const result = await analyzeImage(imageFile)
      setAnalysisResult(result)
      console.log("Image analysis result:", result)
    } catch (err) {
      console.error("Error analyzing image:", err)
      setError("Failed to analyze image. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "clean":
        return "text-green-500"
      case "flagged":
        return "text-yellow-500"
      case "blocked":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadgeColor = (status: string | undefined) => {
    switch (status) {
      case "clean":
        return "bg-green-900/30 text-green-400 border-green-800"
      case "flagged":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800"
      case "blocked":
        return "bg-red-900/30 text-red-400 border-red-800"
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-800"
    }
  }

  const getPredictionBadgeColor = (prediction: string | undefined) => {
    switch (prediction) {
      case "not_cyberbullying":
      case "safe":
        return "bg-green-900/30 text-green-400 border-green-800"
      case "negative":
        return "bg-yellow-900/30 text-yellow-400 border-yellow-800"
      case "offensive":
        return "bg-red-900/30 text-red-400 border-red-800"
      default:
        return "bg-gray-900/30 text-gray-400 border-gray-800"
    }
  }

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "clean":
        return <CheckCircle className={`h-5 w-5 ${getStatusColor(status)} mr-2`} />
      case "flagged":
        return <AlertTriangle className={`h-5 w-5 ${getStatusColor(status)} mr-2`} />
      case "blocked":
        return <AlertCircle className={`h-5 w-5 ${getStatusColor(status)} mr-2`} />
      default:
        return null
    }
  }

  const getStatusTitle = (status: string | undefined) => {
    switch (status) {
      case "clean":
        return "Safe Image"
      case "flagged":
        return "Potentially Harmful Image"
      case "blocked":
        return "Harmful Image Detected"
      default:
        return "Analysis Result"
    }
  }

  // Determine if image should be blurred
  const shouldBlurImage = () => {
    // Always blur initially before analysis
    if (selectedImage && !analysisResult) return false

    // Blur if analysis is complete and image is blocked
    if (selectedImage && analysisResult?.status === "blocked") return true

    // Don't blur if analysis is complete and image is clean or flagged
    return false
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Image Analysis Demo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">Input Image</h4>
          <div
            className="aspect-video bg-gray-800 rounded-md flex items-center justify-center border border-gray-700 overflow-hidden relative"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {selectedImage ? (
              <div className="relative w-full h-full">
                <div className={`relative ${shouldBlurImage() ? "overflow-hidden rounded-lg" : ""}`}>
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected"
                    className={`w-full h-full object-contain ${shouldBlurImage() ? "blur-md" : ""}`}
                    width={400}
                    height={300}
                    style={{ maxHeight: "300px" }}
                  />

                  {/* Blocked content overlay */}
                  {analysisResult?.status === "blocked" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                      <div className="text-white text-center p-4">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-bold">Blocked Content</p>
                        <p className="text-sm mt-1">
                          {analysisResult.reason || "This image violates our content policy"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-8 w-8 rounded-full"
                  onClick={resetImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="text-center p-4 cursor-pointer w-full h-full flex flex-col items-center justify-center"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="mb-4 h-12 w-12 text-gray-600" />
                <p className="mb-2 text-sm font-medium">Drag and drop an image here, or click to browse</p>
                <p className="text-xs text-gray-500">Supports JPG, PNG, GIF up to 10MB</p>
              </div>
            )}
          </div>
          <input
            id="image-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="mt-2 flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="border-gray-700 text-gray-300"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedImage}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Image"
              )}
            </Button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">AI Analysis</h4>
          <div className="space-y-4 bg-gray-800/50 p-4 rounded-md border border-gray-700 h-full">
            {error ? (
              <div className="text-red-400 text-sm">
                <AlertCircle className="h-5 w-5 text-red-400 mb-2" />
                {error}
              </div>
            ) : isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                <p className="text-blue-400">Analyzing image...</p>
                <p className="text-xs text-gray-500 mt-2">Detecting harmful visual content...</p>
              </div>
            ) : analysisResult ? (
              <>
                <div className="flex items-center">
                  {getStatusIcon(analysisResult.status)}
                  <span className={`font-medium ${getStatusColor(analysisResult.status)}`}>
                    {getStatusTitle(analysisResult.status)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Confidence</span>
                    <span className="text-sm font-medium">
                      {analysisResult.confidence ? Math.round(analysisResult.confidence * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`${
                        analysisResult.status === "clean"
                          ? "bg-green-500"
                          : analysisResult.status === "flagged"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      } h-2 rounded-full`}
                      style={{
                        width: `${analysisResult.confidence ? Math.round(analysisResult.confidence * 100) : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-300">Classification:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getStatusBadgeColor(analysisResult.status)}>
                      Status: {analysisResult.status}
                    </Badge>
                    {analysisResult.prediction && (
                      <Badge variant="outline" className={getPredictionBadgeColor(analysisResult.prediction)}>
                        {analysisResult.prediction.replace(/_/g, " ")}
                      </Badge>
                    )}
                  </div>
                </div>

                {analysisResult.reason && (
                  <div className="text-sm text-gray-300 mt-2">
                    <p className="font-medium mb-1">Analysis:</p>
                    <p>{analysisResult.reason}</p>
                  </div>
                )}

                {/* Technical details */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-500 mb-2">Technical Details:</p>
                  <div className="text-xs text-gray-500 font-mono bg-gray-900 p-2 rounded overflow-auto">
                    {JSON.stringify(analysisResult, null, 2)}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>Upload an image and click "Analyze Image" to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
