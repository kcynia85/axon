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
  readonly description?: React.ReactNode;
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly children: React.ReactNode;
  readonly footer?: React.ReactNode;
  readonly className?: string;
  readonly maxWidth?: string;
  readonly modal?: boolean;
  readonly image?: React.ReactNode;
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
  modal = true,
  image,
}: SidePeekProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={modal}>
      <SheetContent className={cn("flex flex-col p-0 overflow-y-auto", maxWidth, className)} modal={modal}>
        <SheetHeader className="p-6 border-b shrink-0">
          <div className="flex items-center gap-4">
            {image && (
              <div className="shrink-0">
                {image}
              </div>
            )}
            <div className="flex flex-col gap-1 min-w-0">
              <SheetTitle className="text-xl font-bold tracking-tight truncate">{title}</SheetTitle>
              {description && (
                <SheetDescription className="text-muted-foreground truncate">
                  {description}
                </SheetDescription>
              )}
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 text-base">
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
