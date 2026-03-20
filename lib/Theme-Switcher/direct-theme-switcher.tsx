"use client"

import { useState } from "react"
import { themes } from "./themes"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"


export default function DirectThemeSwitcherPage() {
  const [activeTheme, setActiveTheme] = useState(() => {
    // Try to get the current theme class
    if (typeof document !== "undefined") {
      const htmlClass = document.documentElement.className
      const matchedTheme = themes.find((t) => htmlClass.includes(t.className))
      return matchedTheme?.id || "default"
    }
    return "default"
  })

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId)
    if (!theme) return

    // Apply the theme class directly to the HTML element
    document.documentElement.className = theme.className

    // Store in localStorage for persistence
    localStorage.setItem("theme", themeId)

    // Update state
    setActiveTheme(themeId)
  }

  return (
    <>
      {/* <Navbar /> */}
      <div className="container py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Direct Theme Switcher</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="mb-4">
                  This page applies themes directly to the HTML element, bypassing the theme provider. Click on any
                  theme below to apply it immediately:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {themes.map((theme) => (
                    <Button
                      key={theme.id}
                      variant={activeTheme === theme.id ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => applyTheme(theme.id)}
                    >
                      <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: theme.primaryColor }} />
                      {theme.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Theme Preview</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button>Primary Button</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-md bg-card text-card-foreground border">Card Background</div>
                    <div className="p-4 rounded-md bg-primary text-primary-foreground">Primary Background</div>
                  </div>

                  <div className="p-4 rounded-md bg-muted">
                    <p className="text-foreground">Text Foreground</p>
                    <p className="text-muted-foreground">Muted Text</p>
                    <p className="text-primary">Primary Text</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Current Theme Information</h3>
                <div className="text-sm">
                  <p>
                    <strong>Active Theme:</strong> {themes.find((t) => t.id === activeTheme)?.name || "Unknown"}
                  </p>
                  <p>
                    <strong>Theme ID:</strong> {activeTheme}
                  </p>
                  <p>
                    <strong>Theme Class:</strong> {themes.find((t) => t.id === activeTheme)?.className || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
