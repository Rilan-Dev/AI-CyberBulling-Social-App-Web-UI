import type React from "react"
import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const Form = forwardRef<HTMLFormElement, FormProps>(({ className, children, ...props }, ref) => {
  return (
    <form ref={ref} className={cn("space-y-4", className)} {...props}>
      {children}
    </form>
  )
})
Form.displayName = "Form"

export { Form }
