"use client";

import * as React from "react";
import { 
    Inbox as InboxIcon,
    Filter,
    ArrowUpDown,
    X
} from "lucide-react";
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle,
    SheetClose
} from "@/shared/ui/ui/Sheet";
import { InboxList } from "./InboxList";
import { useInboxItems } from "../application/useInbox";
import { InboxEmptyState } from "./InboxEmptyState";
import { Button } from "@/shared/ui/ui/Button";
import { useUiStore } from "@/shared/lib/store/useUiStore";
import { cn } from "@/shared/lib/utils";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { SortOption } from "@/shared/domain/filters";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { InboxItem } from "@/shared/domain/inbox";

const SORT_OPTIONS: readonly SortOption[] = [
    { id: "newest", label: "Newest first" },
    { id: "oldest", label: "Oldest first" },
];

export const InboxDrawer = () => {
    const isInboxOpen = useUiStore(state => state.isInboxOpen);
    const setIsInboxOpen = useUiStore(state => state.setIsInboxOpen);
    const isSidebarCollapsed = useUiStore(state => state.isSidebarCollapsed);
    const { data: items, isLoading } = useInboxItems();

    const filterItems = React.useCallback((items: readonly InboxItem[], query: string, filterIds: string[]) => {
        return items.filter(item => {
            // Basic filtering logic for the drawer items
            if (filterIds.length === 0) return true;
            
            const statusFilters = filterIds.filter(id => ["NEW", "RESOLVED", "ARCHIVED"].includes(id));
            const typeFilters = filterIds.filter(id => ["ARTIFACT_READY", "ERROR_ALERT", "SYSTEM_MESSAGE", "ACTION_REQUIRED"].includes(id));

            if (statusFilters.length > 0 && !statusFilters.includes(item.item_status)) return false;
            if (typeFilters.length > 0 && !typeFilters.includes(item.item_type)) return false;

            return true;
        });
    }, []);

    const {
        sortBy,
        setSortBy,
        filterGroups,
        handleClearAll,
        handleApplyFilters,
        getFilteredItems,
        getPreviewCount,
        setPendingFilterIds,
    } = useResourceFilters<InboxItem>({
        filterItems,
        initialSortBy: "newest",
        initialFilterGroups: [
            {
                id: "status",
                title: "Status:",
                type: "checkbox",
                options: [
                    { id: "NEW", label: "New", isChecked: false },
                    { id: "RESOLVED", label: "Resolved", isChecked: false },
                ]
            },
            {
                id: "type",
                title: "Type:",
                type: "checkbox",
                options: [
                    { id: "ARTIFACT_READY", label: "Artifacts", isChecked: false },
                    { id: "ERROR_ALERT", label: "Errors", isChecked: false },
                    { id: "ACTION_REQUIRED", label: "Actions", isChecked: false },
                ]
            }
        ]
    });

    const processedItems = React.useMemo(() => {
        if (!items) return [];
        const result = getFilteredItems(items);

        result.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [items, getFilteredItems, sortBy]);

    return (
        <Sheet open={isInboxOpen} onOpenChange={setIsInboxOpen}>
            <SheetContent 
                side="left" 
                showCloseButton={false}
                className={cn(
                    "w-full sm:max-w-md p-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-r border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col focus:outline-none z-[60]",
                    isSidebarCollapsed ? "left-16" : "left-64"
                )}
            >
                <SheetHeader className="p-4 border-b border-zinc-100 dark:border-zinc-900 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                            <InboxIcon className="w-4 h-4 text-zinc-500" />
                        </div>
                        <SheetTitle className="text-sm font-bold tracking-tight">Inbox</SheetTitle>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <FilterBigMenu 
                            groups={filterGroups}
                            resultsCount={getPreviewCount(items || [])}
                            onApply={handleApplyFilters}
                            onClearAll={handleClearAll}
                            onSelectionChange={setPendingFilterIds}
                            trigger={
                                <button className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-black dark:hover:text-white transition-colors group outline-none">
                                    <Filter size={14} className="group-hover:scale-110 transition-transform" />
                                    Filters
                                </button>
                            }
                        />
                        <SortMenu 
                            options={SORT_OPTIONS}
                            activeOptionId={sortBy}
                            onSelect={setSortBy}
                            trigger={
                                <button className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-black dark:hover:text-white transition-colors group outline-none">
                                    <ArrowUpDown size={14} className="group-hover:scale-110 transition-transform" />
                                    Sort
                                </button>
                            }
                        />
                        <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 mx-1" />
                        <SheetClose className="ring-offset-background focus:ring-ring rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none outline-none">
                            <X className="w-4 h-4 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors" />
                            <span className="sr-only">Close</span>
                        </SheetClose>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {isInboxOpen && (
                        <div className="p-4">
                            <InboxList items={processedItems} isLoading={isLoading} />
                        </div>
                    )}
                </div>

                {isInboxOpen && <InboxFooter count={processedItems.length} />}
            </SheetContent>
        </Sheet>
    );
};

const InboxFooter = ({ count }: { count: number }) => {
    if (count === 0) return null;

    return (
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                {count} notifications pending
            </span>
            <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20">
                Clear all
            </Button>
        </div>
    );
};
