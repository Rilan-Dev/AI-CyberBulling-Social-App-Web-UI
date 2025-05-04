import { CheckCircle } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface TechContentProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  color: string
}

export function TechContent({ icon: Icon, title, description, features, color }: TechContentProps) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-900/20 text-blue-400",
    purple: "bg-purple-900/20 text-purple-400",
    green: "bg-green-900/20 text-green-400",
    yellow: "bg-yellow-900/20 text-yellow-400",
    teal: "bg-teal-900/20 text-teal-400",
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className={`p-4 rounded-lg ${colorMap[color]} mb-4 w-fit`}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
      <div className="md:col-span-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
