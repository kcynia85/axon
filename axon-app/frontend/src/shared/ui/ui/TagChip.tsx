"use client";

import React from "react";
import { Badge } from "./Badge";
import { cn } from "@/shared/lib/utils";
import { Hash } from "lucide-react";

type TagChipProps = {
  readonly label: string;
  readonly className?: string;
  readonly variant?: "default" | "secondary" | "outline" | "destructive" | "category";
};

/**
 * TagChip - Reusable component for displaying tags across Axon.
 */
export const TagChip = ({ 
  label, 
  className, 
  variant = "secondary" 
}: TagChipProps) => {
  const hasHash = label.startsWith("#");
  const cleanLabel = hasHash ? label.slice(1) : label;

  return (
    <Badge
      variant={variant === "category" ? "secondary" : variant}
      className={cn(
        "font-sans transition-all",
        variant === "category" && 
          "h-[30px] px-2 py-0.5 rounded-full border border-white/10 bg-transparent text-[14px] font-medium font-mono text-white/90 gap-1",
        variant !== "category" && 
          "text-[12px] font-bold px-2 py-0.5 h-5 rounded-md border-none bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
        className
      )}
    >
      {variant !== "category" && <Hash className="w-2.5 h-2.5 mr-0.5 opacity-70" />}
      {cleanLabel}
    </Badge>
  );
};

