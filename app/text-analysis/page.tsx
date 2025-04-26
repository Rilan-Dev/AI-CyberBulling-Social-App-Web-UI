"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { analyzeText } from "@/lib/api"
import { AnalysisResult } from "@/Model/cyberbulling.model"

export default function TextAnalysisPage() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>()

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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Text Analysis</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Analyze text content for potential cyberbullying indicators
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Text</CardTitle>
            <CardDescription>Enter the text you want to analyze for cyberbullying content</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Type or paste text here..."
              className="min-h-[200px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalyzeText} disabled={isAnalyzing || !text.trim()} className="w-full">
              {isAnalyzing ? "Analyzing..." : "Analyze Text"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>AI-powered cyberbullying detection results</CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResult ? (
              <div className="space-y-4">
                {analysisResult.status === "clean" && (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <AlertTitle className="text-green-700 dark:text-green-300">Clean Content</AlertTitle>
                    <AlertDescription className="text-green-600 dark:text-green-400">
                      No cyberbullying indicators detected in this text.
                    </AlertDescription>
                  </Alert>
                )}

                {analysisResult.status === "flagged" && (
                  <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <AlertTitle className="text-yellow-700 dark:text-yellow-300">Flagged Content</AlertTitle>
                    <AlertDescription className="text-yellow-600 dark:text-yellow-400">
                      {analysisResult.reason || "This content has been flagged for potential cyberbullying indicators."}
                    </AlertDescription>
                  </Alert>
                )}

                {analysisResult.status === "blocked" && (
                  <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <AlertTitle className="text-red-700 dark:text-red-300">Blocked Content</AlertTitle>
                    <AlertDescription className="text-red-600 dark:text-red-400">
                      {analysisResult.reason || "This content contains cyberbullying indicators and would be blocked."}
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
              <div className="flex h-[200px] items-center justify-center text-center text-gray-500">
                <p>Enter text and click "Analyze Text" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
