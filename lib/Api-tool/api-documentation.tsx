"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { InfoIcon, AlertCircle } from "lucide-react"
import { apiDocs } from "@/lib/Api-tool/api-docs"

export function ApiDocumentation() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)

  const renderEndpoint = (endpoint: any) => {
    return (
      <Card
        id={endpoint.path}
        key={endpoint.path}
        className="mb-4 cursor-pointer hover:border-primary transition-colors"
        onClick={() => setSelectedEndpoint(endpoint.path === selectedEndpoint ? null : endpoint.path)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  endpoint.method === "GET"
                    ? "default"
                    : endpoint.method === "POST"
                      ? "outline"
                      : endpoint.method === "PUT"
                        ? "secondary"
                        : "destructive"
                }
              >
                {endpoint.method}
              </Badge>
              <CardTitle className="text-md">{endpoint.path}</CardTitle>
            </div>
          </div>
          <CardDescription>{endpoint.description}</CardDescription>
        </CardHeader>
        {selectedEndpoint === endpoint.path && (
          <CardContent>
            <div className="space-y-4">
              {endpoint.authentication && (
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Authentication Required</AlertTitle>
                  <AlertDescription>
                    This endpoint requires a valid JWT token in the Authorization header.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h4 className="font-medium mb-2">Request</h4>
                {endpoint.request.contentType && (
                  <p className="text-sm text-muted-foreground mb-2">Content-Type: {endpoint.request.contentType}</p>
                )}
                {endpoint.request.body && (
                  <div className="bg-muted p-3 rounded-md overflow-auto max-h-60">
                    <pre className="text-xs">{JSON.stringify(endpoint.request.body, null, 2)}</pre>
                  </div>
                )}
                {endpoint.request.params && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Parameters:</p>
                    <ul className="list-disc list-inside text-sm">
                      {Object.entries(endpoint.request.params).map(([key, value]: [string, any]) => (
                        <li key={key}>
                          <span className="font-mono">{key}</span>: {value.description}
                          {value.required && <span className="text-red-500 ml-1">(Required)</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Response</h4>
                <p className="text-sm text-muted-foreground mb-2">Status: {endpoint.response.status}</p>
                <div className="bg-muted p-3 rounded-md overflow-auto max-h-60">
                  <pre className="text-xs">{JSON.stringify(endpoint.response.body, null, 2)}</pre>
                </div>
              </div>

              {endpoint.errors && endpoint.errors.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Possible Errors</h4>
                  <div className="space-y-2">
                    {endpoint.errors.map((error: any, index: number) => (
                      <Alert key={index} variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>
                          {error.status} - {error.title}
                        </AlertTitle>
                        <AlertDescription>{error.description}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {endpoint.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm">{endpoint.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <p className="mb-6 text-muted-foreground">
        This documentation provides details about the Cyberbullying Prediction API endpoints, request/response formats,
        and error handling.
      </p>

      <Tabs defaultValue="authentication">
        <TabsList className="mb-4">
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Authentication Endpoints</h2>
            <p className="text-muted-foreground">
              These endpoints handle user registration, login, and token management.
            </p>
          </div>
          {apiDocs.authentication.map(renderEndpoint)}
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Posts Endpoints</h2>
            <p className="text-muted-foreground">
              These endpoints handle creating, reading, updating, and deleting posts.
            </p>
          </div>
          {apiDocs.posts.map(renderEndpoint)}
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Comments Endpoints</h2>
            <p className="text-muted-foreground">
              These endpoints handle creating, reading, updating, and deleting comments.
            </p>
          </div>
          {apiDocs.comments.map(renderEndpoint)}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Analysis Endpoints</h2>
            <p className="text-muted-foreground">
              These endpoints handle text and image analysis for cyberbullying detection.
            </p>
          </div>
          {apiDocs.analysis.map(renderEndpoint)}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">User Endpoints</h2>
            <p className="text-muted-foreground">These endpoints handle user profile management.</p>
          </div>
          {apiDocs.users.map(renderEndpoint)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
