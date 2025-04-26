import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { PostProvider } from "@/context/post-context"
import { AuthProvider } from "@/context/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cyberbullying Prediction Social",
  description: "Social media platform with AI-powered cyberbullying detection",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <PostProvider>
              <div className="relative min-h-screen flex flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
              </div>
            </PostProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
