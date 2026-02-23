import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/shared/ui/ui/ScrollArea"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col h-screen border-r bg-background", className)}
    {...props}
  >
    {children}
  </div>
))
Sidebar.displayName = "Sidebar"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex h-16 shrink-0 items-center px-6", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarBrand = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center font-semibold", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarBrand.displayName = "SidebarBrand"

const SidebarContent = React.forwardRef<
  React.ElementRef<typeof ScrollArea>,
  React.ComponentPropsWithoutRef<typeof ScrollArea>
>(({ className, children, ...props }, ref) => (
  <ScrollArea
    ref={ref}
    className={cn("flex-1", className)}
    {...props}
  >
    {children}
  </ScrollArea>
))
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-4 py-2", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", className)}
    {...props}
  >
    {children}
  </p>
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  >
    {children}
  </nav>
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-auto", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarFooterRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between px-4 py-4", className)}
    {...props}
  >
    {children}
  </div>
))
SidebarFooterRow.displayName = "SidebarFooterRow"

const SidebarVersion = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
))
SidebarVersion.displayName = "SidebarVersion"

export {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarFooter,
  SidebarFooterRow,
  SidebarVersion,
}
