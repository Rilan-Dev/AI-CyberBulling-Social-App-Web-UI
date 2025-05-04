"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { analyzeText } from "@/services/api"
import type { AnalysisResult } from "@/Model/cyberbulling.model"

export function TextAnalysisDemo() {
  const [text, setText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Sample texts for demonstration
  const sampleTexts = {
    harmful: "Turner did not withhold his disappointment. Turner called the court an “abominable conclave of negro hating demons” (with one exception) who “issued another decree that colored men and women must be driven into Jim Crow cars whenever it suits the whim of any white community.",
    borderline: "If they r in Muslim country it doesn’t mean they have to accept and support the terrorism..why u people can’t digest the truth ? Radical Islamic terrorism have kept the world under threat..what the hell is being done by the radical Muslims terrorist these days to spread corona ?",
    safe: "For what it's worth, I don't believe that ISIS has 30,000 to 50,000 terrorists in Mosul.  Their inability to reinforce elsewhere says not."
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    // Reset results when text changes
    setResult(null)
    setError(null)
  }

  const handleSampleText = (type: keyof typeof sampleTexts) => {
    setText(sampleTexts[type])
    setResult(null)
    setError(null)
  }

  const analyzeContent = async () => {
    if (!text.trim()) {
      setError("Please enter some text to analyze")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const analysisResult = await analyzeText(text)
      setResult(analysisResult)
    } catch (err) {
      console.error("Analysis error:", err)
      setError("Failed to analyze text. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStatusBadge = () => {
    if (!result) return null

    switch (result.status) {
      case "clean":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Safe
          </span>
        )
      case "flagged":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Flagged
          </span>
        )
      case "blocked":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Blocked
          </span>
        )
      default:
        return null
    }
  }

  const renderAnalysisResult = () => {
    if (!result) return null

    let alertVariant: "default" | "destructive" | null = null
    let icon = null
    let title = ""
    let description = ""

    switch (result.status) {
      case "clean":
        alertVariant = "default"
        icon = <CheckCircle className="h-4 w-4 text-green-500" />
        title = "Content is safe"
        description = "No cyberbullying detected in this text."
        break
      case "flagged":
        alertVariant = "default"
        icon = <AlertTriangle className="h-4 w-4 text-yellow-500" />
        title = "Content may contain cyberbullying"
        description = result.reason || "This content has been flagged for review."
        break
      case "blocked":
        alertVariant = "destructive"
        icon = <AlertCircle className="h-4 w-4" />
        title = "Content blocked"
        description = result.reason || "This content contains cyberbullying and has been blocked."
        break
    }

    return (
      <div className="space-y-4 mt-4">
        <Alert variant={alertVariant || "default"}>
          <div className="flex items-center gap-2">
            {icon}
            <AlertTitle>{title}</AlertTitle>
          </div>
          <AlertDescription>{description}</AlertDescription>
        </Alert>

        <div className="bg-gray-800 rounded-md p-4 text-sm">
          <h4 className="text-gray-300 font-medium mb-2">Analysis Details</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-400">Status:</div>
            <div className="text-white">{getStatusBadge()}</div>

            <div className="text-gray-400">Confidence:</div>
            <div className="text-white">{(result.confidence * 100).toFixed(2)}%</div>

            {result.prediction && (
              <>
                <div className="text-gray-400">Prediction:</div>
                <div className="text-white">{result.prediction}</div>
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-md p-4 text-sm">
          <h4 className="text-gray-300 font-medium mb-2">Technical Details</h4>
          <pre className="text-xs text-gray-300 overflow-auto max-h-40">{JSON.stringify(result, null, 2)}</pre>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSampleText("safe")}
          className="bg-green-900/20 hover:bg-green-900/30 border-green-800"
        >
          Try Safe Example
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSampleText("borderline")}
          className="bg-yellow-900/20 hover:bg-yellow-900/30 border-yellow-800"
        >
          Try Borderline Example
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSampleText("harmful")}
          className="bg-red-900/20 hover:bg-red-900/30 border-red-800"
        >
          Try Harmful Example
        </Button>
      </div>

      <Textarea
        placeholder="Enter text to analyze for cyberbullying content..."
        className="min-h-[120px] bg-gray-800 border-gray-700"
        value={text}
        onChange={handleTextChange}
      />

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={analyzeContent} disabled={isAnalyzing || !text.trim()} className="w-full">
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Text"
        )}
      </Button>

      {renderAnalysisResult()}

      <div className="mt-8 bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">How Our Text Analysis Works</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
          <li>Text is preprocessed to normalize and tokenize the content</li>
          <li>Our NLP model analyzes the text for harmful patterns and language</li>
          <li>The model calculates a confidence score for cyberbullying detection</li>
          <li>Content is classified as safe, flagged, or blocked based on severity</li>
          <li>Detailed analysis results are provided with explanation</li>
        </ol>
      </div>
    </div>
  )
}
