"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, AlertTriangle, Loader2, Upload, X, EyeOff, RefreshCw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { analyzeImage } from "@/services/api"
import type { AnalysisResult } from "@/Model/cyberbulling.model"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { determineModelType } from "@/utils/image-utils"

export function ImageAnalysisDemo() {
  const [image, setImage] = useState<File | null>(null)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [shouldBlur, setShouldBlur] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()

  // Handle mounting for SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleImageChange = (file: File) => {
    setImage(file)
    setResult(null)
    setError(null)
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

    // Create image preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0])
    }
  }

  const handleAnalyze = async () => {
    if (!image) return

    setIsAnalyzing(true)
    setError(null)
    try {
      // Determine model type based on filename or path
      const modelType = determineModelType(image.name || imagePath)

      // Use the actual API service with the image path and detected model type
      const analysisResult = await analyzeImage(image, modelType || undefined )
      setResult(analysisResult)

      // Update blur state based on analysis result
      if (analysisResult.status === "clean" || analysisResult.status === "flagged") {
        setShouldBlur(false)
      } else {
        setShouldBlur(true)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
      setError("Failed to analyze image. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearImage = () => {
    // Reset all states
    setImage(null)
    setImagePath(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
    setShouldBlur(true)

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSelectNewImage = () => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clean":
        return "text-green-500 dark:text-green-400"
      case "flagged":
        return "text-yellow-500 dark:text-yellow-400"
      case "blocked":
        return "text-red-500 dark:text-red-400"
      default:
        return "text-gray-500 dark:text-gray-400"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "clean":
        return "border-green-500 text-green-500 dark:border-green-400 dark:text-green-400"
      case "flagged":
        return "border-yellow-500 text-yellow-500 dark:border-yellow-400 dark:text-yellow-400"
      case "blocked":
        return "border-red-500 text-red-500 dark:border-red-400 dark:text-red-400"
      default:
        return "border-gray-500 text-gray-500 dark:border-gray-400 dark:text-gray-400"
    }
  }

  const getPredictionBadgeColor = (prediction: string) => {
    if (prediction.includes("Non_Offensive") || prediction.includes("not_cyberbulling")) {
      return "border-green-500 text-green-500 dark:border-green-400 dark:text-green-400"
    } else if (prediction.includes("humour")) {
      return "border-blue-500 text-blue-500 dark:border-blue-400 dark:text-blue-400"
    } else {
      return "border-red-500 text-red-500 dark:border-red-400 dark:text-red-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clean":
        return <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
      case "flagged":
        return <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" />
      case "blocked":
        return <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
      default:
        return null
    }
  }

  const getStatusTitle = (status: string) => {
    switch (status) {
      case "clean":
        return "Safe Content"
      case "flagged":
        return "Potentially Harmful"
      case "blocked":
        return "Harmful Content"
      default:
        return "Unknown"
    }
  }

  // Calculate image size safely
  const getImageSize = () => {
    if (!image) return 0
    return Math.round((image.size || 0) / 1024)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-foreground">Test Our Image Analysis</h3>
        <p className="text-muted-foreground text-sm">
          Upload an image to analyze how our AI detects potentially harmful visual content.
        </p>

        <motion.div
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
            isDragging ? "border-primary bg-primary/10" : "border-border hover:border-muted-foreground bg-card/30"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {!imagePreview ? (
            <motion.div
              className="flex flex-col items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              </motion.div>
              <motion.p variants={itemVariants} className="text-foreground mb-2">
                Drag & drop an image here
              </motion.p>
              <motion.p variants={itemVariants} className="text-muted-foreground text-sm mb-4">
                or
              </motion.p>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageChange(e.target.files[0])
                  }
                }}
              />
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" onClick={handleSelectNewImage} className="transition-all">
                  Browse Files
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="relative w-full">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className={`max-h-[200px] mx-auto rounded ${shouldBlur ? "blur-md" : ""}`}
                />
                {shouldBlur && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-background/40 rounded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {result?.status === "blocked" ? (
                      <div className="bg-destructive/80 text-destructive-foreground px-3 py-1 rounded text-sm font-medium flex items-center">
                        <EyeOff className="h-4 w-4 mr-2" />
                        Blocked Content
                      </div>
                    ) : (
                      <div className="bg-background/80 text-foreground px-3 py-1 rounded text-sm font-medium">
                        Analyzing required
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>

              {/* Image control buttons */}
              <div className="absolute top-0 right-0 flex space-x-1">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/60 hover:bg-background/80 text-foreground rounded-full h-8 w-8"
                    onClick={handleSelectNewImage}
                    title="Change image"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/60 hover:bg-background/80 text-foreground rounded-full h-8 w-8"
                    onClick={clearImage}
                    title="Clear image"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>

              <motion.p
                className="text-center text-sm text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {image?.name} ({getImageSize()} KB)
              </motion.p>
              {imagePath && (
                <motion.p
                  className="text-center text-xs text-muted-foreground mt-1 truncate max-w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Path: {imagePath}
                </motion.p>
              )}
            </div>
          )}
        </motion.div>

        {/* Image action buttons */}
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
            <Button onClick={handleAnalyze} disabled={!image || isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Image"
              )}
            </Button>
          </motion.div>

          {imagePreview && (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" onClick={clearImage} className="px-4">
                Clear
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-foreground">Analysis Results</h3>

        <div className="h-full">
          <motion.div
            className={cn("rounded-lg border h-full", "bg-card text-card-foreground shadow-sm")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 space-y-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">AI Analysis</h4>
              <div className={cn("space-y-4 p-4 rounded-md border h-full min-h-[250px]", "bg-muted/50 border-border")}>
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      className="text-destructive text-sm flex flex-col items-center justify-center h-full"
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                      <p>{error}</p>
                    </motion.div>
                  ) : isAnalyzing ? (
                    <motion.div
                      className="flex flex-col items-center justify-center h-full"
                      key="analyzing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                      <p className="text-primary">Analyzing image...</p>
                      <p className="text-xs text-muted-foreground mt-2">Detecting harmful visual content...</p>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      className="space-y-4"
                      key="result"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      variants={containerVariants}
                    >
                      <motion.div className="flex items-center" variants={itemVariants}>
                        {getStatusIcon(result.status)}
                        <span className={`font-medium ${getStatusColor(result.status)}`}>
                          {getStatusTitle(result.status)}
                        </span>
                      </motion.div>

                      <motion.div className="space-y-2" variants={itemVariants}>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Confidence</span>
                          <span className="text-sm font-medium text-foreground">
                            {result.confidence ? Math.round(result.confidence * 100) : 0}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div
                            className={cn(
                              "h-2 rounded-full",
                              result.status === "clean"
                                ? "bg-green-500"
                                : result.status === "flagged"
                                  ? "bg-yellow-500"
                                  : "bg-red-500",
                            )}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${result.confidence ? Math.round(result.confidence * 100) : 0}%`,
                            }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                          ></motion.div>
                        </div>
                      </motion.div>

                      <motion.div className="space-y-1" variants={itemVariants}>
                        <p className="text-sm text-foreground">Classification:</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className={getStatusBadgeColor(result.status)}>
                            Status: {result.status}
                          </Badge>
                          {result.prediction && (
                            <Badge variant="outline" className={getPredictionBadgeColor(result.prediction)}>
                              {result.prediction.replace(/_/g, " ")}
                            </Badge>
                          )}
                        </div>
                      </motion.div>

                      {result.reason && (
                        <motion.div className="text-sm text-foreground mt-2" variants={itemVariants}>
                          <p className="font-medium mb-1">Analysis:</p>
                          <p className="text-muted-foreground">{result.reason}</p>
                        </motion.div>
                      )}

                      {/* Technical details */}
                      <motion.div className="mt-4 pt-4 border-t border-border" variants={itemVariants}>
                        <p className="text-xs text-muted-foreground mb-2">Technical Details:</p>
                        <div
                          className={cn(
                            "text-xs font-mono p-2 rounded overflow-auto",
                            "bg-muted text-muted-foreground",
                          )}
                        >
                          <pre>{JSON.stringify(result, null, 2)}</pre>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex flex-col items-center justify-center h-full text-muted-foreground"
                      key="empty"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p>Upload an image and click "Analyze Image" to see results</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
