"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, CheckCircle, ImageIcon, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { usePosts } from "@/context/post-context"
import { useAuth } from "@/context/auth-context"
import type { AnalysisResult } from "@/Model/cyberbulling.model"
import { toast } from "@/components/ui/use-toast"
import { useThemeDetector, getThemeColors } from "@/lib/Theme-Switcher/theme-utils"
import { determineModelType } from "@/utils/image-utils"
import { analysisService } from "@/services/analysis-api"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
}

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function CreatePostForm() {
  const router = useRouter()
  const { addPost } = usePosts()
  const [text, setText] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [textResult, setTextResult] = useState<AnalysisResult | null>(null)
  const [imageResult, setImageResult] = useState<AnalysisResult | null>(null)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [pendingAnalysis, setPendingAnalysis] = useState(false)
  const { isDarkTheme, mounted } = useThemeDetector()

  // Get theme colors
  const colors = getThemeColors(isDarkTheme)

  // Effect to trigger analysis when content changes
  useEffect(() => {
    if (text.trim() || imageFile) {
      setPendingAnalysis(true)
    }
  }, [text, imageFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)

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
        setImageResult(null) // Reset previous image result
        setAnalysisComplete(false)
        setPendingAnalysis(true)
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
        setImageResult(null) // Reset previous image result
        setAnalysisComplete(false)
        setPendingAnalysis(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetImage = () => {
    setImage(null)
    setImageFile(null)
    setImagePath(null)
    setImageResult(null)
    setAnalysisComplete(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Update the analyzeContent function to use async/await properly
  const analyzeContent = async () => {
    if (isAnalyzing) return // Prevent multiple simultaneous analyses

    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setPendingAnalysis(false)

    let newTextResult = textResult
    let newImageResult = imageResult

    try {
      // Analyze text if present
      if (text.trim()) {
        try {
          const textData = await analysisService.analyzeText(text)
          console.log("Text analysis result:", textData)
          newTextResult = textData
          setTextResult(textData)
        } catch (error) {
          console.error("Error analyzing text:", error)
          setTextResult(null)
          newTextResult = null
        }
      } else {
        setTextResult(null)
        newTextResult = null
      }

      // Analyze image if present
      if (imageFile) {
        try {
          // Determine model type based on filename or path
          const modelType = determineModelType(imageFile.name || imagePath)
          // Pass the image path to the API service
          const imageData = await analysisService.analyzeImage(imageFile, modelType || undefined)
          console.log("Image analysis result:", imageData)
          newImageResult = imageData
          setImageResult(imageData)
        } catch (error) {
          console.error("Error analyzing image:", error)
          setImageResult(null)
          newImageResult = null
        }
      } else {
        setImageResult(null)
        newImageResult = null
      }

      // Log the final results that will be used for status determination
      console.log("Final analysis results - Text:", newTextResult)
      console.log("Final analysis results - Image:", newImageResult)

      return { textResult: newTextResult, imageResult: newImageResult }
    } catch (error) {
      console.error("Error analyzing content:", error)
      return { textResult: newTextResult, imageResult: newImageResult }
    } finally {
      setAnalysisComplete(true)
      setIsAnalyzing(false)
    }
  }

  // Helper function to check if content is blocked based on analysis results
  const isContentBlocked = (textRes: AnalysisResult | null, imageRes: AnalysisResult | null) => {
    return (
      textRes?.status === "blocked" ||
      imageRes?.status === "blocked" ||
      textRes?.prediction === "offensive" ||
      imageRes?.prediction === "offensive"
    )
  }

  // Update the handleSubmit function to ensure blocked content is never submitted
  const handleSubmit = async () => {
    if (!canSubmit()) {
      console.log("Cannot submit: failed canSubmit check")
      return
    }

    setIsSubmitting(true)

    try {
      // First analyze the content if not already analyzed or if analysis is pending
      let currentTextResult = textResult
      let currentImageResult = imageResult

      if (!analysisComplete || pendingAnalysis) {
        const results = await analyzeContent()
        currentTextResult = results?.textResult || null
        currentImageResult = results?.imageResult || null

        // After analysis, check again if we can submit
        if (isContentBlocked(currentTextResult, currentImageResult)) {
          console.log("Cannot submit after analysis: content is blocked")
          setIsSubmitting(false)
          return
        }
      }

      // IMPORTANT: Always check status after analysis, regardless of when it was done
      const currentStatus = getOverallStatus(currentTextResult, currentImageResult)
      console.log("Current status:", currentStatus)

      // Double-check for blocked content after analysis
      if (isContentBlocked(currentTextResult, currentImageResult)) {
        console.log("Content is blocked, preventing submission")
        setIsSubmitting(false)
        return
      }

      // Create FormData for submission
      const formData = new FormData()

      // Add text content if present
      if (text.trim()) {
        formData.append("content", text)
      }

      // IMPORTANT: Always add image file - it's required by the API
      if (imageFile) {
        // Log the image file to verify it's valid
        console.log("Image file being added to FormData:", imageFile)

        // Add the image file to FormData with the correct field name
        formData.append("image", imageFile)

        // Log the FormData to verify the image was added
        console.log("FormData after adding image:", formData)

        // Log the entries in FormData for debugging
        for (const pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`)
        }
      } else {
        toast({
          title: "Error",
          description: "An image is required to create a post",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Submit the post with FormData
      const result = await addPost(formData)

      if (result) {
        toast({
          title: "Success",
          description: "Post created successfully",
        })
        // Redirect to home page
        router.push("/")
      } else {
        toast({
          title: "Error",
          description: "Failed to create post",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting post:", error)
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update the canSubmit function to check for pending analysis
  const canSubmit = () => {
    if (isSubmitting || isAnalyzing) return false
    if (!text.trim() && !image) return false
    if (pendingAnalysis) return false // Don't allow submission if analysis is pending

    // If analysis is complete, strictly prevent submission if any content is blocked
    if (analysisComplete) {
      if (isContentBlocked(textResult, imageResult)) {
        console.log("Cannot submit: blocked content detected")
        return false
      }
    }

    return true
  }

  // Update the getOverallStatus function to take explicit parameters
  const getOverallStatus = (
    textRes: AnalysisResult | null = textResult,
    imageRes: AnalysisResult | null = imageResult,
  ) => {
    console.log("Checking status with textResult:", textRes)
    console.log("Checking status with imageResult:", imageRes)

    // First check for blocked content
    if (isContentBlocked(textRes, imageRes)) {
      console.log("Detected blocked content")
      return "blocked"
    }

    // Then check for flagged content
    if (
      textRes?.status === "flagged" ||
      imageRes?.status === "flagged" ||
      textRes?.prediction === "negative" ||
      imageRes?.prediction === "negative"
    ) {
      console.log("Detected flagged content")
      return "flagged"
    }

    // If there's any content (text or image) and no negative results, it's clean
    if (text.trim() || image) {
      // For text: either it's clean or there's no text
      const textIsOk = !text.trim() || textRes?.status === "clean" || textRes?.prediction === "not_cyberbullying"

      // For image: either it's clean or there's no image
      const imageIsOk =
        !image ||
        imageRes?.status === "clean" ||
        (imageRes?.prediction !== "offensive" && imageRes?.prediction !== "negative")

      // If both text and image are ok, the content is clean
      if (textIsOk && imageIsOk) {
        console.log("Content is clean")
        return "clean"
      }
    }

    // If analysis is not complete or there's no content, return null
    console.log("No status determined")
    return null
  }

  const status = getOverallStatus()

  // Determine if image should be blurred
  const shouldBlurImage = () => {
    // Always blur initially before analysis
    if (image && !analysisComplete) return true

    // Blur if analysis is complete and image is blocked
    if (image && analysisComplete && imageResult?.status === "blocked") return true

    // Don't blur if analysis is complete and image is clean or flagged
    return false
  }

  // Automatically analyze content when needed
  useEffect(() => {
    if (pendingAnalysis && !isAnalyzing && !isSubmitting) {
      const timer = setTimeout(() => {
        analyzeContent()
      }, 500) // Debounce analysis to prevent too many API calls

      return () => clearTimeout(timer)
    }
  }, [pendingAnalysis, isAnalyzing, isSubmitting])

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className={`min-h-screen ${colors.gradientPrimary} relative overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute inset-0 ${colors.gradientAccent}`}></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isDarkTheme
              ? "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)"
              : "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="container mx-auto py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.h1
            className={`text-3xl font-bold mb-6 ${colors.textPrimary}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Create Post
          </motion.h1>

          <motion.div variants={fadeIn} initial="hidden" animate="visible">
            <Card className={`${colors.cardBg} ${colors.backdropBlur} ${colors.cardBorder} ${colors.textPrimary}`}>
              <CardHeader>
                <CardTitle className={colors.textPrimary}>New Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div variants={slideUp}>
                  <Textarea
                    placeholder="What's on your mind?"
                    className={`min-h-[120px] ${colors.inputBg} ${colors.inputBorder} ${colors.textPrimary} placeholder:${colors.textTertiary}`}
                    value={text}
                    onChange={(e) => {
                      setText(e.target.value)
                      setTextResult(null)
                      setAnalysisComplete(false)
                      setPendingAnalysis(true)
                    }}
                  />

                  {/* Text Analysis Result */}
                  {analysisComplete && textResult && text.trim() && (
                    <motion.div
                      className="mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`p-2 rounded-md text-sm ${
                          textResult.status === "clean"
                            ? isDarkTheme
                              ? "bg-green-900/20 text-green-300 border border-green-800/50"
                              : "bg-green-50 text-green-700 border border-green-200"
                            : textResult.status === "flagged"
                              ? isDarkTheme
                                ? "bg-yellow-900/20 text-yellow-300 border border-yellow-800/50"
                                : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                              : isDarkTheme
                                ? "bg-red-900/20 text-red-300 border border-red-800/50"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {textResult.status === "clean" && <CheckCircle className="h-4 w-4" />}
                          {textResult.status === "flagged" && <AlertTriangle className="h-4 w-4" />}
                          {textResult.status === "blocked" && <AlertCircle className="h-4 w-4" />}
                          <span className="font-medium capitalize">{textResult.status} Content</span>
                          <span className="ml-auto text-xs">{Math.round(textResult.confidence * 100)}% confidence</span>
                        </div>
                        {textResult.reason && <p className="mt-1 text-sm">{textResult.reason}</p>}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div variants={slideUp}>
                  <div
                    className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                      isDragging
                        ? "border-blue-500 bg-blue-900/10"
                        : isDarkTheme
                          ? "border-gray-700 hover:border-blue-500"
                          : "border-gray-300 hover:border-blue-500"
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
                        <div className={`relative ${shouldBlurImage() ? "overflow-hidden rounded-lg" : ""}`}>
                          <Image
                            src={image || "/placeholder.svg"}
                            alt="Uploaded image"
                            className={`mx-auto max-h-[300px] w-auto rounded-lg object-contain ${
                              shouldBlurImage() ? "blur-md" : ""
                            }`}
                            width={400}
                            height={300}
                          />

                          {/* Blocked content overlay */}
                          {analysisComplete && imageResult?.status === "blocked" && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="text-white text-center p-4">
                                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
                                <p className="font-bold">Blocked Content</p>
                                <p className="text-sm mt-1">
                                  {imageResult.reason || "This image violates our content policy"}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute right-0 top-0 h-8 w-8 rounded-full bg-red-600 hover:bg-red-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              resetImage()
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>

                        {imagePath && (
                          <p className="text-center text-xs text-muted-foreground mt-1 truncate max-w-full">
                            Path: {imagePath}
                          </p>
                        )}
                      </div>
                    ) : (
                      <>
                        <ImageIcon className={`mb-4 h-10 w-10 ${colors.textTertiary}`} />
                        <p className={`mb-2 text-sm font-medium ${colors.textSecondary}`}>
                          Drag and drop an image here, or click to browse
                        </p>
                        <p className={`text-xs ${colors.textTertiary}`}>Supports JPG, PNG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>

                  {/* Image Analysis Result */}
                  {analysisComplete && imageResult && image && (
                    <motion.div
                      className="mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`p-2 rounded-md text-sm ${
                          imageResult.status === "clean"
                            ? isDarkTheme
                              ? "bg-green-900/20 text-green-300 border border-green-800/50"
                              : "bg-green-50 text-green-700 border border-green-200"
                            : imageResult.status === "flagged"
                              ? isDarkTheme
                                ? "bg-yellow-900/20 text-yellow-300 border border-yellow-800/50"
                                : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                              : isDarkTheme
                                ? "bg-red-900/20 text-red-300 border border-red-800/50"
                                : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {imageResult.status === "clean" && <CheckCircle className="h-4 w-4" />}
                          {imageResult.status === "flagged" && <AlertTriangle className="h-4 w-4" />}
                          {imageResult.status === "blocked" && <AlertCircle className="h-4 w-4" />}
                          <span className="font-medium capitalize">{imageResult.status} Image</span>
                          <span className="ml-auto text-xs">
                            {Math.round(imageResult.confidence * 100)}% confidence
                          </span>
                        </div>
                        {imageResult.reason && <p className="mt-1 text-sm">{imageResult.reason}</p>}
                        {imagePath && (
                          <p className="mt-1 text-xs">
                            Model:{" "}
                            {imagePath.includes("NSFW_Content") || imagePath.includes("Non_Offensive")
                              ? "NSFW Detection"
                              : "Primary Cyberbullying"}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {pendingAnalysis && !analysisComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert
                      className={
                        isDarkTheme
                          ? "border-blue-800 bg-blue-900/20 text-blue-300"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                      }
                    >
                      <Loader2 className={`h-5 w-5 ${isDarkTheme ? "text-blue-400" : "text-blue-600"} animate-spin`} />
                      <AlertTitle className={isDarkTheme ? "text-blue-300" : "text-blue-700"}>
                        Analyzing Content
                      </AlertTitle>
                      <AlertDescription className={isDarkTheme ? "text-blue-400" : "text-blue-600"}>
                        Please wait while we analyze your content for policy compliance.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {status && analysisComplete && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {status === "clean" && (
                      <Alert
                        className={
                          isDarkTheme
                            ? "border-green-800 bg-green-900/20 text-green-300"
                            : "border-green-200 bg-green-50 text-green-700"
                        }
                      >
                        <CheckCircle className={`h-5 w-5 ${isDarkTheme ? "text-green-400" : "text-green-600"}`} />
                        <AlertTitle className={isDarkTheme ? "text-green-300" : "text-green-700"}>
                          Content Ready to Post
                        </AlertTitle>
                        <AlertDescription className={isDarkTheme ? "text-green-400" : "text-green-600"}>
                          No cyberbullying indicators detected in your content.
                        </AlertDescription>
                      </Alert>
                    )}

                    {status === "flagged" && (
                      <Alert
                        className={
                          isDarkTheme
                            ? "border-yellow-800 bg-yellow-900/20 text-yellow-300"
                            : "border-yellow-200 bg-yellow-50 text-yellow-700"
                        }
                      >
                        <AlertTriangle className={`h-5 w-5 ${isDarkTheme ? "text-yellow-400" : "text-yellow-600"}`} />
                        <AlertTitle className={isDarkTheme ? "text-yellow-300" : "text-yellow-700"}>
                          Content Flagged
                        </AlertTitle>
                        <AlertDescription className={isDarkTheme ? "text-yellow-400" : "text-yellow-600"}>
                          {textResult?.status === "flagged" && textResult.reason}
                          {imageResult?.status === "flagged" && imageResult.reason}
                          <p className="mt-2">
                            Your post can still be submitted, but it may be reviewed by moderators.
                          </p>
                        </AlertDescription>
                      </Alert>
                    )}

                    {status === "blocked" && (
                      <Alert
                        className={
                          isDarkTheme
                            ? "border-red-800 bg-red-900/20 text-red-300"
                            : "border-red-200 bg-red-50 text-red-700"
                        }
                      >
                        <AlertCircle className={`h-5 w-5 ${isDarkTheme ? "text-red-400" : "text-red-600"}`} />
                        <AlertTitle className={isDarkTheme ? "text-red-300" : "text-red-700"}>
                          Content Blocked
                        </AlertTitle>
                        <AlertDescription className={isDarkTheme ? "text-red-400" : "text-red-600"}>
                          {textResult?.status === "blocked" && (
                            <p className="mb-2">{textResult.reason || "Your text contains prohibited content."}</p>
                          )}
                          {imageResult?.status === "blocked" && (
                            <p className="mb-2">{imageResult.reason || "Your image contains prohibited content."}</p>
                          )}
                          <p className="mt-2 font-medium">Please revise your content before posting.</p>
                        </AlertDescription>
                      </Alert>
                    )}
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className={
                      isDarkTheme
                        ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }
                  >
                    Cancel
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit() || isAnalyzing || isSubmitting || pendingAnalysis}
                    className={`min-w-[120px] ${
                      isDarkTheme
                        ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-800 disabled:text-gray-500"
                        : "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-200 disabled:text-gray-500"
                    }`}
                  >
                    {isAnalyzing || pendingAnalysis ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post"
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
