import { PostFeed } from "@/components/post-feed"

export default function Home() {
  return (
    <>
      <main className="container py-6 md:py-10">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xl">
            <PostFeed />
          </div>
        </div>
      </main>
    </>
  )
}
