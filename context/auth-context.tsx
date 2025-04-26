"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { UserProfile } from "@/Model/users.model"
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser as apiGetCurrentUser,
} from "@/services/api"

interface AuthContextType {
  userProfile: UserProfile | null
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
  isAuthenticated: boolean
}

interface RegisterData {
  username: string
  email: string
  password: string
  first_name?: string
  last_name?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem("accessToken")
        if (!token && process.env.NODE_ENV !== "development") {
          setLoading(false)
          return
        }

        const userData = await apiGetCurrentUser()
        if (userData) {
          setUserProfile(userData)
        }
      } catch (err) {
        console.error("Error checking auth status:", err)
        // Don't set an error here, just continue with null user
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Redirect to login if accessing protected route while not authenticated
  useEffect(() => {
    // Only apply route protection if not in development mode
    if (process.env.NODE_ENV === "production") {
      const protectedRoutes = ["/create-post", "/settings", "/dashboard"]
      const publicRoutes = ["/login", "/register", "/forgot-password"]

      if (!loading) {
        if (!userProfile && protectedRoutes.some((route) => pathname?.startsWith(route))) {
          router.push(`/login?redirect=${encodeURIComponent(pathname || "/")}`)
        } else if (userProfile && publicRoutes.includes(pathname || "")) {
          router.push("/")
        }
      }
    } else {
      // In development, don't redirect but still mark as not loading
      if (loading) {
        setLoading(false)
      }
    }
  }, [userProfile, loading, pathname, router])

  const login = async (username: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      await apiLogin(username, password)
      const userData = await apiGetCurrentUser()
      setUserProfile(userData)

      // Redirect to home or the original requested page
      const params = new URLSearchParams(window.location.search)
      const redirectPath = params.get("redirect") || "/"
      router.push(redirectPath)
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.response?.data?.detail || "Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setLoading(true)
    setError(null)

    try {
      await apiRegister(userData)
      // After registration, log the user in
      await login(userData.username, userData.password)
    } catch (err: any) {
      console.error("Registration error:", err)
      if (err.response?.data) {
        // Format Django REST Framework validation errors
        const errors = err.response.data
        const errorMessages = Object.entries(errors)
          .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
          .join("; ")
        setError(errorMessages)
      } else {
        setError("Registration failed. Please try again.")
      }
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)

    try {
      await apiLogout()
      setUserProfile(null)
      router.push("/login")
    } catch (err) {
      console.error("Logout error:", err)
      // Even if there's an error, clear the user state
      setUserProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        loading,
        error,
        login,
        register,
        logout,
        clearError,
        isAuthenticated: !!userProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
