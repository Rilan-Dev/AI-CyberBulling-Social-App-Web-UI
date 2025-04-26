export interface AnalysisResult {
  status: "clean" | "flagged" | "blocked",
  confidence: number
  processed_text: string
  prediction: "humour" | "negative" | "offensive"
  reason: string | null
  success: boolean
  filename: string | null
}