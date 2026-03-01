import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { cn } from "@/lib/utils";

interface BrowserLayoutProps {
  readonly searchQuery?: string;
  readonly onSearchChange?: (query: string) => void;
  readonly searchPlaceholder?: string;
  readonly activeFilters?: React.ReactNode;
  readonly filters?: React.ReactNode; // Left side of the action bar
  readonly actions?: React.ReactNode; // Right side of the action bar (Sort, View toggle, etc.)
  readonly topContent?: React.ReactNode; // Content above search bar
  readonly children: React.ReactNode;
  readonly className?: string;
}

export const BrowserLayout: React.FC<BrowserLayoutProps> = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  activeFilters,
  filters,
  actions,
  topContent,
  children,
  className,
}) => {
  const showSearch = searchQuery !== undefined && onSearchChange !== undefined;

  return (
    <div className={cn("space-y-12", className)}>
      {/* Top Content (e.g. Recently Used) */}
      {topContent && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-500">
          {topContent}
        </div>
      )}

      {(showSearch || activeFilters) && (
        <div className="flex flex-col space-y-8">
          {/* Search Row */}
          {showSearch && (
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
              <Input 
                placeholder={searchPlaceholder} 
                className="pl-10 h-11 border-zinc-200 dark:border-zinc-800"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
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

      {/* Actions Row (Filters + Sort/View) */}
      {(filters || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-4 px-1">
            {filters}
          </div>
          <div className="flex items-center gap-10">
            {actions}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="pt-2">
        {children}
      </div>
    </div>
  );
};
