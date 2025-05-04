"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

export function MainNav() {
  const pathname = usePathname()
  const { userProfile } = useAuth()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/notifications", label: "Notifications" },
    { href: `/profile/${userProfile?.user.username}`, label: "Profile" },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href || (item.href.includes("/profile") && pathname.includes("/profile"))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative text-sm font-medium transition-colors",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {hoveredIndex === index && (
              <motion.span
                layoutId="navHover"
                className="absolute inset-0 z-10 bg-primary/10 rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", bounce: 0.25, duration: 0.3 }}
              />
            )}
            {isActive && (
              <motion.span
                layoutId="navActive"
                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
