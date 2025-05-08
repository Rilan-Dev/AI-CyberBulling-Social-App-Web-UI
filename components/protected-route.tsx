"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"
import { isProtectedRoute } from "@/config/routes"
import { PostProvider } from "@/context/post-context"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only check authentication for protected routes
    if (!loading && !isAuthenticated && isProtectedRoute(pathname)) {
      // Redirect to login with the current path as the redirect parameter
      router.push(`/welcome?redirect=${encodeURIComponent(pathname || "/")}`)
    }
  }, [isAuthenticated, loading, router, pathname])

  // Show loading state while checking authentication
  if (loading && isProtectedRoute(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If authenticated or not a protected route, render children
  if (isAuthenticated || !isProtectedRoute(pathname)) {
    return <PostProvider>{children}</PostProvider>
  }

  // Return null while redirecting
  return null
}
