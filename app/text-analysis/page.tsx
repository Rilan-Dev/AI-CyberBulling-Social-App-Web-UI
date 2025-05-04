"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, AlertTriangle, Sparkles } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { AnalysisResult } from "@/Model/cyberbulling.model"
import { analyzeText } from "@/services/api"
import { Badge } from "@/components/ui/badge"

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

export default function TextAnalysisPage() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>()
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleAnalyzeText = async () => {
    if (!text.trim()) return

    setIsAnalyzing(true)

    try {
      const data = await analyzeText(text)
      setAnalysisResult(data)
    } catch (error) {
      console.error("Error analyzing text:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getExampleText = (type: string) => {
    switch (type) {
      case "clean":
        return "This is a friendly message. I hope you're having a great day!"
      case "flagged":
        return "I don't like your post. It's really not good and you should delete it."
      case "blocked":
        return "You're so stupid and I hate everything about you."
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      <div className="container mx-auto py-8">
        <motion.div initial="hidden" animate="visible" variants={container} className="space-y-8">
          <motion.div variants={item} className="mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Text Analysis
            </h1>
            <p className="mt-2 text-muted-foreground">
              Analyze text content for potential cyberbullying indicators using our advanced AI model
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
                        Our AI model analyzes text to detect potential cyberbullying content. Enter your text in the
                        input field and click "Analyze Text" to see the results.
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
                  <CardTitle>Input Text</CardTitle>
                  <CardDescription>Enter the text you want to analyze for cyberbullying content</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Type or paste text here..."
                    className="min-h-[200px] resize-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />

                  <div className="mt-4 flex flex-wrap gap-2">
                    <p className="w-full text-sm text-muted-foreground mb-2">Try an example:</p>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => setText(getExampleText("clean"))}
                    >
                      Clean Example
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => setText(getExampleText("flagged"))}
                    >
                      Flagged Example
                    </Badge>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/20 transition-colors"
                      onClick={() => setText(getExampleText("blocked"))}
                    >
                      Blocked Example
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleAnalyzeText}
                    disabled={isAnalyzing || !text.trim()}
                    className="w-full relative overflow-hidden group"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="animate-pulse">Analyzing...</span>
                        <span className="absolute bottom-0 left-0 h-1 bg-white/30 animate-[analyze_2s_ease-in-out]"></span>
                      </>
                    ) : (
                      <>
                        Analyze Text
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
                  <CardDescription>AI-powered cyberbullying detection results</CardDescription>
                </CardHeader>
                <CardContent>
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
                            No cyberbullying indicators detected in this text.
                          </AlertDescription>
                        </Alert>
                      )}

                      {analysisResult.status === "flagged" && (
                        <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30 backdrop-blur-sm">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          <AlertTitle className="text-yellow-700 dark:text-yellow-300">Flagged Content</AlertTitle>
                          <AlertDescription className="text-yellow-600 dark:text-yellow-400">
                            {analysisResult.reason ||
                              "This content has been flagged for potential cyberbullying indicators."}
                          </AlertDescription>
                        </Alert>
                      )}

                      {analysisResult.status === "blocked" && (
                        <Alert className="border-red-500 bg-red-50 dark:bg-red-950/30 backdrop-blur-sm">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                          <AlertTitle className="text-red-700 dark:text-red-300">Blocked Content</AlertTitle>
                          <AlertDescription className="text-red-600 dark:text-red-400">
                            {analysisResult.reason ||
                              "This content contains cyberbullying indicators and would be blocked."}
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
                            <span className="text-sm font-medium">0.24 seconds</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center text-center text-muted-foreground">
                      <div className="max-w-xs">
                        <p className="mb-2">Enter text and click "Analyze Text" to see results</p>
                        <p className="text-sm">
                          Our AI model will analyze the text for cyberbullying indicators and provide detailed results.
                        </p>
                      </div>
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
