import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Standard Axon Input component.
 * Stylized according to the Brutalist design system: 
 * Mono font, pitch black dark mode, high contrast borders.
 * Uses 16px (text-base) as the standard font size for input values and placeholders.
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 text-base font-mono transition-all outline-none",
          "text-zinc-900 placeholder:text-zinc-400",
          "focus:border-zinc-900 focus:ring-0",
          "dark:border-zinc-700 dark:bg-black dark:text-zinc-100 dark:placeholder:text-zinc-700",
          "dark:focus:border-zinc-200",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
