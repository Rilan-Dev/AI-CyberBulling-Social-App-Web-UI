import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="font-bold text-lg">CyberGuard AI</span>
          </div>

          <div className="text-center md:text-right text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Cyberbullying Prediction AI</p>
            <p>Raak College of Engineering and Technology</p>
            <p>Puducherry - 605110</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
