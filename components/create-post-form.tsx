"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, CheckCircle, ImageIcon, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { usePosts } from "@/context/post-context"
import { useAuth } from "@/context/auth-context"
import { analyzeImage, analyzeText } from "@/services/api"
import type { AnalysisResult } from "@/Model/cyberbulling.model"
import { toast } from "@/components/ui/use-toast"

export default function CreatePostForm() {
  const router = useRouter()
  const { userProfile } = useAuth()
  const { addPost } = usePosts()
  const [text, setText] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [textResult, setTextResult] = useState<AnalysisResult | null>(null)
  const [imageResult, setImageResult] = useState<AnalysisResult | null>(null)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [pendingAnalysis, setPendingAnalysis] = useState(false)

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
          const textData = await analyzeText(text)
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
          const imageData = await analyzeImage(imageFile)
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
    if (!imageFile) return false // Image is required
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

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Post</h1>

        <Card>
          <CardHeader>
            <CardTitle>New Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Textarea
                placeholder="What's on your mind?"
                className="min-h-[120px]"
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
                <div className="mt-2">
                  <div
                    className={`p-2 rounded-md text-sm ${
                      textResult.status === "clean"
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                        : textResult.status === "flagged"
                          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
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
                </div>
              )}
            </div>

            <div>
              <div
                className={`relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-primary dark:border-gray-700"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

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
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                          <div className="text-white text-center p-4">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                            <p className="font-bold">Blocked Content</p>
                            <p className="text-sm mt-1">
                              {imageResult.reason || "This image violates our content policy"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

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
                    <ImageIcon className="mb-4 h-10 w-10 text-gray-400" />
                    <p className="mb-2 text-sm font-medium">Drag and drop an image here, or click to browse</p>
                    <p className="text-xs text-gray-500 mb-2">Supports JPG, PNG, GIF up to 10MB</p>
                    <p className="text-xs font-medium text-red-500">Image is required</p>
                  </>
                )}
              </div>

              {/* Image Analysis Result */}
              {analysisComplete && imageResult && image && (
                <div className="mt-2">
                  <div
                    className={`p-2 rounded-md text-sm ${
                      imageResult.status === "clean"
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                        : imageResult.status === "flagged"
                          ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                          : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {imageResult.status === "clean" && <CheckCircle className="h-4 w-4" />}
                      {imageResult.status === "flagged" && <AlertTriangle className="h-4 w-4" />}
                      {imageResult.status === "blocked" && <AlertCircle className="h-4 w-4" />}
                      <span className="font-medium capitalize">{imageResult.status} Image</span>
                      <span className="ml-auto text-xs">{Math.round(imageResult.confidence * 100)}% confidence</span>
                    </div>
                    {imageResult.reason && <p className="mt-1 text-sm">{imageResult.reason}</p>}
                  </div>
                </div>
              )}
            </div>

            {pendingAnalysis && !analysisComplete && (
              <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
                <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                <AlertTitle className="text-blue-700 dark:text-blue-300">Analyzing Content</AlertTitle>
                <AlertDescription className="text-blue-600 dark:text-blue-400">
                  Please wait while we analyze your content for policy compliance.
                </AlertDescription>
              </Alert>
            )}

            {status && analysisComplete && (
              <div className="space-y-4">
                {status === "clean" && (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <AlertTitle className="text-green-700 dark:text-green-300">Content Ready to Post</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      No cyberbullying indicators detected in your content.
                    </AlertDescription>
                  </Alert>
                )}

                {status === "flagged" && (
                  <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <AlertTitle className="text-yellow-700 dark:text-yellow-300">Content Flagged</AlertTitle>
                    <AlertDescription className="text-yellow-600 dark:text-yellow-400">
                      {textResult?.status === "flagged" && textResult.reason}
                      {imageResult?.status === "flagged" && imageResult.reason}
                      <p className="mt-2">Your post can still be submitted, but it may be reviewed by moderators.</p>
                    </AlertDescription>
                  </Alert>
                )}

                {status === "blocked" && (
                  <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <AlertTitle className="text-red-700 dark:text-red-300">Content Blocked</AlertTitle>
                    <AlertDescription className="text-red-600 dark:text-red-400">
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
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit() || isAnalyzing || isSubmitting || pendingAnalysis}
              className="min-w-[120px]"
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
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
