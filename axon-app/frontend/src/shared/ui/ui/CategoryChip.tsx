"use client";

import React from "react";
import { Badge } from "./Badge";
import { cn } from "@/shared/lib/utils";

type CategoryChipProps = {
  readonly label: string;
  readonly className?: string;
  readonly variant?: "default" | "secondary" | "outline" | "destructive";
};

/**
 * CategoryChip - Reusable component for displaying categories across Axon.
 */
export const CategoryChip = ({ 
  label, 
  className, 
  variant = "secondary" 
}: CategoryChipProps) => {
  return (
    <Badge
      variant={variant}
      className={cn(
        "text-[12px] font-bold px-2 py-0.5 h-5 rounded-md border-none bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 transition-all font-sans",
        className
      )}
    >
      {label}
    </Badge>
  );
};
