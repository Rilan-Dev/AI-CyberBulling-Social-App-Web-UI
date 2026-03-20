"use client"
import { ProtectedRoute } from "@/components/cyberbulling/protected-route"
import CreatePostForm from "@/components/cyberbulling/create-post-form"

export default function CreatePostPage() {
  return (
    <ProtectedRoute>
      <CreatePostForm />
    </ProtectedRoute>
  )
}
