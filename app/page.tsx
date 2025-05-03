import { PostFeed } from "@/components/post-feed"
import { ProtectedRoute } from "@/components/protected-route"

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="container py-6 md:py-10">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl">
            <PostFeed />
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}
