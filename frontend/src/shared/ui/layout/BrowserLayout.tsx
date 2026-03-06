"use client";

import React from "react";
import { cn } from "@/shared/lib/utils";
import { SearchInput } from "@/shared/ui/complex/SearchInput";
import type { BrowserLayoutProps } from "@/shared/lib/types/browser-layout";

export const BrowserLayout = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  activeFilters,
  actionBar,
  filters,
  actions,
  topContent,
  children,
  className,
}: BrowserLayoutProps) => {
  const showSearch = searchQuery !== undefined && onSearchChange !== undefined;

  return (
    <div className={cn("space-y-12", className)}>
      {/* Top Content (e.g. Recently Used) */}
      {topContent && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
          {topContent}
        </div>
      )}

      {(showSearch || activeFilters || filters || actions) && (
        <div className="flex flex-col space-y-8">
          {/* Search Row */}
          {showSearch && (
            <SearchInput 
              value={searchQuery}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
            />
          )}

          {/* Filters & Actions Row */}
          {(filters || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1 pb-3 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex flex-wrap items-center gap-2">
                {filters}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {actions}
              </div>
            </div>
          )}

          {/* Active Filters Row */}
          {activeFilters && (
            <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Active Filters</span>
              <div className="px-1">
                {activeFilters}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legacy Unified Action Bar (Filters + Sort/View) */}
      {actionBar}

      {/* Content Area */}
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
};
