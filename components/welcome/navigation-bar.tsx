"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Shield } from "lucide-react"

interface NavigationItem {
  id: string
  label: string
}

interface NavigationBarProps {
  items: NavigationItem[]
  activeSection: string
  onSectionChange: (sectionId: string) => void
  onLogin: () => void
}

export function NavigationBar({ items, activeSection, onSectionChange, onLogin }: NavigationBarProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-transparent"
      } border-b border-gray-800/50`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="font-bold text-lg">CyberGuard AI</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === item.id ? "text-blue-400" : "text-gray-300 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <Button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}
