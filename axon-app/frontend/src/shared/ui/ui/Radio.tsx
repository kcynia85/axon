"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils"

const Radio = React.forwardRef<HTMLInputElement, any>(({ className, checked, onCheckedChange, ...props }, ref) => {
    const isChecked = !!checked;
    return (
        <div 
            className={cn(
                "relative flex items-center justify-center shrink-0 w-4 h-4 rounded-full border border-primary ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all",
                isChecked ? "bg-primary border-primary" : "bg-transparent border-zinc-300 dark:border-zinc-700",
                className
            )}
            data-state={isChecked ? "checked" : "unchecked"}
        >
            <input
                type="radio"
                ref={ref}
                checked={isChecked}
                onChange={(e) => {
                    // This is for native radio group behavior if needed
                    if (e.target.checked && onCheckedChange) {
                        onCheckedChange(true);
                    }
                }}
                className="sr-only"
                {...props}
            />
            {isChecked && (
                <div className="h-1.5 w-1.5 rounded-full bg-black shrink-0 pointer-events-none" />
            )}
        </div>
    );
})
Radio.displayName = "Radio"

export { Radio }
