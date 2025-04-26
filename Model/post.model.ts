import type { User } from "./users.model"

export interface Comment {
  id: number
  post: number
  user: User
  content: string
  status: "clean" | "flagged" | "blocked"
  reason: string | null
  confidence: number
  created_at: string
}

export interface Post {
  id: number
  user: User
  content: string
  image: string | null
  status: "clean" | "flagged" | "blocked"
  reason: string | null
  confidence: number
  like_count: number
  is_liked: boolean
  comments: Comment[]
  created_at: string
  text_analysis: TextAnalysis | null
  image_analysis: ImageAnalysis | null
}


export interface TextAnalysis {
  success: boolean
  prediction: string
  status: string
  confidence: number
  reason: string | null
  processed_text: string
}

export interface ImageAnalysis {
  success: boolean
  prediction: string
  status: string
  confidence: number
  reason: string | null
  filename: string
}