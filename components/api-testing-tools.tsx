"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertCircle, CheckCircle, Send, Upload, X } from "lucide-react"
import * as apiService from "@/services/api"
import Image from "next/image"

export function ApiTestingTools() {
  const [endpoint, setEndpoint] = useState("/api/analyze-text")
  const [method, setMethod] = useState("POST")
  const [contentType, setContentType] = useState("application/json")
  const [requestBody, setRequestBody] = useState('{\n  "text": "This is a test text for analysis"\n}')
  const [authToken, setAuthToken] = useState("")
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSendRequest = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      // Set auth token if provided
      if (authToken) {
        localStorage.setItem("accessToken", authToken.replace("Bearer ", ""))
      }

      let result

      // Handle different endpoints
      if (endpoint === "/api/analyze-text" || endpoint.includes("/analyze-text")) {
        const textData = JSON.parse(requestBody)
        result = await apiService.analyzeText(textData.text)
      } else if (endpoint === "/api/analyze-image" || endpoint.includes("/analyze-image")) {
        if (!image) {
          throw new Error("Image is required for image analysis")
        }
        result = await apiService.analyzeImage(image)
      } else if (endpoint === "/api/token/" || endpoint.includes("/token")) {
        const { username, password } = JSON.parse(requestBody)
        result = await apiService.login(username, password)
      } else if (endpoint === "/api/users/register/" || endpoint.includes("/users/register")) {
        const userData = JSON.parse(requestBody)
        result = await apiService.register(userData)
      } else if (endpoint === "/api/users/me/" || endpoint.includes("/users/me")) {
        result = await apiService.getCurrentUser()
      } else if (endpoint === "/api/posts" || endpoint.includes("/posts")) {
        if (method === "GET") {
          result = await apiService.getPosts()
        } else if (method === "POST") {
          if (contentType === "application/json") {
            const postData = JSON.parse(requestBody)
            result = await apiService.createPost(postData)
          } else {
            // Handle multipart/form-data
            const formData = new FormData()
            const postData = JSON.parse(requestBody)

            // Add text fields
            for (const key in postData) {
              if (key !== "image") {
                formData.append(key, postData[key])
              }
            }

            // Add image if available
            if (image) {
              formData.append("image", image)
            }

            result = await apiService.createPost(formData)
          }
        }
      } else if (endpoint.includes("/posts/") && endpoint.includes("/like")) {
        const postId = endpoint.split("/posts/")[1].split("/like")[0]
        result = await apiService.likePost(postId)
      } else if (endpoint === "/api/comments" || endpoint.includes("/comments")) {
        if (method === "POST") {
          const { post, content } = JSON.parse(requestBody)
          result = await apiService.addComment(post, content)
        }
      } else {
        throw new Error("Endpoint not supported in this testing tool")
      }

      setResponse(result)
    } catch (err: any) {
      console.error("API request error:", err)
      setError(err.message || "An error occurred while sending the request")
    } finally {
      setLoading(false)
    }
  }

  const predefinedEndpoints = [
    { value: "/api/analyze-text", label: "Analyze Text" },
    { value: "/api/analyze-image", label: "Analyze Image" },
    { value: "/api/token/", label: "Login (Get Token)" },
    { value: "/api/users/register/", label: "Register User" },
    { value: "/api/users/me/", label: "Get Current User" },
    { value: "/api/posts", label: "Get/Create Posts" },
    { value: "/api/comments", label: "Create Comment" },
  ]

  const handleEndpointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEndpoint = e.target.value
    setEndpoint(selectedEndpoint)

    // Set default values based on endpoint
    if (selectedEndpoint === "/api/analyze-text") {
      setMethod("POST")
      setContentType("application/json")
      setRequestBody('{\n  "text": "This is a test text for analysis"\n}')
    } else if (selectedEndpoint === "/api/analyze-image") {
      setMethod("POST")
      setContentType("multipart/form-data")
      setRequestBody("{}")
    } else if (selectedEndpoint === "/api/token/") {
      setMethod("POST")
      setContentType("application/json")
      setRequestBody('{\n  "username": "testuser",\n  "password": "password123"\n}')
    } else if (selectedEndpoint === "/api/users/register/") {
      setMethod("POST")
      setContentType("application/json")
      setRequestBody(
        '{\n  "username": "newuser",\n  "email": "newuser@example.com",\n  "password": "password123",\n  "password2": "password123",\n  "first_name": "New",\n  "last_name": "User"\n}',
      )
    } else if (selectedEndpoint === "/api/users/me/") {
      setMethod("GET")
      setContentType("application/json")
      setRequestBody("{}")
    } else if (selectedEndpoint === "/api/posts") {
      if (method === "GET") {
        setRequestBody("{}")
      } else {
        setContentType("multipart/form-data")
        setRequestBody('{\n  "content": "This is a test post"\n}')
      }
    } else if (selectedEndpoint === "/api/comments") {
      setMethod("POST")
      setContentType("application/json")
      setRequestBody('{\n  "post": "1",\n  "content": "This is a test comment"\n}')
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">API Testing Tools</h1>
      <p className="mb-6 text-muted-foreground">
        Use these tools to test the Cyberbullying Prediction API endpoints directly from your browser.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Request</CardTitle>
            <CardDescription>Configure your API request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="endpoint">Endpoint</Label>
                <select
                  id="endpoint"
                  value={endpoint}
                  onChange={handleEndpointChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {predefinedEndpoints.map((ep) => (
                    <option key={ep.value} value={ep.value}>
                      {ep.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="method">Method</Label>
                <select
                  id="method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="content-type">Content Type</Label>
              <select
                id="content-type"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="application/json">application/json</option>
                <option value="multipart/form-data">multipart/form-data</option>
              </select>
            </div>

            <div>
              <Label htmlFor="auth-token">Authorization Token (Optional)</Label>
              <Input
                id="auth-token"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
              />
            </div>

            {(endpoint === "/api/analyze-image" ||
              (endpoint === "/api/posts" && method === "POST" && contentType === "multipart/form-data")) && (
              <div>
                <Label>Image Upload</Label>
                <div
                  className={`mt-2 flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors ${
                    imagePreview ? "border-primary" : "border-gray-300 hover:border-primary"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="mx-auto max-h-[200px] w-auto rounded-lg object-contain"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-0 top-0 h-8 w-8 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation()
                          resetImage()
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mb-2 h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload an image</p>
                    </>
                  )}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="request-body">Request Body</Label>
              <Textarea
                id="request-body"
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                placeholder="Enter request body in JSON format"
                className="font-mono text-sm"
                rows={10}
              />
            </div>

            <Button onClick={handleSendRequest} disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Request"}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>API response will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {response && (
              <div className="space-y-4">
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-700 dark:text-green-300">Request Successful</AlertTitle>
                  <AlertDescription className="text-green-600 dark:text-green-400">
                    The API request was successful.
                  </AlertDescription>
                </Alert>

                <div>
                  <h4 className="font-medium mb-2">Response Body</h4>
                  <div className="bg-muted p-3 rounded-md overflow-auto max-h-96">
                    <pre className="text-xs font-mono">{JSON.stringify(response, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && !response && (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <InfoIcon className="h-12 w-12 mb-4" />
                <p>Send a request to see the response</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
