"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageContainer } from "./PageContainer";
import { PageContent } from "./PageContent";
import { cn } from "@/shared/lib/utils";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ModulePageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  pagination?: React.ReactNode;
  showPagination?: boolean;
  className?: string;
}

export const ModulePageLayout: React.FC<ModulePageLayoutProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  children,
  pagination,
  showPagination = true,
  className,
}) => {
  return (
    <PageContainer>
      <PageContent>
        <div className={cn("flex flex-col space-y-8 py-6 max-w-5xl mx-auto", className)}>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.label}>
                {crumb.href ? (
                  <Link 
                    href={crumb.href} 
                    className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-zinc-800 dark:text-zinc-200">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <ChevronRight size={10} className="text-zinc-300" />
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Header */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                  <p className="text-muted-foreground">{description}</p>
                )}
              </div>
              {actions && <div>{actions}</div>}
            </div>
          </div>

          {/* Browser / Content Area */}
          <div className="flex-1">
            {children}
          </div>

          {/* Pagination Placeholder (if provided) */}
          {showPagination && pagination !== undefined ? (
            <div className="pt-12 border-t border-zinc-100 dark:border-zinc-900">
               {pagination || (
                <div className="flex justify-start items-center gap-4">
                  <button className="h-8 w-8 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all disabled:opacity-30" disabled>
                    <ChevronLeft size={14} />
                  </button>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <button 
                        key={i}
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-md border text-sm transition-colors font-bold",
                          i === 1 ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white" : "border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white"
                        )}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                  <button className="h-8 w-8 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 rounded-md text-zinc-500 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all">
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </PageContent>
    </PageContainer>
  );
};
