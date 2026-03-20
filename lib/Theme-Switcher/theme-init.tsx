"use client"

import { useTheme } from "next-themes"
import { useEffect } from "react"

export function ThemeInitializer() {
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    // Remove no-transition class after initial load
    const timer = setTimeout(() => {
      document.body.classList.remove("no-transition")
    }, 300)

    // Force theme application on initial load
    if (theme) {
      const themeMap: Record<string, string> = {
        default: "theme-default",
        dark: "dark",
        corporate: "theme-corporate",
        elegant: "theme-elegant",
        tech: "theme-tech",
        warm: "theme-warm",
        "royal-blue": "theme-royal-blue",
        "sky-blue-dark": "theme-sky-blue-dark",
      }

      // Ensure the theme class is applied to the HTML element
      document.documentElement.classList.forEach(cls => {
        if (Object.values(themeMap).includes(cls) && cls !== themeMap[theme]) {
          document.documentElement.classList.remove(cls)
        }
      })

      if (themeMap[theme] && !document.documentElement.classList.contains(themeMap[theme])) {
        document.documentElement.classList.add(themeMap[theme])
      }

      console.log("Theme initialized:", theme, "Class:", themeMap[theme])
    }

    return () => {
      clearTimeout(timer)
    }
  }, [theme, resolvedTheme])

  return null
}
