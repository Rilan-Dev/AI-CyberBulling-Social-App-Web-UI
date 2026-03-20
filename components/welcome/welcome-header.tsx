import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/rendering-components/mode-toggle"
import { Shield } from "lucide-react"

export function WelcomeHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <Link href="/" className="font-bold text-white">
              CyberGuard AI
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-6">
              <Link href="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-sm text-gray-300 hover:text-white transition-colors">
                Register
              </Link>
            </nav>

            <ModeToggle />

            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
