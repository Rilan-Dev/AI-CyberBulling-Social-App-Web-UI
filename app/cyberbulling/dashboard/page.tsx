"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/cyberbulling/site-header"
import { ProtectedRoute } from "@/components/cyberbulling/protected-route"
import { LineChart, BarChart, PieChart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function DashboardPage() {
  const [selectedChart, setSelectedChart] = useState("line")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
        <div className="container py-8">
          <motion.div initial="hidden" animate="visible" variants={container} className="space-y-8">
            <motion.div variants={fadeIn}>
              <h1 className="mb-2 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
                Dashboard
              </h1>
              <p className="text-muted-foreground">Monitor your content analysis metrics and performance.</p>
            </motion.div>

            <motion.div variants={container} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Total Analyses", value: "1,248", change: "+12.5%", color: "from-blue-500 to-indigo-500" },
                { title: "Flagged Content", value: "342", change: "+4.3%", color: "from-amber-500 to-orange-500" },
                { title: "Blocked Content", value: "156", change: "-2.1%", color: "from-red-500 to-pink-500" },
                { title: "Model Accuracy", value: "94.2%", change: "+1.2%", color: "from-emerald-500 to-green-500" },
              ].map((stat, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}
                      >
                        {stat.value}
                      </div>
                      <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeIn} className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2 border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Analysis Trends</CardTitle>
                    <CardDescription>Content analysis over time</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={selectedChart === "line" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setSelectedChart("line")}
                      className="h-8 w-8"
                    >
                      <LineChart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedChart === "bar" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setSelectedChart("bar")}
                      className="h-8 w-8"
                    >
                      <BarChart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={selectedChart === "pie" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setSelectedChart("pie")}
                      className="h-8 w-8"
                    >
                      <PieChart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {isLoaded ? (
                      <div className="relative h-full w-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-full w-full rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4">
                            <div className="h-full w-full rounded-md border border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-center">
                              <p className="text-muted-foreground">Chart visualization would appear here</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full w-full animate-pulse rounded-md bg-muted"></div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Content Distribution</CardTitle>
                  <CardDescription>Analysis by content type</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="text" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="text">Text</TabsTrigger>
                      <TabsTrigger value="image">Image</TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Text Content</div>
                          <div className="text-sm text-muted-foreground">742 analyses</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="flex h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          >
                            <motion.div
                              className="h-2 rounded-l-full bg-green-500"
                              initial={{ width: 0 }}
                              animate={{ width: "65%" }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            ></motion.div>
                            <motion.div
                              className="h-2 bg-yellow-500"
                              initial={{ width: 0 }}
                              animate={{ width: "25%" }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                            ></motion.div>
                            <motion.div
                              className="h-2 rounded-r-full bg-red-500"
                              initial={{ width: 0 }}
                              animate={{ width: "10%" }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                            ></motion.div>
                          </motion.div>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                          <div>65% Clean</div>
                          <div>25% Flagged</div>
                          <div>10% Blocked</div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="image" className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Image Content</div>
                          <div className="text-sm text-muted-foreground">506 analyses</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="flex h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          >
                            <motion.div
                              className="h-2 rounded-l-full bg-green-500"
                              initial={{ width: 0 }}
                              animate={{ width: "55%" }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                            ></motion.div>
                            <motion.div
                              className="h-2 bg-yellow-500"
                              initial={{ width: 0 }}
                              animate={{ width: "30%" }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                            ></motion.div>
                            <motion.div
                              className="h-2 rounded-r-full bg-red-500"
                              initial={{ width: 0 }}
                              animate={{ width: "15%" }}
                              transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                            ></motion.div>
                          </motion.div>
                        </div>
                        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                          <div>55% Clean</div>
                          <div>30% Flagged</div>
                          <div>15% Blocked</div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeIn}>
              <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Analyses</CardTitle>
                  <CardDescription>The most recent content analyses performed</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div variants={container} initial="hidden" animate="visible" className="space-y-4">
                    {[
                      { type: "Text", content: "This is a sample text...", status: "clean", time: "2 minutes ago" },
                      { type: "Image", content: "profile_pic.jpg", status: "flagged", time: "15 minutes ago" },
                      { type: "Text", content: "Another sample text...", status: "blocked", time: "1 hour ago" },
                      { type: "Image", content: "post_image.png", status: "clean", time: "3 hours ago" },
                      { type: "Text", content: "Yet another text...", status: "clean", time: "5 hours ago" },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        variants={fadeIn}
                        className="flex items-center justify-between border-b pb-2 hover:bg-muted/20 p-2 rounded-md transition-colors"
                      >
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
                      </motion.div>
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
