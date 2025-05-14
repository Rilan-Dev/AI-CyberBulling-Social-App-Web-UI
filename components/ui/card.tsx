import * as React from "react";
import { cn } from "@/lib/utils";
import { Label, LabelProps } from "./label";
import * as LabelPrimitive from "@radix-ui/react-label";

// Card Component
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Card Header
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// Card Title
const CardTitle = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, size, labelColor, ...props }, ref) => (
    <Label
      ref={ref}
      {...props}
      labelColor={labelColor || "trackingtight"}
      size={size || "2xl"}
      className={cn("font-semibold leading-none", className)}
    />
  )
);
CardTitle.displayName = "CardTitle";

// Card Description
const CardDescription = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, size, labelColor, ...props }, ref) => (
    <Label
      ref={ref}
      {...props}
      labelColor={labelColor || "muted"}
      size={size || "sm"}
      className={cn("font-semibold leading-none", className)}
    />
  )
);
CardDescription.displayName = "CardDescription";

// Card Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    direction?: "row" | "col";
    justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
    align?: "start" | "center" | "end" | "stretch";
    gap?: string; // Tailwind spacing scale, e.g., "4", "6", "8"
    wrap?: boolean;
    responsive?: boolean;
  }
>(
  (
    {
      className,
      direction = "col",
      justify = "start",
      align = "stretch",
      gap = "4",
      wrap = false,
      responsive = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "p-6 pt-0 flex",
        `flex-${direction}`,
        `justify-${justify}`,
        `items-${align}`,
        `gap-${gap}`,
        { "flex-wrap": wrap },
        responsive && "md:flex-row", // Responsive example for medium screens
        className
      )}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

// Card Footer
const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Optional Card Badge Component (e.g., for tags, statuses)
const CardBadge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 text-sm font-medium rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);
CardBadge.displayName = "CardBadge";

// Card Image Component (e.g., for displaying an image inside the card)
const CardImage = React.forwardRef<HTMLImageElement, React.ImgHTMLAttributes<HTMLImageElement>>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn("w-full h-auto rounded-t-lg", className)}
      {...props}
    />
  )
);
CardImage.displayName = "CardImage";

// Card Button (e.g., for actions in the card)
const CardButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn("bg-primary text-white rounded px-4 py-2", className)}
    {...props}
  >
    {children}
  </button>
));

CardButton.displayName = "CardButton";

// Export all components for use
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardBadge,
  CardImage,
  CardButton,
};
