import type React from "react";
import { AuthProvider } from "@/context/auth-context";
import { PostProvider } from "@/context/post-context";
import "./globals.css";
import { ThemeProvider } from "@/lib/Theme-Switcher/theme-provider";
import { ThemeInitializer } from "@/lib/Theme-Switcher/theme-init";
import { Metadata } from "next";
import { FloatingThemeSwitcher } from "@/lib/Theme-Switcher/floating-theme-switcher";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="no-transition">
        <ThemeProvider>
          <ThemeInitializer />
          {/* <LocaleProvider defaultLocale="en">
            <AuthProvider> */}
          <AuthProvider>
            <PostProvider>
              {children}
              {/* <IdleTimer />
              <ToastContainer /> */}
              <Toaster />
              <FloatingThemeSwitcher />
              {/* {process.env.NODE_ENV !== "production" && <ThemeDebug />} */}
              {/* </AuthProvider>
          </LocaleProvider> */}
            </PostProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Root Layout - Next.js UI Component Library",
  description: "Root Layout for the Next.js UI Component Library",
};
