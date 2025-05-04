"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { SiteHeader } from "@/components/site-header"
import { Toaster } from "@/components/ui/toaster"
import { shouldShowNavbar } from "@/config/routes"
import { motion, AnimatePresence } from "framer-motion"

import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()
  const [showNavbar, setShowNavbar] = useState(false)
  const [pageKey, setPageKey] = useState("")

  useEffect(() => {
    setShowNavbar(shouldShowNavbar(pathname || ""))
    setPageKey(pathname || "")
  }, [pathname])

  // Special case for welcome page - don't wrap in AuthProvider or ProtectedRoute
  if (pathname === "/welcome") {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    )
  }

  // Special cases for login and register pages - wrap in AuthProvider but not ProtectedRoute
  if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-black`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ProtectedRoute>
              {showNavbar && <SiteHeader />}
              <AnimatePresence mode="wait">
                <motion.div
                  key={pageKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </ProtectedRoute>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
