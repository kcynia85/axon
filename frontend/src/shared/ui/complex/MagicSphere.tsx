"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

export const MagicSphere = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-32 h-32 flex items-center justify-center", className)}>
      {/* Background Glow */}
      <div className="absolute inset-0 bg-white/10 dark:bg-white/5 rounded-full blur-3xl animate-pulse" />
      
      {/* The Sphere */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative w-24 h-24 rounded-full shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.05),inset_10px_10px_30px_rgba(255,255,255,0.8),0_20px_40px_rgba(255,255,255,0.1)] bg-gradient-to-br from-white via-zinc-50/80 to-zinc-200/50 backdrop-blur-xl border border-white/40"
      >
        {/* Shine/Reflection */}
        <div className="absolute top-[15%] left-[20%] w-6 h-6 bg-white/60 rounded-full blur-sm" />
        <div className="absolute top-[10%] left-[25%] w-3 h-3 bg-white/80 rounded-full blur-[1px]" />
      </motion.div>
    </div>
  );
};
