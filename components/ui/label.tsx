"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const labelVariants = cva(
  "font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
      },
      strength:{
        bold: "font-bold",
        normal: "font-normal",
        light: "font-light",
        thin: "font-thin",
        black: "font-black",
        extralight: "font-extralight",
        extrabold: "font-extrabold",
        semibold: "font-semibold",
        medium: "font-medium",
        regular: "font-regular",
        hairline: "font-hairline",
        bolder: "font-bolder",
      },
      labelColor: {
        default: "text-foreground",
        trackingtight: "tracking-tight",
        transparent: "text-transparent",
        muted: "text-muted-foreground",
        error: "text-red-600 dark:text-red-400",
      },
    },
    defaultVariants: {
      size: "sm",
      labelColor: "default",
    },
  }
)

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, size, labelColor,strength, ...props }, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants({ size, labelColor }), className)}
      {...props}
    />
  )
})

Label.displayName = "Label"

export { Label }
