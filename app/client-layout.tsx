"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/Theme-Switcher/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { ProtectedRoute } from "@/components/cyberbulling/protected-route";
import { SiteHeader } from "@/components/cyberbulling/site-header";
import { Toaster } from "@/components/ui/toaster";
import { shouldShowNavbar } from "@/config/routes";
import { motion, AnimatePresence } from "framer-motion";

import "@/app/globals.css";
import { FloatingThemeSwitcher } from "@/lib/Theme-Switcher/floating-theme-switcher";
import { EnhancedThemeSwitcher } from "@/lib/Theme-Switcher/enhanced-theme-switcher";

const inter = Inter({ subsets: ["latin"] });

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(false);
  const [pageKey, setPageKey] = useState("");

  useEffect(() => {
    setShowNavbar(shouldShowNavbar(pathname || ""));
    setPageKey(pathname || "");
  }, [pathname]);

  const NoNeedNavAndSidebarPaths = [
    "/",
    "/cyberbulling/welcome",
    "/components",
    "/api-data",
    "/api/documentation",
    "/cyberbulling/login",
    "/cyberbulling/register",
    "/cyberbulling/forgot-password",
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black overflow-auto`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <AuthProvider> */}
          {/* <ProtectedRoute> */}
          {!NoNeedNavAndSidebarPaths.includes(pathname) && <SiteHeader />}
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
          {/* </ProtectedRoute> */}
          <Toaster />
          <FloatingThemeSwitcher />
          <EnhancedThemeSwitcher />
          {/* </AuthProvider> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
