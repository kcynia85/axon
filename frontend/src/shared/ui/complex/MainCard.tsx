"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/shared/ui/ui/Card";
import { ProjectCardTitle } from "@/modules/projects/features/browse-projects/ui/components/ProjectTypography";
import { BaseSpan } from "@/modules/projects/features/browse-projects/ui/components/ProjectBaseAtoms";
import type { 
  MainCardProps, 
  MainCardHeaderProps, 
  MainCardContentProps, 
  MainCardFooterProps 
} from "@/shared/lib/types/main-card";

/**
 * MainCard - Base container for resource overview cards.
 */
export const MainCard = ({ href, onClick, children, className }: MainCardProps) => {
  const containerClasses = cn(
    "h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col transition-all group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-md cursor-pointer",
    className
  );

  const inner = <Card className={containerClasses}>{children}</Card>;

  if (href) {
    return (
      <Link href={href} className="text-left w-full h-full block group transition-transform active:scale-[0.98] outline-none">
        {inner}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="text-left w-full h-full block group transition-transform active:scale-[0.98] outline-none">
      {inner}
    </button>
  );
};

/**
 * MainCardHeader - Standardized header with title block and status area.
 */
export const MainCardHeader = ({ title, icon: Icon, children, className }: MainCardHeaderProps) => (
  <CardHeader className={cn("pb-4 pt-6 flex flex-col items-start gap-3", className)}>
    {/* Title Block - Fixed height ensures vertical alignment across cards */}
    <div className="min-h-[56px] w-full flex items-start">
      <div className="flex items-start gap-2">
        {Icon && <Icon className="h-5 w-5 text-primary mt-1 shrink-0" />}
        <ProjectCardTitle>{title}</ProjectCardTitle>
      </div>
    </div>
    
    {/* Status/Badges Slot */}
    <div className="flex items-center h-6">
      {children}
    </div>
  </CardHeader>
);

/**
 * MainCardContent - Flexible content area.
 */
export const MainCardContent = ({ children, className }: MainCardContentProps) => (
  <CardContent className={cn("flex-1 pt-2 pb-6", className)}>
    {children}
  </CardContent>
);

/**
 * MainCardFooter - Standardized footer with centered label and right chevron.
 */
export const MainCardFooter = ({ label, className }: MainCardFooterProps) => (
  <CardFooter className={cn("py-4 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 mt-auto px-4 relative", className)}>
    {/* Spacer to keep text centered when chevron is on the right */}
    <div className="w-4 h-4" /> 
    
    <BaseSpan className="text-[16px] font-blackpod tracking-widest text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
      {label}
    </BaseSpan>
    
    <ChevronRight size={16} className="text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
  </CardFooter>
);
