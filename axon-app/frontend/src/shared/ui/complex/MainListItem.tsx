"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/ui/ui/Card";
import type { 
  MainListItemProps, 
  MainListItemInfoProps, 
  MainListItemContentProps, 
  MainListItemActionsProps 
} from "@/shared/lib/types/main-list-item";

/**
 * MainListItem - Base container for list view items.
 */
export const MainListItem = ({ href, onClick, children, className }: MainListItemProps) => {
  const containerClasses = cn(
    "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:shadow-sm transition-all group",
    className
  );

  const inner = (
    <div className="flex items-center justify-between p-4 gap-4">
      {children}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block group transition-transform active:scale-[0.99] outline-none">
        <Card className={containerClasses}>{inner}</Card>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="text-left w-full block group transition-transform active:scale-[0.99] outline-none">
      <Card className={containerClasses}>{inner}</Card>
    </button>
  );
};

/**
 * MainListItemInfo - Left side info with icon, title and status.
 */
export const MainListItemInfo = ({ title, status, icon: Icon, children, className }: MainListItemInfoProps) => (
  <div className={cn("flex items-center gap-4 min-w-0", className)}>
    <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg group-hover:bg-primary/10 transition-colors shrink-0">
      <Icon className="h-5 w-5 text-zinc-500 group-hover:text-primary transition-colors" />
    </div>
    <div className="flex flex-col min-w-0">
      <h3 className="text-sm font-bold group-hover:text-black dark:group-hover:text-white transition-colors truncate">
        {title}
      </h3>
      <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-normal truncate">
        {status}
      </p>
      {children}
    </div>
  </div>
);

/**
 * MainListItemContent - Flexible middle content area.
 */
export const MainListItemContent = ({ children, className }: MainListItemContentProps) => (
  <div className={cn("flex-1 px-4 hidden md:block min-w-0", className)}>
    {children}
  </div>
);

/**
 * MainListItemActions - Right side actions area.
 */
export const MainListItemActions = ({ children, className }: MainListItemActionsProps) => (
  <div className={cn("flex items-center gap-2 shrink-0", className)}>
    {children}
  </div>
);
