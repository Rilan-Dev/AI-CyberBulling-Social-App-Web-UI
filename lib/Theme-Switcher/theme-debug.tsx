"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { themes } from "./themes"
import { Button } from "@/components/ui/button"


export default function ThemeDebugPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentClass, setCurrentClass] = useState("")

  // Only show the UI after mounting to avoid hydration errors
  useEffect(() => {
    setMounted(true)
    setCurrentClass(document.documentElement.className)
  }, [])

  // Update the current class when it changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setCurrentClass(document.documentElement.className)
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  const applyThemeDirectly = (themeId: string, className: string) => {
    // Apply the theme class directly to the HTML element
    document.documentElement.className = className
    // Also set it in the theme context
    setTheme(themeId)
  }

  if (!mounted) return null

  return (
    <>
      {/* <Navbar /> */}
      <div className="container py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Theme Debug Panel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p>
                  <strong>Current theme from context:</strong> {theme}
                </p>
                <p>
                  <strong>Current HTML class:</strong> {currentClass}
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Direct Theme Application</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click these buttons to apply themes directly to the HTML element, bypassing any potential issues with
                  the theme provider.
                </p>
                <div className="flex flex-wrap gap-2">
                  {themes.map((t) => (
                    <Button
                      key={t.id}
                      variant={theme === t.id ? "default" : "outline"}
                      onClick={() => applyThemeDirectly(t.id, t.className)}
                    >
                      {t.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Theme Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Buttons</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Cards</h3>
                  <div className="border rounded-md p-4 bg-card text-card-foreground">Card with background</div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Colors</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-10 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
                      Primary
                    </div>
                    <div className="h-10 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center">
                      Secondary
                    </div>
                    <div className="h-10 rounded-md bg-accent text-accent-foreground flex items-center justify-center">
                      Accent
                    </div>
                    <div className="h-10 rounded-md bg-muted text-muted-foreground flex items-center justify-center">
                      Muted
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme CSS Variables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto text-sm">
                <ThemeVariableDisplay />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

function ThemeVariableDisplay() {
  const [cssVars, setCssVars] = useState<{ name: string; value: string }[]>([])

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement)
    const variables: { name: string; value: string }[] = []

    // Get all CSS variables that start with --
    for (let i = 0; i < rootStyles.length; i++) {
      const prop = rootStyles[i]
      if (prop.startsWith("--")) {
        variables.push({
          name: prop,
          value: rootStyles.getPropertyValue(prop),
        })
      }
    }

    setCssVars(variables)
  }, [])

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
      {cssVars.map((v) => (
        <React.Fragment key={v.name}>
          <div className="font-mono text-xs">{v.name}</div>
          <div className="font-mono text-xs">{v.value}</div>
        </React.Fragment>
      ))}
    </div>
  )
}
