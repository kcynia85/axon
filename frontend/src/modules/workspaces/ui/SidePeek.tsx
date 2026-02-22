"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/shared/ui/ui/Sheet";
import { cn } from "@/shared/lib/utils";

interface SidePeekProps {
    title: string;
    description?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
    className?: string;
}

export const SidePeek = ({
    title,
    description,
    open,
    onOpenChange,
    children,
    className
}: SidePeekProps) => {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className={cn("sm:max-w-[540px] w-full", className)}>
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-xl font-bold">{title}</SheetTitle>
                    {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>
                <div className="flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
};
