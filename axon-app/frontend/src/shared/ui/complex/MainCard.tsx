"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/shared/ui/ui/Card";
import { ProjectCardTitle } from "@/modules/projects/ui/components/ProjectTypography";
import { BaseSpan } from "@/modules/projects/ui/components/ProjectBaseAtoms";
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
  <CardHeader className={cn("pb-4 pt-6 flex flex-col items-start justify-start text-left gap-3", className)}>
    {/* Title Block - Fixed height ensures vertical alignment across cards */}
    <div className="min-h-[136px] w-full flex flex-col items-start justify-start text-left gap-3">
      <div className="flex items-start justify-start gap-2 text-left w-full">
        {Icon && <Icon className="h-5 w-5 text-primary mt-1 shrink-0" />}
        <div className="flex flex-col gap-3 w-full">
          <ProjectCardTitle>{title}</ProjectCardTitle>
          <div className="flex items-center justify-start h-6 w-full text-left">
            {children}
          </div>
        </div>
      </div>
    </div>
  </CardHeader>
);

/**
 * MainCardContent - Flexible content area.
 */
export const MainCardContent = ({ children, className }: MainCardContentProps) => (
  <CardContent className={cn("flex-1 pt-2 pb-10 flex flex-col items-start justify-start text-left", className)}>
    {children}
  </CardContent>
);

/**
 * MainCardFooter - Standardized footer with centered label and right chevron.
 */
export const MainCardFooter = ({ label, className }: MainCardFooterProps) => (
  <CardFooter className={cn("py-4 flex items-center justify-center border-t border-zinc-50 dark:border-zinc-900 mt-auto px-4 relative", className)}>
    <BaseSpan className="text-[16px] font-black tracking-widest text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
      {label}
    </BaseSpan>
  </CardFooter>
);
