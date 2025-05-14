
import { Post } from "@/Model/post.model"
import { API_PATHS } from "./api-endpoints"
import { apiService } from "./api.service"
import { apiLogger } from "./api-logger"
import { AnalysisResult } from "@/Model/cyberbulling.model"

export class AnalysisService {
  // Analyze text
  async analyzeText(text: string): Promise<AnalysisResult> {
    apiLogger.logRequest(API_PATHS.ANALYZE_TEXT, "POST", null, { text })

    try {
      const response = await apiService.create<AnalysisResult>({
        endpoint: API_PATHS.ANALYZE_TEXT,
        body: { text },
      })

      if (!response.success || !response.data) {
        throw new Error("Failed to analyze text. Please try again.")
      }

      apiLogger.logResponse(API_PATHS.ANALYZE_TEXT, "POST", 200, response.data)
      return response.data
    } catch (error) {
      apiLogger.logError(API_PATHS.ANALYZE_TEXT, "POST", error)
      throw error
    }
  }

  // Analyze image
  async analyzeImage(image: File, imagePath?: string): Promise<any> {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append("image", image)
    const pathToCheck = imagePath || image.name || ""
    const lowerPath = pathToCheck.toLowerCase()

    if (imagePath === "nsfw" || lowerPath.includes("nsfw") || lowerPath.includes("hot") || lowerPath.includes("sexy")) {
      formData.append("model_path", "nsfw")
      apiLogger.logRequest(API_PATHS.ANALYZE_IMAGE, "POST", null, { 
        image: "[File]", 
        model_path: "nsfw",
      })
    } else {
      apiLogger.logRequest(API_PATHS.ANALYZE_IMAGE, "POST", null, { 
        image: "[File]",
        imagePath: imagePath || "No path provided" 
      })
    }

    console.log("FormData:", formData)
    console.log("FormData keys:", Array.from(formData.keys()))

    try {
      const response = await apiService.create({
        endpoint: API_PATHS.ANALYZE_IMAGE,
        body: formData,
        // Don't set Content-Type header for FormData - browser will set it with boundary
      })

      if (!response.success || !response.data) {
        return Promise.reject(`Failed to analyze image: ${response.error || response.rawResponse?.statusText || "Unknown error"}`)
      }

      apiLogger.logResponse(API_PATHS.ANALYZE_IMAGE, "POST", 200, response.data)
      return response.data
    } catch (error) {
      apiLogger.logError(API_PATHS.ANALYZE_IMAGE, "POST", error)
      throw error
    }
  }
}

export const analysisService = new AnalysisService()
