"use client"
import { ProtectedRoute } from "@/components/protected-route"
import CreatePostForm from "@/components/create-post-form"

export default function CreatePostPage() {
  return (
    <ProtectedRoute>
      <CreatePostForm />
    </ProtectedRoute>
  )
}
