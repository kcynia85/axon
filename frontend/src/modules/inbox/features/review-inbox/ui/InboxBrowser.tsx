"use client";

import React, { useMemo } from "react";
import { Filter, ArrowUpDown, FileText, Code, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { SortOption } from "@/shared/domain/filters";
import { InboxItem } from "../../../domain";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/ui/Button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/ui/ui/Table";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { FilterPill } from "@/shared/ui/complex/FilterPill";
import { StatusBadge, StatusVariant } from "@/shared/ui/complex/StatusBadge";

interface InboxBrowserProps {
  readonly initialItems: readonly InboxItem[];
}

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
  { id: "title-asc", label: "Title (A-Z)" },
  { id: "title-desc", label: "Title (Z-A)" },
];

const getIcon = (type: string) => {
    switch(type) {
        case 'DOCUMENT': return FileText;
        case 'CODE': return Code;
        case 'IMAGE': return ImageIcon;
        default: return FileText;
    }
};

const getStatusVariant = (status: string): StatusVariant => {
    switch(status) {
        case 'DRAFT': return 'default';
        case 'REVIEW': return 'review';
        case 'APPROVED': return 'success';
        case 'REJECTED': return 'error';
        default: return 'default';
    }
};

export const InboxBrowser: React.FC<InboxBrowserProps> = ({ initialItems }) => {
  const filterItems = (items: readonly InboxItem[], query: string, filterIds: string[]) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(query.toLowerCase()) || 
                           item.projectName.toLowerCase().includes(query.toLowerCase());
      if (!matchesSearch) return false;

      if (filterIds.length === 0) return true;

      const statusFilters = filterIds.filter(id => ['DRAFT', 'REVIEW', 'APPROVED', 'REJECTED'].includes(id));
      const typeFilters = filterIds.filter(id => ['DOCUMENT', 'CODE', 'IMAGE'].includes(id));

      if (statusFilters.length > 0 && !statusFilters.includes(item.status)) return false;
      if (typeFilters.length > 0 && !typeFilters.includes(item.type)) return false;

      return true;
    });
  };

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeFilters,
    filterGroups,
    handleToggleFilter,
    handleRemoveFilter,
    handleClearAll,
    handleApplyFilters,
    getFilteredItems,
    getPreviewCount,
    setPendingFilterIds,
  } = useResourceFilters<InboxItem>({
    filterItems,
    initialSortBy: "date-desc",
    initialFilterGroups: [
      {
        id: "status",
        title: "Status:",
        type: "checkbox",
        options: [
          { id: "DRAFT", label: "Draft", isChecked: false },
          { id: "REVIEW", label: "Review", isChecked: false },
          { id: "APPROVED", label: "Approved", isChecked: false },
          { id: "REJECTED", label: "Rejected", isChecked: false },
        ]
      },
      {
        id: "type",
        title: "Type:",
        type: "checkbox",
        options: [
          { id: "DOCUMENT", label: "Document", isChecked: false },
          { id: "CODE", label: "Code", isChecked: false },
          { id: "IMAGE", label: "Image", isChecked: false },
        ]
      }
    ]
  });

  const processedItems = useMemo(() => {
    const result = getFilteredItems(initialItems);

    result.sort((a, b) => {
      switch (sortBy) {
        case "title-asc": return a.title.localeCompare(b.title);
        case "title-desc": return b.title.localeCompare(a.title);
        case "date-asc": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "date-desc": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0;
      }
    });

    return result;
  }, [initialItems, getFilteredItems, sortBy]);

  return (
    <BrowserLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search inbox..."
        activeFilters={activeFilters.length > 0 && (
          <FilterBar 
            activeFilters={activeFilters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        )}
        filters={
          <>
            <FilterPill 
              label="By Status" 
              group={filterGroups.find(g => g.id === 'status')} 
              activeFilters={activeFilters}
              onToggle={handleToggleFilter}
            />
            <FilterPill 
              label="By Type" 
              group={filterGroups.find(g => g.id === 'type')} 
              activeFilters={activeFilters}
              onToggle={handleToggleFilter}
            />
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
            <FilterBigMenu 
              groups={filterGroups}
              resultsCount={getPreviewCount(initialItems)}
              onApply={handleApplyFilters}
              onClearAll={handleClearAll}
              onSelectionChange={setPendingFilterIds}
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
            options={SORT_OPTIONS}
            activeOptionId={sortBy}
            onSelect={setSortBy}
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
              {processedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-zinc-500 font-mono text-xs">
                    No items found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                processedItems.map((item) => {
                  const Icon = getIcon(item.type);
                  return (
                    <TableRow key={item.id} className="group hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] border-zinc-100 dark:border-zinc-900 transition-colors">
                      <TableCell className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                            <Icon size={18} />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{item.title}</span>
                            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tight" suppressHydrationWarning>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 px-6">
                        <span className="text-xs font-medium text-zinc-500">{item.projectName}</span>
                      </TableCell>
                      <TableCell className="py-5 px-6">
                        <StatusBadge status={item.status} variant={getStatusVariant(item.status)} />
                      </TableCell>
                      <TableCell className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-black uppercase tracking-widest border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-950/30">
                            <XCircle size={14} className="mr-1.5" />
                            Reject
                          </Button>
                          <Button size="sm" className="h-8 px-3 text-[10px] font-black uppercase tracking-widest bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                            <CheckCircle size={14} className="mr-1.5" />
                            Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
    </BrowserLayout>
  );
};
