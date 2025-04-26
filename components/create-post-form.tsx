"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, CheckCircle, ImageIcon, X } from "lucide-react"
import Image from "next/image"
import { usePosts } from "@/context/post-context"
import { useAuth } from "@/context/auth-context"
import { analyzeText, analyzeImage } from "@/lib/api"

export default function CreatePostForm() {
  const router = useRouter()
  const { user } = useAuth()
  const { addPost } = usePosts()
  const [text, setText] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [textResult, setTextResult] = useState<null | {
    prediction: "clean" | "flagged" | "blocked"
    confidence: number
    reason?: string
  }>(null)
  const [imageResult, setImageResult] = useState<null | {
    prediction: "clean" | "flagged" | "blocked"
    confidence: number
    reason?: string
  }>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        setImageResult(null)
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
        setImageResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetImage = () => {
    setImage(null)
    setImageFile(null)
    setImageResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const analyzeContent = async () => {
    setIsAnalyzing(true)

    try {
      // Analyze text if present
      if (text.trim()) {
        const textData = await analyzeText(text)
        setTextResult({
          prediction: textData.prediction,
          confidence: textData.confidence,
          reason: textData.reason,
        })
      }

      // Analyze image if present
      if (imageFile) {
        const imageData = await analyzeImage(imageFile)
        setImageResult({
          prediction: imageData.prediction,
          confidence: imageData.confidence,
          reason: imageData.reason,
        })
      }
    } catch (error) {
      console.error("Error analyzing content:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit()) return

    setIsSubmitting(true)

    try {
      // Add the post to our context
      await addPost({
        user: {
          id: user?.id || "current-user",
          name:
            user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.username || "Current User",
          username: user?.username || "currentuser",
          avatar: user?.profile?.profile_picture || "/placeholder.svg?height=40&width=40",
        },
        content: text,
        image: imageFile || null,
        status: getOverallStatus() || "clean",
        reason: textResult?.reason || imageResult?.reason,
      })

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Error submitting post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = () => {
    if (isAnalyzing || isSubmitting) return false
    if (!text.trim() && !image) return false

    // Check if any content is blocked
    if (textResult?.prediction === "blocked" || imageResult?.prediction === "blocked") return false

    return true
  }

  const getOverallStatus = () => {
    if (textResult?.prediction === "blocked" || imageResult?.prediction === "blocked") return "blocked"
    if (textResult?.prediction === "flagged" || imageResult?.prediction === "flagged") return "flagged"
    if (
      (text.trim() || image) &&
      (textResult?.prediction === "clean" || !text.trim()) &&
      (imageResult?.prediction === "clean" || !image)
    )
      return "clean"
    return null
  }

  const status = getOverallStatus()

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
                }}
              />
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
                    <ImageIcon className="mb-4 h-10 w-10 text-gray-400" />
                    <p className="mb-2 text-sm font-medium">Drag and drop an image here, or click to browse</p>
                    <p className="text-xs text-gray-500">Supports JPG, PNG, GIF up to 10MB</p>
                  </>
                )}
              </div>
            </div>

            {status && (
              <div className="space-y-4">
                {status === "clean" && (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <AlertTitle className="text-green-700 dark:text-green-300">Clean Content</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      No cyberbullying indicators detected in your content.
                    </AlertDescription>
                  </Alert>
                )}

                {status === "flagged" && (
                  <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <AlertTitle className="text-yellow-700 dark:text-yellow-300">Flagged Content</AlertTitle>
                    <AlertDescription className="text-yellow-600 dark:text-yellow-400">
                      {textResult?.prediction === "flagged" && textResult.reason}
                      {imageResult?.prediction === "flagged" && imageResult.reason}
                    </AlertDescription>
                  </Alert>
                )}

                {status === "blocked" && (
                  <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <AlertTitle className="text-red-700 dark:text-red-300">Blocked Content</AlertTitle>
                    <AlertDescription className="text-red-600 dark:text-red-400">
                      {textResult?.prediction === "blocked" && textResult.reason}
                      {imageResult?.prediction === "blocked" && imageResult.reason}
                      <p className="mt-2">Please revise your content before posting.</p>
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
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={analyzeContent}
                disabled={isAnalyzing || isSubmitting || (!text.trim() && !image)}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Content"}
              </Button>
              <Button onClick={handleSubmit} disabled={!canSubmit()}>
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
