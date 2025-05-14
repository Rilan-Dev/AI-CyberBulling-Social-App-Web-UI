"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  length?: number
  error?: string
}

export function OtpInput({ value, onChange, length = 6, error }: OtpInputProps) {
  const [activeInput, setActiveInput] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = Array(length)
      .fill(null)
      .map((_, i) => inputRefs.current[i] || null)
  }, [length])

  // Focus the first empty input or the last input
  useEffect(() => {
    const indexToFocus = value.length < length ? value.length : length - 1
    setActiveInput(indexToFocus)
    inputRefs.current[indexToFocus]?.focus()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value

    // Only accept numbers
    if (!/^\d*$/.test(newValue)) return

    // Handle paste
    if (newValue.length > 1) {
      // If pasting multiple characters, distribute them across inputs
      const pastedValue = newValue.slice(0, length)
      onChange(pastedValue.padEnd(value.length, value.slice(pastedValue.length)))

      // Focus the next empty input or the last input
      const nextIndex = Math.min(pastedValue.length, length - 1)
      setActiveInput(nextIndex)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    // Update the value
    const newOtpValue = value.slice(0, index) + (newValue.length > 0 ? newValue : "") + value.slice(index + 1)
    onChange(newOtpValue)

    // Focus the next input if a value was entered
    if (newValue.length > 0 && index < length - 1) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move focus to previous input on backspace
    if (e.key === "Backspace") {
      if (index > 0 && !value[index]) {
        setActiveInput(index - 1)
        inputRefs.current[index - 1]?.focus()
      }
    }
    // Move focus to next input on arrow right
    else if (e.key === "ArrowRight" && index < length - 1) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }
    // Move focus to previous input on arrow left
    else if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleFocus = (index: number) => {
    setActiveInput(index)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Only accept numbers
    if (!/^\d*$/.test(pastedData)) return

    // Limit to the remaining length
    const pastedValue = pastedData.slice(0, length)
    onChange(pastedValue.padEnd(value.length, value.slice(pastedValue.length)))

    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedValue.length, length - 1)
    setActiveInput(nextIndex)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-center gap-2">
        {Array(length)
          .fill(null)
          .map((_, index) => (
            <input
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength={1}
              value={value[index] || ""}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => handleFocus(index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={cn(
                "h-12 w-12 rounded-md border bg-background p-0 text-center text-lg font-semibold shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary",
                {
                  "border-destructive focus:border-destructive focus:ring-destructive": error,
                },
              )}
              aria-label={`Digit ${index + 1}`}
            />
          ))}
      </div>
      {error && <p className="text-center text-sm text-destructive">{error}</p>}
    </div>
  )
}
