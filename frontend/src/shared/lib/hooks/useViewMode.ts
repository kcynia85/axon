"use client";

import { useState } from "react";
import { ViewMode } from "@/shared/ui/complex/ResourceList";

export function useViewMode(key: string, defaultMode: ViewMode = "grid") {
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return defaultMode;
    
    const saved = localStorage.getItem(`view-mode-${key}`);
    if (saved === "grid" || saved === "list") {
      return saved;
    }
    return defaultMode;
  });

  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(`view-mode-${key}`, mode);
  };

  return [viewMode, toggleViewMode] as const;
}
