"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { CustomDropdown, CustomDropdownItem } from "@/components/ui/custom-dropdown"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <CustomDropdown
      trigger={
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      }
      align="right"
    >
      <CustomDropdownItem onClick={() => setTheme("light")}>Light</CustomDropdownItem>
      <CustomDropdownItem onClick={() => setTheme("dark")}>Dark</CustomDropdownItem>
      <CustomDropdownItem onClick={() => setTheme("system")}>System</CustomDropdownItem>
    </CustomDropdown>
  )
}
