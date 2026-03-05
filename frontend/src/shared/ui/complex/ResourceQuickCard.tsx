"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/ui/Badge";
import type { ResourceQuickCardProps } from "@/shared/lib/types/resource-quick-card";

/**
 * ResourceQuickCard - Unified card for "Recently Used" sections.
 * Reverts to the original module-style look with ArrowRight and p-3.
 */
export const ResourceQuickCard = ({
  title,
  status,
  icon: Icon,
  badge,
  onClick,
  href,
  className,
}: ResourceQuickCardProps) => {
  const content = (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all h-full">
      {/* Icon Wrapper */}
      <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
        <Icon size={16} />
      </div>

      {/* Text Info */}
      <div className="flex-1 min-w-0 text-left">
        {badge && (
          <div className="flex items-center leading-none mb-0.5">
            <Badge 
              variant="outline" 
              className="text-[9px] px-1 py-0 uppercase font-black tracking-widest bg-zinc-100 dark:bg-zinc-800 border-none text-zinc-400 h-auto rounded-sm shadow-none"
            >
              {badge}
            </Badge>
          </div>
        )}
        <p className="text-xs font-bold truncate group-hover:text-primary transition-colors leading-tight">
          {title}
        </p>
        <p className="text-[10px] text-zinc-400 truncate capitalize tracking-normal leading-tight">
          {status}
        </p>
      </div>

      {/* Action Arrow - Original module style */}
      <ArrowRight size={12} className="text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0 ml-1" />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cn("block group h-full", className)}>
        {content}
      </Link>
    );
  }

  return (
    <button 
      className={cn("block group w-full h-full outline-none", className)} 
      onClick={onClick}
    >
      {content}
    </button>
  );
};
