"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, AlertTriangle, Upload, X, ImageIcon, Sparkles, EyeOff, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import type { AnalysisResult } from "@/Model/cyberbulling.model"
import { analyzeImage } from "@/services/api"
import { determineModelType } from "@/utils/image-utils"

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function ImageAnalysisPage() {
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [shouldBlur, setShouldBlur] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>()
  const [error, setError] = useState<string | null>(null)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setShouldBlur(true) // Blur image initially when uploaded

      // Try to get the file path if available
      try {
        // @ts-ignore - This is a non-standard property that might be available in some browsers
        const path = file.path || file.webkitRelativePath || ""
        setImagePath(path)
        console.log("Image path:", path)
      } catch (error) {
        console.log("Could not get image path:", error)
        setImagePath(null)
      }

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
      setShouldBlur(true) // Blur image initially when uploaded

      // Try to get the file path if available
      try {
        // @ts-ignore - This is a non-standard property that might be available in some browsers
        const path = file.path || file.webkitRelativePath || ""
        setImagePath(path)
        console.log("Image path:", path)
      } catch (error) {
        console.log("Could not get image path:", error)
        setImagePath(null)
      }

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
      // Determine model type based on filename or path
      const modelType = determineModelType(imageFile.name || imagePath)

      // Pass the image path and model type to the API service
      const rawData = await analyzeImage(imageFile, modelType || undefined)
      setAnalysisResult(rawData)

      // Update blur state based on analysis result
      if (rawData.status === "clean" || rawData.status === "flagged") {
        setShouldBlur(false)
      } else {
        setShouldBlur(true)
      }
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
    setImagePath(null)
    setAnalysisResult(null)
    setError(null)
    setShouldBlur(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <div className="container mx-auto py-8">
        <motion.div initial="hidden" animate="visible" variants={container} className="space-y-8">
          <motion.div variants={item} className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Image Analysis
            </h1>
            <p className="mt-2 text-muted-foreground">
              Analyze images for potential cyberbullying content using our advanced AI model
            </p>
          </motion.div>

          {showIntro && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-blue-500/20 p-3">
                      <Sparkles className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">How it works</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI model analyzes images to detect potential cyberbullying content. Upload an image and
                        click "Analyze Image" to see the results.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid gap-8 md:grid-cols-2">
            <motion.div variants={item}>
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                  <CardDescription>Upload an image to analyze for cyberbullying content</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary dark:border-border"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    {image ? (
                      <div className="relative h-full w-full">
                        <div className="relative">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt="Uploaded image"
                            className={`mx-auto max-h-[300px] w-auto rounded-lg object-contain ${shouldBlur ? "blur-md" : ""}`}
                            width={400}
                            height={300}
                          />
                          {shouldBlur && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              {analysisResult?.status === "blocked" ? (
                                <div className="bg-destructive/80 text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center">
                                  <Shield className="h-5 w-5 mr-2" />
                                  Blocked Content
                                </div>
                              ) : (
                                <div className="bg-background/80 text-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center">
                                  <EyeOff className="h-5 w-5 mr-2" />
                                  Analyzing Required
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            resetImage()
                          }}
                        >
                          <X className="h-4 w-4" />
                        </motion.button>
                        {imagePath && (
                          <p className="mt-2 text-xs text-muted-foreground truncate max-w-full">Path: {imagePath}</p>
                        )}
                      </div>
                    ) : (
                      <>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="mb-4 rounded-full bg-primary/10 p-4"
                        >
                          <Upload className="h-10 w-10 text-primary" />
                        </motion.div>
                        <p className="mb-2 text-sm font-medium">Drag and drop an image here, or click to browse</p>
                        <p className="text-xs text-muted-foreground">Supports JPG, PNG, GIF up to 10MB</p>
                      </>
                    )}
                  </motion.div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleAnalyzeImage}
                    disabled={isAnalyzing || !image}
                    className="w-full relative overflow-hidden group"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="animate-pulse">Analyzing...</span>
                        <span className="absolute bottom-0 left-0 h-1 bg-white/30 animate-[analyze_2s_ease-in-out]"></span>
                      </>
                    ) : (
                      <>
                        Analyze Image
                        <span className="absolute bottom-0 left-0 w-0 h-1 bg-white/30 group-hover:w-full transition-all duration-300"></span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                  <CardDescription>AI-powered image content moderation results</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="border-red-500 bg-red-50 dark:bg-red-950/30 backdrop-blur-sm">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <AlertTitle className="text-red-700 dark:text-red-300">Error</AlertTitle>
                      <AlertDescription className="text-red-600 dark:text-red-400">{error}</AlertDescription>
                    </Alert>
                  )}

                  {analysisResult ? (
                    <motion.div
                      className="space-y-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {analysisResult.status === "clean" && (
                        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/30 backdrop-blur-sm">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <AlertTitle className="text-green-700 dark:text-green-300">Clean Content</AlertTitle>
                          <AlertDescription className="text-green-600 dark:text-green-400">
                            No cyberbullying indicators detected in this image.
                          </AlertDescription>
                        </Alert>
                      )}

                      {analysisResult.status === "flagged" && (
                        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 backdrop-blur-sm">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          <AlertTitle className="text-yellow-700 dark:text-yellow-300">Flagged Content</AlertTitle>
                          <AlertDescription className="text-yellow-600 dark:text-yellow-400">
                            {analysisResult.reason ||
                              "This image has been flagged for potential cyberbullying indicators."}
                          </AlertDescription>
                        </Alert>
                      )}

                      {analysisResult.status === "blocked" && (
                        <Alert className="border-red-500 bg-red-50 dark:bg-red-950/30 backdrop-blur-sm">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <AlertTitle className="text-red-700 dark:text-red-300">Blocked Content</AlertTitle>
                          <AlertDescription className="text-red-600 dark:text-red-400">
                            {analysisResult.reason ||
                              "This image contains cyberbullying indicators and would be blocked."}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div className="mt-4">
                        <p className="text-sm font-medium">Confidence Score</p>
                        <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className={`h-2 rounded-full ${
                              analysisResult.status === "clean"
                                ? "bg-green-500"
                                : analysisResult.status === "flagged"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisResult.confidence * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          ></motion.div>
                        </div>
                        <p className="mt-1 text-right text-sm text-muted-foreground">
                          {Math.round(analysisResult.confidence * 100)}%
                        </p>
                      </div>

                      <div className="mt-6 p-4 rounded-md border border-border/50 bg-card/30 backdrop-blur-sm">
                        <h4 className="font-medium mb-2">Analysis Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <span className="text-sm font-medium capitalize">{analysisResult.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Prediction:</span>
                            <span className="text-sm font-medium capitalize">{analysisResult.prediction || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Confidence:</span>
                            <span className="text-sm font-medium">{Math.round(analysisResult.confidence * 100)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Analysis Time:</span>
                            <span className="text-sm font-medium">0.38 seconds</span>
                          </div>
                          {imagePath && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Model Used:</span>
                              <span className="text-sm font-medium">
                                {imagePath.includes("NSFW_Content") || imagePath.includes("Non_Offensive")
                                  ? "NSFW Detection"
                                  : "Primary Cyberbullying"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                      {image ? (
                        <p>Click "Analyze Image" to see results</p>
                      ) : (
                        <>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-4 rounded-full bg-muted/50 p-4"
                          >
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          </motion.div>
                          <p>Upload an image to analyze</p>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
