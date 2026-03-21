import React from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { Button } from "@/shared/ui/ui/Button";
import { Filter } from "lucide-react";
import type { ToolsRegistryHeaderProps } from "../types/tools-registry.types";

export const ToolsRegistryHeader = ({
  searchFilter,
  filterGroups,
  filteredCount,
  activeFilters,
  sortOptions,
  activeSortId,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  onRemoveFilter,
  onSortOptionSelect,
}: ToolsRegistryHeaderProps) => {
  return (
    <header className="flex flex-col gap-2 py-1 mt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl tracking-tight text-white font-mono font-bold  !font-mono">Internal Tools</h1>
        
        <div className="flex items-center gap-6">
          <div className="w-[240px]">
            <SearchInput 
              value={searchFilter}
              onChange={onSearchChange}
              placeholder="Search..."
            />
          </div>

          <div className="w-[1px] h-4 bg-zinc-800" />

          <FilterBigMenu 
            groups={filterGroups}
            resultsCount={filteredCount}
            onApply={onApplyFilters}
            onClearAll={onClearFilters}
            trigger={
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all px-4 h-8 rounded-lg outline-none border-none"
              >
                <Filter size={14} className="group-hover:scale-110 transition-transform" />
                Filters
              </Button>
            }
          />
          
          <div className="w-[1px] h-4 bg-zinc-800" />

          <SortMenu 
            options={sortOptions}
            activeOptionId={activeSortId}
            onSelect={onSortOptionSelect}
          />
        </div>
      </div>

      <FilterBar 
        activeFilters={activeFilters}
        onRemove={onRemoveFilter}
        onClearAll={onClearFilters}
        className="mt-1"
      />
    </header>
  );
};
