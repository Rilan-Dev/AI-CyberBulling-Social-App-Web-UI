import { z } from "zod"

// User schema
export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

// Comment schema
export const CommentSchema = z.object({
  id: z.number(),
  post: z.number(),
  user: UserSchema,
  content: z.string(),
  status: z.string(),
  reason: z.string().nullable(),
  confidence: z.number(),
  created_at: z.string(),
})

// Text analysis schema
export const TextAnalysisSchema = z.object({
  success: z.boolean(),
  prediction: z.string(),
  status: z.string(),
  confidence: z.number(),
  reason: z.string().nullable(),
  processed_text: z.string(),
})

// Image analysis schema
export const ImageAnalysisSchema = z.object({
  success: z.boolean(),
  prediction: z.string(),
  status: z.string(),
  confidence: z.number(),
  reason: z.string().nullable(),
  filename: z.string(),
})

// Post schema
export const PostSchema = z.object({
  id: z.number(),
  user: UserSchema,
  content: z.string(),
  image: z.string().nullable(),
  status: z.string(),
  reason: z.string().nullable(),
  confidence: z.number(),
  like_count: z.number(),
  is_liked: z.boolean(),
  comments: z.array(CommentSchema),
  created_at: z.string(),
  text_analysis: TextAnalysisSchema.nullable(),
  image_analysis: ImageAnalysisSchema.nullable(),
})

// API response schema for posts
export const PostsResponseSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(PostSchema),
})

// Function to validate API response
export function validateApiResponse<T>(data: unknown, schema: z.ZodType<T>): T {
  try {
    return schema.parse(data)
  } catch (error) {
    console.error("API response validation error:", error)
    throw new Error("Invalid API response format")
  }
}
