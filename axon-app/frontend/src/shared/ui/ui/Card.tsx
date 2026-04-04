import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/shared/lib/utils"

export type CardProps = {
  readonly asChild?: boolean;
} & React.ComponentProps<"div">;

export const Card = ({ className, asChild = false, ...props }: CardProps) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col rounded-xl border shadow-sm",
        className
      )}
      {...props}
    />
  )
}

export const CardHeader = ({ className, asChild = false, ...props }: CardProps) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

export const CardTitle = ({ className, asChild = false, ...props }: CardProps) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

export const CardDescription = ({ className, asChild = false, ...props }: CardProps) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="card-description"
      className={cn("text-muted-foreground !text-base", className)}
      {...props}
    />
  )
}

export const CardAction = ({ className, asChild = false, ...props }: CardProps) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

export const CardContent = ({ className, asChild = false, ...props }: CardProps) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

export const CardFooter = ({ className, asChild = false, ...props }: CardProps) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}
