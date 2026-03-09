"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const Checkbox = React.forwardRef<HTMLInputElement, any>(({ className, checked, onCheckedChange, ...props }, ref) => {
    const isChecked = !!checked;
    return (
        <div 
            className={cn(
                "relative flex items-center justify-center shrink-0 rounded-sm border border-primary ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 overflow-hidden transition-colors",
                isChecked ? "bg-primary text-primary-foreground" : "bg-transparent text-transparent",
                className
            )}
            data-state={isChecked ? "checked" : "unchecked"}
        >
            <input
                type="checkbox"
                ref={ref}
                checked={isChecked}
                onChange={(e) => {
                    if (onCheckedChange) onCheckedChange(e.target.checked);
                    if (props.onChange) props.onChange(e as any);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer m-0 p-0 z-10"
                {...props}
            />
            {isChecked && <Check className="h-4 w-4 shrink-0 text-current pointer-events-none z-0" strokeWidth={3} />}
        </div>
    );
})
Checkbox.displayName = "Checkbox"

export { Checkbox }

