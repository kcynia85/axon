"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
    
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, duration - elapsed);
      const newProgress = (remaining / duration) * 100;
      
      setProgress(newProgress);

      if (remaining > 0) {
        requestAnimationFrame(tick);
      } else {
        onComplete();
      }
    };

    const animationFrame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration, onComplete]);

  return (
    <div className={cn("relative h-1 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden", className)}>
      <motion.div
        className="absolute top-0 left-0 h-full bg-zinc-950 dark:bg-zinc-100"
        style={{ width: `${progress}%` }}
        transition={{ type: "tween", ease: "linear" }}
      />
    </div>
  );
};
