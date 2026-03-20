"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@heroui/react";
import { cn } from "@/shared/lib/utils";

export const ModeToggle = (): React.ReactNode => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Ensure component is mounted to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, [])

  if (!mounted) {
    return <div className="w-14 h-8 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />;
  }

  const isDark = theme === "dark";

  return (
    <div className="relative inline-flex items-center">
      <Switch
        isSelected={isDark}
        onValueChange={(isSelected) => setTheme(isSelected ? "dark" : "light")}
        size="lg"
        aria-label="Toggle theme"
        title="Toggle theme"
        classNames={{
          wrapper: cn(
            "w-[58px] h-8 transition-all duration-500 relative px-1 rounded-full",
            "bg-zinc-200/50 dark:bg-zinc-800/30 backdrop-blur-md border border-zinc-300/50 dark:border-white/10 group-hover:border-zinc-400 dark:group-hover:border-white/20"
          ),
          thumb: cn(
            "w-6 h-6 transition-all duration-500 shadow-[0_2px_10px_rgba(0,0,0,0.1)] z-10 rounded-full",
            isDark ? "bg-white" : "bg-zinc-950"
          ),
        }}
      />
      
      {/* Icons Overlay - Perfectly aligned with thumb positions */}
      <div className="absolute inset-0 flex items-center justify-between px-[7px] pointer-events-none z-20">
        <div className="w-6 h-6 flex items-center justify-center">
          <Sun 
            className={cn(
              "w-3.5 h-3.5 transition-all duration-500",
              isDark ? "text-zinc-500 scale-90" : "text-white scale-100"
            )} 
            aria-hidden="true"
          />
        </div>
        <div className="w-6 h-6 flex items-center justify-center">
          <Moon 
            className={cn(
              "w-3.5 h-3.5 transition-all duration-500",
              isDark ? "text-zinc-900 scale-100" : "text-zinc-400 scale-90"
            )} 
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};
