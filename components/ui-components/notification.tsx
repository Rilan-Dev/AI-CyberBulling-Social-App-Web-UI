"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export interface NotificationProps {
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  duration?: number
  onClose: () => void
}

export function Notification({ type, title, message, duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
  }

  const colors = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  }

  const iconColors = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
    warning: "text-yellow-500",
  }

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 max-w-md rounded-lg border p-4 shadow-md transition-all duration-300",
        colors[type],
        {
          "opacity-100 translate-y-0": isVisible,
          "opacity-0 translate-y-[-20px]": !isVisible,
        },
      )}
      role="alert"
    >
      <div className="flex items-start">
        <div className={cn("mr-3 flex-shrink-0", iconColors[type])}>{icons[type]}</div>
        <div className="flex-1">
          <h3 className="mb-1 font-medium">{title}</h3>
          <div className="text-sm">{message}</div>
        </div>
        <button
          type="button"
          className="ml-4 inline-flex flex-shrink-0 items-center justify-center rounded-md p-1 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  )
}
