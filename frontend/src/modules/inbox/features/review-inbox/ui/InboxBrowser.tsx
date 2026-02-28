"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, ArrowUpDown, ChevronDown, Check, FileText, Code, Image as ImageIcon, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { InboxItem } from "../../../domain";
import { cn } from "@/shared/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/shared/ui/ui/DropdownMenu";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/shared/ui/ui/Table";

interface InboxBrowserProps {
  readonly initialItems: readonly InboxItem[];
}

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
  { id: "title-asc", label: "Title (A-Z)" },
  { id: "title-desc", label: "Title (Z-A)" },
];

/**
 * Filter Pill Component (Consistent with ProjectList)
 */
const FilterPill: React.FC<{
  label: string;
  group: FilterGroup | undefined;
  activeFilters: readonly ActiveFilter[];
  onToggle: (id: string) => void;
}> = ({ label, group, activeFilters, onToggle }) => {
  if (!group) return null;

  const activeInGroup = activeFilters.filter(f => f.category === group.id);
  const isActive = activeInGroup.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn(
          "flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border",
          isActive 
            ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white shadow-lg" 
            : "bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100"
        )}>
          {label}
          {isActive && (
            <span className="flex items-center justify-center bg-yellow-400 text-black rounded-full min-w-[14px] h-3.5 px-1 text-[8px] font-black">
              {activeInGroup.length}
            </span>
          )}
          <ChevronDown size={10} className={cn("transition-transform opacity-60", isActive ? "text-white dark:text-black" : "text-zinc-400")} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 rounded-xl p-2 shadow-2xl z-50">
        {group.options.map((opt) => {
          const isChecked = activeFilters.some(f => f.id === opt.id);
          return (
            <DropdownMenuItem
              key={opt.id}
              onClick={(e) => {
                e.preventDefault();
                onToggle(opt.id);
              }}
              className="flex items-center gap-3 py-2 px-3 cursor-pointer hover:bg-zinc-100/50 dark:hover:bg-white/5 rounded-lg transition-colors group/item"
            >
              <div className={cn(
                "w-3.5 h-3.5 border border-zinc-600 rounded-sm flex items-center justify-center transition-all shrink-0",
                isChecked 
                  ? "bg-white border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]" 
                  : "group-hover/item:border-zinc-400"
              )}>
                {isChecked && <Check size={10} className="text-black stroke-[4]" />}
              </div>
              <span className={cn(
                "text-[11px] font-mono transition-colors truncate",
                isChecked ? "text-black dark:text-white font-bold" : "text-zinc-500 group-hover/item:text-zinc-800 dark:group-hover/item:text-zinc-300"
              )}>
                {opt.label}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const getIcon = (type: string) => {
    switch(type) {
        case 'DOCUMENT': return FileText;
        case 'CODE': return Code;
        case 'IMAGE': return ImageIcon;
        default: return FileText;
    }
};

export const InboxBrowser: React.FC<InboxBrowserProps> = ({ initialItems }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  
  // Active filters state
  const [activeFilters, setActiveFilters] = useState<readonly ActiveFilter[]>([]);
  const [pendingFilterIds, setPendingFilterIds] = useState<string[]>([]);

  // Filter groups
  const [filterGroups, setFilterGroups] = useState<readonly FilterGroup[]>([
    {
      id: "status",
      title: "Status:",
      type: "checkbox",
      options: [
        { id: "NEW", label: "New", isChecked: false },
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
  ]);

  const handleRemoveFilter = (id: string) => {
    const nextFilters = activeFilters.filter(f => f.id !== id);
    setActiveFilters(nextFilters);
    setPendingFilterIds(nextFilters.map(f => f.id));
    
    setFilterGroups(prev => prev.map(group => ({
      ...group,
      options: group.options.map(opt => 
        opt.id === id ? { ...opt, isChecked: false } : opt
      )
    })));
  };

  const handleToggleFilter = (id: string) => {
    const isCurrentlyActive = activeFilters.some(f => f.id === id);
    if (isCurrentlyActive) {
      handleRemoveFilter(id);
    } else {
      const actualGroup = filterGroups.find(g => g.options.some(o => o.id === id));
      const option = actualGroup?.options.find(o => o.id === id);
      
      if (actualGroup && option) {
        const newActiveFilters = [...activeFilters, { id: option.id, label: option.label, category: actualGroup.id }];
        setActiveFilters(newActiveFilters);
        setPendingFilterIds(newActiveFilters.map(f => f.id));
        setFilterGroups(prev => prev.map(g => g.id === actualGroup.id ? {
          ...g,
          options: g.options.map(o => o.id === id ? { ...o, isChecked: true } : o)
        } : g));
      }
    }
  };

  const handleClearAll = () => {
    setActiveFilters([]);
    setPendingFilterIds([]);
    setFilterGroups(prev => prev.map(group => ({
      ...group,
      options: group.options.map(opt => ({ ...opt, isChecked: false }))
    })));
  };

  const handleApplyFilters = (selectedIds: string[]) => {
    setPendingFilterIds(selectedIds);
    const newActiveFilters: ActiveFilter[] = [];
    
    setFilterGroups(prev => prev.map(group => {
      const newOptions = group.options.map(opt => {
        const isChecked = selectedIds.includes(opt.id);
        if (isChecked) {
          newActiveFilters.push({ id: opt.id, label: opt.label, category: group.id });
        }
        return { ...opt, isChecked };
      });
      return { ...group, options: newOptions };
    }));
    
    setActiveFilters(newActiveFilters);
  };

  const processedItems = useMemo(() => {
    let result = initialItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.projectName.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (activeFilters.length === 0) return true;

      const statusFilters = activeFilters.filter(f => f.category === 'status').map(f => f.id);
      const typeFilters = activeFilters.filter(f => f.category === 'type').map(f => f.id);

      if (statusFilters.length > 0 && !statusFilters.includes(item.status)) return false;
      if (typeFilters.length > 0 && !typeFilters.includes(item.type)) return false;

      return true;
    });

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
  }, [initialItems, searchQuery, sortBy, activeFilters]);

  return (
    <div className="space-y-12">
      <div className="flex flex-col space-y-8">
        {/* Row 1: Search */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
          <Input 
            placeholder="Search Bar" 
            className="pl-10 h-11 border-zinc-200 dark:border-zinc-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Row 2: Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-col space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Active Filters</span>
            <FilterBar 
              activeFilters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
              className="px-1"
            />
          </div>
        )}
      </div>

      {/* Row 3: Filters (Left) and Sort (Right) */}
      <div className="flex flex-wrap items-center justify-between gap-6 pb-2 border-b border-zinc-100 dark:border-zinc-900">
        
        {/* Filters Group (Left) */}
        <div className="flex items-center gap-4 px-1">
          <div className="flex items-center gap-3">
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
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

          <FilterBigMenu 
            groups={filterGroups}
            resultsCount={processedItems.length}
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
        </div>

        {/* Sort Group (Right) */}
        <div className="flex items-center gap-10">
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
        </div>
      </div>

      {/* Items List (Table for consistency with Inbox concept) */}
      <div className="pt-2">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md overflow-hidden shadow-sm">
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
                        <Badge variant={item.status === 'NEW' || item.status === 'REVIEW' ? 'default' : 'secondary'} className={cn(
                          "text-[9px] font-black px-2 py-0.5",
                          item.status === 'NEW' && "bg-blue-500 text-white border-none",
                          item.status === 'REVIEW' && "bg-amber-500 text-white border-none",
                          item.status === 'APPROVED' && "bg-emerald-500 text-white border-none",
                          item.status === 'REJECTED' && "bg-rose-500 text-white border-none",
                        )}>
                          {item.status}
                        </Badge>
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
      </div>
    </div>
  );
};
