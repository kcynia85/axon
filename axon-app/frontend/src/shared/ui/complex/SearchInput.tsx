"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { cn } from "@/shared/lib/utils";
import type { SearchInputProps } from "@/shared/lib/types/search-input";

/**
 * SearchInput - Standardized search bar used across modules.
 * Pure view component.
 */
export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) => {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
      <Input 
        placeholder={placeholder} 
        className="pl-10 h-[52px] py-3 border-zinc-200 dark:border-zinc-800"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
    </div>
  );
};
