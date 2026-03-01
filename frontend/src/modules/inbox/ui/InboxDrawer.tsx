"use client";

import * as React from "react";
import { 
    X,
    CheckCheck,
    Filter,
    ArrowUpDown
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
import { Button } from "@/shared/ui/ui/Button";
import { useUiStore } from "@/shared/lib/store/useUiStore";
import { cn } from "@/shared/lib/utils";
import { InboxItem } from "@/shared/domain/inbox";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { SortOption } from "@/shared/domain/filters";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";

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
            if (filterIds.length === 0) return true;
            
            const statusFilters = filterIds.filter(id => ["NEW", "RESOLVED", "ARCHIVED"].includes(id));
            const typeFilters = filterIds.filter(id => ["ARTIFACT_READY", "ERROR_ALERT", "SYSTEM_MESSAGE", "ACTION_REQUIRED", "CONSULTATION", "APPROVAL_NEEDED"].includes(id));

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
                    { id: "CONSULTATION", label: "Consultations", isChecked: false },
                    { id: "APPROVAL_NEEDED", label: "Approvals", isChecked: false },
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

    const unreadCount = React.useMemo(() => 
        items?.filter(i => i.item_status === "NEW").length || 0
    , [items]);

    return (
        <Sheet open={isInboxOpen} onOpenChange={setIsInboxOpen}>
            <SheetContent 
                side="left" 
                showCloseButton={false}
                className={cn(
                    "w-full sm:max-w-md p-0 bg-white dark:bg-zinc-950 flex flex-col focus:outline-none z-[60] border-r border-zinc-100 dark:border-zinc-900",
                    isSidebarCollapsed ? "left-16" : "left-60"
                )}
            >
                {/* Clean Header */}
                <SheetHeader className="px-6 pt-6 pb-4 flex flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <SheetTitle className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100">
                            Inbox
                        </SheetTitle>
                        {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-black leading-none shadow-lg shadow-blue-500/20">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <SheetClose className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                            <X className="w-4 h-4 text-zinc-400" />
                        </SheetClose>
                    </div>
                </SheetHeader>

                {/* Actions Row - Moved up and search removed */}
                <div className="px-6 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <FilterBigMenu 
                                groups={filterGroups}
                                resultsCount={getPreviewCount(items || [])}
                                onApply={handleApplyFilters}
                                onClearAll={handleClearAll}
                                onSelectionChange={setPendingFilterIds}
                                trigger={
                                    <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors outline-none group">
                                        <Filter size={12} />
                                        Filters
                                    </button>
                                }
                            />
                            <SortMenu 
                                options={SORT_OPTIONS}
                                activeOptionId={sortBy}
                                onSelect={setSortBy}
                                trigger={
                                    <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors outline-none group">
                                        <ArrowUpDown size={12} />
                                        Sort
                                    </button>
                                }
                            />
                        </div>

                        <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors outline-none group">
                            <CheckCheck size={14} />
                            Mark all read
                        </button>
                    </div>
                </div>

                {/* Items Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar border-t border-zinc-50 dark:border-zinc-900/50 mt-0">
                    {isInboxOpen && (
                        <InboxList items={processedItems} isLoading={isLoading} />
                    )}
                </div>

                {/* Subtle Footer */}
                <div className="px-6 py-4 flex items-center justify-between opacity-40 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {processedItems.length} total
                    </span>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500">
                        Settings
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
};
