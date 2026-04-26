"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

export const MagicSphere = ({ className }: { className?: string }) => {
  return (
    <div className={cn("relative w-32 h-32 flex items-center justify-center", className)}>
      {/* The Sphere */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ willChange: "transform" }}
        className="relative w-24 h-24 rounded-full shadow-[inset_-10px_-10px_30px_rgba(0,0,0,0.1),inset_10px_10px_30px_rgba(255,255,255,1),0_20px_40px_rgba(0,0,0,0.2)] bg-gradient-to-br from-white via-zinc-50 to-zinc-100 border border-white transform-gpu"
      >
        {/* Shine/Reflection */}
        <div className="absolute top-[15%] left-[20%] w-6 h-6 bg-white rounded-full blur-sm" />
        <div className="absolute top-[10%] left-[25%] w-3 h-3 bg-white rounded-full blur-[1px]" />
      </motion.div>
    </div>
  );
};
