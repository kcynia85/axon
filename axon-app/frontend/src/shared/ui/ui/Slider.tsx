"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils"

const Slider = React.forwardRef<HTMLInputElement, any>(({ className, value, defaultValue, onValueChange, min = 0, max = 100, step = 1, ...props }, ref) => {
    const val = Array.isArray(value) ? value[0] : value;
    const defVal = Array.isArray(defaultValue) ? defaultValue[0] : defaultValue;
    const currentVal = val ?? defVal ?? 0;

    // Calculate percentage for the gradient fill
    const percentage = ((currentVal - min) / (max - min)) * 100;

    return (
        <div className={cn("relative flex w-full items-center touch-none select-none", className)}>
            <input
                type="range"
                ref={ref}
                min={min}
                max={max}
                step={step}
                value={currentVal}
                onChange={(e) => {
                    const num = parseFloat(e.target.value);
                    if (onValueChange) onValueChange([num]);
                    if (props.onChange) props.onChange(e as any);
                }}
                className={cn(
                    "w-full h-2 rounded-full appearance-none bg-secondary cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
                    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:ring-offset-background [&::-webkit-slider-thumb]:transition-colors",
                    "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:ring-offset-background [&::-moz-range-thumb]:transition-colors"
                )}
                style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--secondary) ${percentage}%, var(--secondary) 100%)`
                }}
                {...props}
            />
        </div>
    )
})
Slider.displayName = "Slider"

export { Slider }


