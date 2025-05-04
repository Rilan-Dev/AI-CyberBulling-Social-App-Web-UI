"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MainNav } from "@/components/main-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { AuthStatus } from "@/components/auth-status"
import { cn } from "@/lib/utils"
import { Shield } from "lucide-react"

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isWelcomePage = pathname === "/welcome"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200 px-5",
        scrolled ? "bg-background/80 backdrop-blur-lg border-b shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div whileHover={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.5 }}>
              <Shield className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="inline-block font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              CyberSocial
            </span>
          </Link>
          {!isWelcomePage && <MainNav />}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <AuthStatus />
            <ModeToggle />
          </nav>
        </div>
      </div>
    </motion.header>
  )
}
