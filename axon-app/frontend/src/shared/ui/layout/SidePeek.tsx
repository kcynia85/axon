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
              <SheetTitle className="text-2xl font-bold tracking-tight truncate">{title}</SheetTitle>
              {description && (
                <div className="text-base text-muted-foreground truncate font-medium">
                  {description}
                </div>
              )}
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-12">
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

export const SidePeekSection = ({ 
    title, 
    children, 
    className
}: { 
    title?: string; 
    children: React.ReactNode; 
    className?: string;
}) => (
    <section className={cn("space-y-4", className)}>
        {title && (
            <h4 className="text-base font-bold text-muted-foreground">
                {title}
            </h4>
        )}
        <div className="space-y-1.5">
            {children}
        </div>
    </section>
);

export const SidePeekGrid = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-2 gap-4 pb-10 border-b border-muted">
        {children}
    </div>
);

export const SidePeekGridItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="space-y-2">
        <div className="text-base font-bold text-muted-foreground">{label}</div>
        <div className="text-base font-bold tracking-tight">{value}</div>
    </div>
);
