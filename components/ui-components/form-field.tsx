'use client';

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";
import { Input, type InputProps } from "./input";

export interface FormFieldProps extends InputProps {
  label?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, required = false, helperText, error, id, ...props }, ref) => {
    const reactId = useId(); // React's SSR-safe ID hook
    const inputId = id || `input-${reactId}`;

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <Input id={inputId} ref={ref} error={error} {...props} />
        {helperText && !error && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export { FormField };
