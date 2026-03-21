"use client";

import React from "react";
import { Spinner } from "@heroui/react";
import { AlertCircle } from "lucide-react";
import { ToolsRegistryHeader } from "./components/ToolsRegistryHeader";
import { ToolsRegistryTable } from "./components/ToolsRegistryTable";
import type { ToolsRegistryViewProps } from "./types/tools-registry.types";

export const ToolsRegistryView = ({
  items,
  isLoading,
  error,
  searchFilter,
  sortDescriptor,
  page,
  pages,
  filterGroups,
  filteredCount,
  activeFilters,
  sortOptions,
  activeSortId,
  onSearchChange,
  onSortChange,
  onPageChange,
  onToolSelect,
  onApplyFilters,
  onClearFilters,
  onRemoveFilter,
  onSortOptionSelect,
}: ToolsRegistryViewProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <Spinner size="lg" color="primary" />
        <p className="text-zinc-700 font-black uppercase tracking-[0.4em] text-[10px]">Indexing codebase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-500/5 border border-danger-500/10 p-12 rounded-2xl text-center max-w-xl mx-auto">
        <AlertCircle className="mx-auto mb-6 text-danger/50" size={48} strokeWidth={1} />
        <h3 className="text-danger font-black uppercase tracking-[0.3em] text-xs mb-3">Backend Offline</h3>
        <p className="text-zinc-600 text-sm font-medium">Bridge on 8081 unreachable.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToolsRegistryHeader 
        searchFilter={searchFilter} 
        filterGroups={filterGroups}
        filteredCount={filteredCount}
        activeFilters={activeFilters}
        sortOptions={sortOptions}
        activeSortId={activeSortId}
        onSearchChange={onSearchChange} 
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        onRemoveFilter={onRemoveFilter}
        onSortOptionSelect={onSortOptionSelect}
      />

      <ToolsRegistryTable 
        items={items}
        sortDescriptor={sortDescriptor}
        onSortChange={onSortChange}
        onToolSelect={onToolSelect}
      />
    </div>
  );
};
