"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "./Input";
import { cn } from "@/lib/utils";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

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
        className="pl-10 h-[52px] py-3 border-zinc-200 dark:border-zinc-800 bg-zinc-900/50"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
    </div>
  );
};
