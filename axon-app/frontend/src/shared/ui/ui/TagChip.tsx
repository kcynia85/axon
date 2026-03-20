"use client";

import React from "react";
import { Badge } from "./Badge";
import { cn } from "@/shared/lib/utils";

type TagChipProps = {
  readonly label: string;
  readonly className?: string;
};

/**
 * TagChip - Reusable atom for tag display in cards.
 * Standardized at 12px font size with subtle background.
 */
export const TagChip = ({ label, className }: TagChipProps) => {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "text-[12px] px-2.5 py-0.5 h-6 bg-white/10 border-none font-medium text-zinc-300 not-italic rounded-md whitespace-nowrap",
        className
      )}
    >
      #{label}
    </Badge>
  );
};
