"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { BreadcrumbsProps } from "@/shared/lib/types/breadcrumbs";

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  if (!items?.length) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]", className)}>
      {items.map((crumb, index) => (
        <React.Fragment key={index}>
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-zinc-800 dark:text-zinc-200">{crumb.label}</span>
          )}
          {crumb.isLast ? null : <ChevronRight size={10} className="text-zinc-300 shrink-0" />}
        </React.Fragment>
      ))}
    </nav>
  );
};
