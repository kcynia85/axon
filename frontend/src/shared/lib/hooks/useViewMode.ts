"use client";

import { useState, useEffect } from "react";
import { ViewMode } from "@/shared/ui/complex/ResourceList";

export function useViewMode(key: string, defaultMode: ViewMode = "grid") {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`view-mode-${key}`);
    if (saved === "grid" || saved === "list") {
      setViewMode(saved);
    }
  }, [key]);

  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(`view-mode-${key}`, mode);
  };

  return [viewMode, toggleViewMode] as const;
}
