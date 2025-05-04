import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PostDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 bg-blue-500 opacity-5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="container max-w-4xl mx-auto py-8 px-4 relative z-10">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Skeleton className="h-8 w-40" />
        </div>

        <Card className="overflow-hidden border border-blue-500/20 bg-black/40 backdrop-blur-xl mb-6">
          <CardHeader className="pb-0">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-[300px] w-full rounded-lg" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Skeleton className="h-[120px] w-full rounded-lg" />
              <Skeleton className="h-[120px] w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-500/20 bg-black/40 backdrop-blur-xl mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>

        <Card className="border border-blue-500/20 bg-black/40 backdrop-blur-xl">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-lg border border-blue-500/20 bg-blue-950/10">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full mt-2" />
                      <Skeleton className="h-4 w-3/4 mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
