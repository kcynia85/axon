"use client";

import React from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/shared/ui/ui/Sheet";
import { cn } from "@/shared/lib/utils";

type SidePeekProps = {
  readonly title: string;
  readonly description?: string;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly children: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly className?: string;
  readonly maxWidth?: string;
}

/**
 * SidePeek - A standardized side panel for detailed views across the application.
 * Built on top of Radix UI Sheet.
 */
export const SidePeek = ({
  title,
  description,
  open,
  onOpenChange,
  children,
  footer,
  className,
  maxWidth = "sm:max-w-md",
}: SidePeekProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={cn("flex flex-col p-0 overflow-y-auto", maxWidth, className)}>
        <SheetHeader className="p-6 border-b shrink-0">
          <SheetTitle className="text-xl font-bold tracking-tight">{title}</SheetTitle>
          {description && (
            <SheetDescription className="text-muted-foreground">
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {footer && (
          <SheetFooter className="p-6 border-t bg-muted/20 shrink-0">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
