"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/shared/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const TooltipRoot = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "bg-white border border-zinc-200 text-zinc-700 shadow-sm",
        "dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

type TooltipProps = {
  readonly children: React.ReactNode;
  readonly content: React.ReactNode;
  readonly side?: "top" | "right" | "bottom" | "left";
  readonly align?: "start" | "center" | "end";
  readonly sideOffset?: number;
  readonly className?: string;
}

export const Tooltip = ({ 
  children, 
  content, 
  side = "top", 
  align = "center", 
  sideOffset = 4,
  className
}: TooltipProps) => {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent 
        side={side} 
        align={align} 
        sideOffset={sideOffset} 
        className={className}
      >
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
};

export { 
  TooltipTrigger, 
  TooltipContent, 
  TooltipProvider,
  TooltipRoot as TooltipPrimitiveRoot
}
