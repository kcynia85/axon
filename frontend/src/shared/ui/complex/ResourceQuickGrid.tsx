"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import type { ResourceQuickGridProps } from "@/shared/lib/types/resource-quick-card";

export const ResourceQuickGrid: React.FC<ResourceQuickGridProps> = ({ children, className }) => (
  <div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3", className)}>
    {children}
  </div>
);
