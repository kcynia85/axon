import React from "react";
import { Filter, ArrowUpDown } from "lucide-react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { ActiveFilter, FilterGroup, SortOption } from "@/shared/domain/filters";
import { InboxItem } from "../../../domain";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/ui/ui/Table";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { FilterPill } from "@/shared/ui/complex/FilterPill";
import { InboxItemView } from "./InboxItemView";

export type InboxListViewProps = {
    readonly items: readonly InboxItem[];
    readonly totalItemsCount: number;
    readonly searchQuery: string;
    readonly sortBy: string;
    readonly sortOptions: readonly SortOption[];
    readonly activeFilters: readonly ActiveFilter[];
    readonly filterGroups: readonly FilterGroup[];
    readonly onSearchChange: (query: string) => void;
    readonly onSortChange: (sortBy: string) => void;
    readonly onToggleFilter: (id: string) => void;
    readonly onRemoveFilter: (id: string) => void;
    readonly onClearAllFilters: () => void;
    readonly onApplyFilters: (selectedIds: string[]) => void;
    readonly onSelectionChange: (selectedIds: string[]) => void;
    readonly onApprove: (id: string) => void;
    readonly onReject: (id: string) => void;
}

export const InboxListView = ({
    items,
    totalItemsCount,
    searchQuery,
    sortBy,
    sortOptions,
    activeFilters,
    filterGroups,
    onSearchChange,
    onSortChange,
    onToggleFilter,
    onRemoveFilter,
    onClearAllFilters,
    onApplyFilters,
    onSelectionChange,
    onApprove,
    onReject
}: InboxListViewProps): React.ReactNode => {
    return (
        <BrowserLayout
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search inbox..."
            activeFilters={activeFilters.length > 0 && (
                <FilterBar 
                    activeFilters={activeFilters}
                    onRemove={onRemoveFilter}
                    onClearAll={onClearAllFilters}
                />
            )}
            filters={
                <>
                    <FilterPill 
                        label="By Status" 
                        group={filterGroups.find(g => g.id === 'status')} 
                        activeFilters={activeFilters}
                        onToggle={onToggleFilter}
                    />
                    <FilterPill 
                        label="By Type" 
                        group={filterGroups.find(g => g.id === 'type')} 
                        activeFilters={activeFilters}
                        onToggle={onToggleFilter}
                    />
                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
                    <FilterBigMenu 
                        groups={filterGroups}
                        resultsCount={totalItemsCount}
                        onApply={onApplyFilters}
                        onClearAll={onClearAllFilters}
                        onSelectionChange={onSelectionChange}
                        trigger={
                            <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 mb-[-10px] group">
                                <Filter size={14} className="group-hover:scale-110 transition-transform" />
                                More Filters
                            </button>
                        }
                    />
                </>
            }
            actions={
                <SortMenu 
                    options={sortOptions}
                    activeOptionId={sortBy}
                    onSelect={onSortChange}
                    trigger={
                        <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 mb-[-10px]">
                            <ArrowUpDown size={14} />
                            Sort
                        </button>
                    }
                />
            }
        >
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-zinc-50/50 dark:bg-zinc-900/50">
                        <TableRow className="hover:bg-transparent border-zinc-200 dark:border-zinc-800">
                            <TableHead className="w-[40%] text-[10px] font-black uppercase tracking-wider text-zinc-400 py-4 px-6">Artefact Name</TableHead>
                            <TableHead className="w-[25%] text-[10px] font-black uppercase tracking-wider text-zinc-400 py-4 px-6">Project</TableHead>
                            <TableHead className="w-[15%] text-[10px] font-black uppercase tracking-wider text-zinc-400 py-4 px-6">Status</TableHead>
                            <TableHead className="w-[20%] text-[10px] font-black uppercase tracking-wider text-zinc-400 py-4 px-6 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-32 text-center text-zinc-500 font-mono text-xs">
                                    No items found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <InboxItemView 
                                    key={item.id} 
                                    item={item} 
                                    onApprove={onApprove} 
                                    onReject={onReject} 
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </BrowserLayout>
    );
};
