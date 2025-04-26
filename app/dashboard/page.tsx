import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="container py-8">
        <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Flagged Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">342</div>
              <p className="text-xs text-muted-foreground">+4.3% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Blocked Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">-2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">+1.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>The most recent content analyses performed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { type: "Text", content: "This is a sample text...", status: "clean", time: "2 minutes ago" },
                  { type: "Image", content: "profile_pic.jpg", status: "flagged", time: "15 minutes ago" },
                  { type: "Text", content: "Another sample text...", status: "blocked", time: "1 hour ago" },
                  { type: "Image", content: "post_image.png", status: "clean", time: "3 hours ago" },
                  { type: "Text", content: "Yet another text...", status: "clean", time: "5 hours ago" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <div className="font-medium">{item.type} Analysis</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">{item.content}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${
                          item.status === "clean"
                            ? "text-green-500"
                            : item.status === "flagged"
                              ? "text-yellow-500"
                              : "text-red-500"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Type Distribution</CardTitle>
              <CardDescription>Breakdown of analyzed content by type and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm font-medium">Text Content</div>
                    <div className="text-sm text-muted-foreground">742 analyses</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="flex h-2 rounded-full">
                      <div className="h-2 w-[65%] rounded-l-full bg-green-500"></div>
                      <div className="h-2 w-[25%] bg-yellow-500"></div>
                      <div className="h-2 w-[10%] rounded-r-full bg-red-500"></div>
                    </div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <div>65% Clean</div>
                    <div>25% Flagged</div>
                    <div>10% Blocked</div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm font-medium">Image Content</div>
                    <div className="text-sm text-muted-foreground">506 analyses</div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="flex h-2 rounded-full">
                      <div className="h-2 w-[55%] rounded-l-full bg-green-500"></div>
                      <div className="h-2 w-[30%] bg-yellow-500"></div>
                      <div className="h-2 w-[15%] rounded-r-full bg-red-500"></div>
                    </div>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                    <div>55% Clean</div>
                    <div>30% Flagged</div>
                    <div>15% Blocked</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
