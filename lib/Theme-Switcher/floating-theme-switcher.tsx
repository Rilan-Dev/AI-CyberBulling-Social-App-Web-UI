"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Check, Palette, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { themes } from "./themes"

export function FloatingThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-background border rounded-lg shadow-lg p-4 w-[280px]">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Select Theme</h3>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
            {themes.map((t) => {
              const isGradientTheme = t.id === "royal-blue" || t.id === "sky-blue-dark"

              return (
                <button
                  key={t.id}
                  className={cn(
                    "flex flex-col items-center p-2 rounded border text-center text-xs hover:border-primary relative",
                    theme === t.id && "border-primary bg-primary/5",
                    isGradientTheme && "overflow-hidden",
                  )}
                  onClick={() => {
                    setTheme(t.id)
                  }}
                >
                  {isGradientTheme && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] px-1 rotate-12 translate-x-2 -translate-y-1 font-medium">
                      Gradient
                    </div>
                  )}
                  <div
                    className={cn(
                      "w-full h-12 rounded mb-1",
                      isGradientTheme && t.id === "royal-blue" && "bg-gradient-to-b from-[#0288d1] to-[#01579b]",
                      isGradientTheme && t.id === "sky-blue-dark" && "bg-gradient-to-br from-[#1c313a] to-[#0f2027]",
                      !isGradientTheme && { backgroundColor: t.backgroundPreview },
                    )}
                  >
                    {!isGradientTheme && (
                      <div className="w-full h-3 rounded-t" style={{ backgroundColor: t.primaryColor }}></div>
                    )}
                  </div>
                  <span className="font-medium">{t.name}</span>
                  {theme === t.id && <Check className="h-3 w-3 mt-1" />}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className={cn(
            "rounded-full h-12 w-12 shadow-lg",
            theme === "royal-blue" &&
              "bg-gradient-to-b from-[#0288d1] to-[#01579b] hover:from-[#039be5] hover:to-[#0277bd]",
            theme === "sky-blue-dark" &&
              "bg-gradient-to-br from-[#90CAF9] to-[#82B1FF] hover:from-[#82B1FF] hover:to-[#90CAF9]",
          )}
          aria-label="Open theme switcher"
        >
          <Palette className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}
