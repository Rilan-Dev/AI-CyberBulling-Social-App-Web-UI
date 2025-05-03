"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { PostProvider } from "@/context/post-context"
import { AuthProvider } from "@/context/auth-context"
import { usePathname } from "next/navigation"
import { isPublicRoute } from "@/config/routes"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Check if current path is a public route (login, register, etc.)
  const isAuthPage = isPublicRoute(pathname)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <PostProvider>
              <div className="relative min-h-screen flex flex-col">
                {/* Only render SiteHeader if not on public auth pages */}
                {!isAuthPage && <SiteHeader />}
                <div className="flex-1">{children}</div>
              </div>
            </PostProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
