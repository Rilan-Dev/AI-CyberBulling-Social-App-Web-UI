"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, AlertTriangle, Upload, X, ImageIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import { analyzeImage } from "@/lib/api"
import { AnalysisResult } from "@/Model/cyberbulling.model"

export default function ImageAnalysisPage() {
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>()
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        setAnalysisResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        setAnalysisResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyzeImage = async () => {
    if (!imageFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const rawData = await analyzeImage(imageFile)
      setAnalysisResult(rawData)
    } catch (error) {
      console.error("Error analyzing image:", error)
      setError("Failed to analyze image. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetImage = () => {
    setImage(null)
    setImageFile(null)
    setAnalysisResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Image Analysis</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Analyze images for potential cyberbullying content</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Upload an image to analyze for cyberbullying content</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary dark:border-gray-700"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

              {image ? (
                <div className="relative h-full w-full">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt="Uploaded image"
                    className="mx-auto max-h-[300px] w-auto rounded-lg object-contain"
                    width={400}
                    height={300}
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-0 top-0 h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      resetImage()
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="mb-4 h-10 w-10 text-gray-400" />
                  <p className="mb-2 text-sm font-medium">Drag and drop an image here, or click to browse</p>
                  <p className="text-xs text-gray-500">Supports JPG, PNG, GIF up to 10MB</p>
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalyzeImage} disabled={isAnalyzing || !image} className="w-full">
              {isAnalyzing ? "Analyzing..." : "Analyze Image"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered image content moderation results</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <AlertTitle className="text-red-700 dark:text-red-300">Error</AlertTitle>
                <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {analysisResult ? (
              <div className="space-y-4">
                {analysisResult.status === "clean" && (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <AlertTitle className="text-green-700 dark:text-green-300">Clean Content</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      No cyberbullying indicators detected in this image.
                    </AlertDescription>
                  </Alert>
                )}

                {analysisResult.status === "flagged" && (
                  <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <AlertTitle className="text-yellow-700 dark:text-yellow-300">Flagged Content</AlertTitle>
                    <AlertDescription className="text-yellow-600 dark:text-yellow-400">
                      {analysisResult.reason || "This image has been flagged for potential cyberbullying indicators."}
                    </AlertDescription>
                  </Alert>
                )}

                {analysisResult.status === "blocked" && (
                  <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <AlertTitle className="text-red-700 dark:text-red-300">Blocked Content</AlertTitle>
                    <AlertDescription className="text-red-600 dark:text-red-400">
                      {analysisResult.reason || "This image contains cyberbullying indicators and would be blocked."}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="mt-4">
                  <p className="text-sm font-medium">Confidence Score</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${
                        analysisResult.status === "clean"
                          ? "bg-green-500"
                          : analysisResult.status === "flagged"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${analysisResult.confidence * 100}%` }}
                    ></div>
                  </div>
                  <p className="mt-1 text-right text-sm text-gray-500">{Math.round(analysisResult.confidence * 100)}%</p>
                </div>
              </div>
            ) : (
              <div className="flex h-[200px] flex-col items-center justify-center text-center text-gray-500">
                {image ? (
                  <p>Click "Analyze Image" to see results</p>
                ) : (
                  <>
                    <ImageIcon className="mb-4 h-10 w-10 text-gray-400" />
                    <p>Upload an image to analyze</p>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
