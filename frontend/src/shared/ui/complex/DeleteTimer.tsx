"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";

type DeleteTimerProps = {
  readonly id: string;
  readonly duration?: number; // duration in ms
  readonly onComplete: () => void;
  readonly className?: string;
};

export const DeleteTimer = ({ 
  id, 
  duration = 10000, 
  onComplete, 
  className 
}: DeleteTimerProps) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const newProgress = (remaining / duration) * 100;
      
      setProgress(newProgress);

      if (remaining <= 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className={cn("relative h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden", className)}>
      <motion.div
        className="absolute top-0 left-0 h-full bg-red-500"
        style={{ width: `${progress}%` }}
        transition={{ ease: "linear" }}
      />
    </div>
  );
};
