"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

export const MagicSphere = ({ className, isSyncing = false }: { className?: string, isSyncing?: boolean }) => {
  return (
    <div className={cn("relative w-32 h-32 flex items-center justify-center", className)}>
      {/* Background Glow */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full blur-3xl transition-all duration-700",
          isSyncing ? "bg-blue-500/40 animate-pulse scale-150" : "bg-white/10 dark:bg-white/5 animate-pulse"
        )} 
      />
      
      {/* The Sphere */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          scale: isSyncing ? [1, 1.15, 1] : [1, 1.05, 1],
          boxShadow: isSyncing 
            ? "inset -10px -10px 30px rgba(0,0,0,0.05), inset 10px 10px 30px rgba(255,255,255,0.8), 0 20px 60px rgba(59,130,246,0.4)"
            : "inset -10px -10px 30px rgba(0,0,0,0.05), inset 10px 10px 30px rgba(255,255,255,0.8), 0 20px 40px rgba(255,255,255,0.1)"
        }}
        transition={{
          duration: isSyncing ? 1.5 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn(
          "relative w-24 h-24 rounded-full bg-gradient-to-br backdrop-blur-xl border transition-colors duration-700",
          isSyncing 
            ? "from-white via-blue-100 to-blue-300/60 border-blue-400/60" 
            : "from-white via-zinc-50/80 to-zinc-200/50 border-white/40"
        )}
      >
        {/* Shine/Reflection */}
        <div className="absolute top-[15%] left-[20%] w-6 h-6 bg-white/60 rounded-full blur-sm" />
        <div className="absolute top-[10%] left-[25%] w-3 h-3 bg-white/80 rounded-full blur-[1px]" />
      </motion.div>
    </div>
  );
};
