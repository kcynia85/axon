"use client";

import React, { useState, useMemo, memo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, Filter, CheckCircle2, Plus, X, Zap, BarChart3, AlertCircle, Info, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/ui/Button";
import { Input } from "@/shared/ui/ui/Input";
import { Badge } from "@/shared/ui/ui/Badge";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import type { ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { useVirtualizer } from "@tanstack/react-virtual";

export interface AvailableModel {
    id: string;
    name: string;
    description?: string;
    context_window: number;
    pricing_input: number;
    pricing_output: number;
}

const FILTER_GROUPS: readonly FilterGroup[] = [
    {
        id: "capabilities",
        title: "Capabilities",
        type: "checkbox",
        options: [
            { id: "context-128k", label: "Context > 128k", isChecked: false },
            { id: "reasoning", label: "Reasoning", isChecked: false },
        ]
    },
    {
        id: "price",
        title: "Pricing",
        type: "checkbox",
        options: [
            { id: "cheap", label: "Cheap (< $1/1M)", isChecked: false },
            { id: "premium", label: "Premium (> $10/1M)", isChecked: false },
        ]
    }
];

const ModelCard = memo(({ 
    model, 
    isInstalled, 
    onSelect 
}: { 
    model: AvailableModel; 
    isInstalled: boolean; 
    onSelect: (model: AvailableModel) => void 
}) => {
    const parts = model.id.split('/');
    const provider = parts.length > 1 ? parts[0] : "";
    const promptPrice1M = model.pricing_input || 0;
    const completionPrice1M = model.pricing_output || 0;

    return (
        <div 
            onClick={() => !isInstalled && onSelect(model)}
            className={cn(
                "group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none h-[88px]",
                isInstalled
                    ? "bg-primary/5 border-primary/20 cursor-default"
                    : "bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/50"
            )}
        >
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col min-w-0">
                        <h4 className={cn(
                            "text-sm font-bold truncate transition-colors",
                            isInstalled ? "text-primary" : "text-zinc-200 group-hover:text-primary"
                        )}>
                            {model.name}
                        </h4>
                        {provider && <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 shrink-0">{provider}</span>}
                    </div>
                    {isInstalled && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-bold uppercase shrink-0">Installed</Badge>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-3 h-3 opacity-30 text-zinc-400" />
                        <span className="text-[10px] font-mono text-zinc-400">
                            ${promptPrice1M.toFixed(2)} / ${completionPrice1M.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 opacity-30 text-amber-500/50" />
                        <span className="text-[10px] font-mono text-zinc-400">
                            {(model.context_window / 1000).toFixed(0)}k
                        </span>
                    </div>
                </div>
            </div>

            {!isInstalled && (
                <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="p-2 bg-white text-black rounded-lg shadow-lg">
                        <Plus className="w-3.5 h-3.5" />
                    </div>
                </div>
            )}
        </div>
    );
});

ModelCard.displayName = "ModelCard";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (model: AvailableModel) => void;
    installedModelId?: string;
    models: AvailableModel[];
    isLoading: boolean;
}

export const OpenRouterMarketplace = ({ isOpen, onOpenChange, onSelect, installedModelId, models, isLoading }: Props) => {
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = useState<string[]>([]);
    const parentRef = React.useRef<HTMLDivElement>(null);

    const filteredModels = useMemo(() => {
        return models.filter(model => {
            const matchesSearch = model.name.toLowerCase().includes(search.toLowerCase()) || 
                                 model.id.toLowerCase().includes(search.toLowerCase());
            
            const promptPrice = model.pricing_input || 0;
            
            const matchesFilters = activeFilters.every(filter => {
                const filterId = filter.id;
                if (filterId === "context-128k") return model.context_window >= 128000;
                if (filterId === "cheap") return promptPrice < 1.00;
                if (filterId === "premium") return promptPrice > 10.00;
                if (filterId === "reasoning") return model.id.includes("claude") || model.id.includes("gpt-4") || model.id.includes("r1") || model.id.includes("o1") || model.description?.toLowerCase().includes("reasoning");
                return true;
            });

            return matchesSearch && matchesFilters;
        });
    }, [models, search, activeFilters]);

    // Calculate preview count based on pending filters
    const previewCount = useMemo(() => {
        return models.filter(model => {
            const matchesSearch = model.name.toLowerCase().includes(search.toLowerCase()) || 
                                 model.id.toLowerCase().includes(search.toLowerCase());
            
            const promptPrice = model.pricing_input || 0;
            
            const matchesFilters = pendingFilterIds.length === 0 || pendingFilterIds.every(filterId => {
                if (filterId === "context-128k") return model.context_window >= 128000;
                if (filterId === "cheap") return promptPrice < 1.00;
                if (filterId === "premium") return promptPrice > 10.00;
                if (filterId === "reasoning") return model.id.includes("claude") || model.id.includes("gpt-4") || model.id.includes("r1") || model.id.includes("o1") || model.description?.toLowerCase().includes("reasoning");
                return true;
            });

            return matchesSearch && matchesFilters;
        }).length;
    }, [models, search, pendingFilterIds]);

    // Grid virtualization: 2 items per row
    const rowCount = Math.ceil(filteredModels.length / 2);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 104, 
        overscan: 5,
    });

    const filterGroups = useMemo(() => {
        const activeIds = activeFilters.map(f => f.id);
        return FILTER_GROUPS.map(group => ({
            ...group,
            options: group.options.map(opt => ({
                ...opt,
                isChecked: activeIds.includes(opt.id)
            }))
        }));
    }, [activeFilters]);

    const handleApplyFilters = (selectedIds: string[]) => {
        const newActiveFilters: ActiveFilter[] = [];
        FILTER_GROUPS.forEach(group => {
            group.options.forEach(opt => {
                if (selectedIds.includes(opt.id)) {
                    newActiveFilters.push({
                        id: opt.id,
                        label: opt.label,
                        category: group.id
                    });
                }
            });
        });
        setActiveFilters(newActiveFilters);
        setPendingFilterIds(selectedIds);
    };

    const handleSelectionChange = (selectedIds: string[]) => {
        setPendingFilterIds(selectedIds);
    };

    const handleRemoveFilter = (filterId: string) => {
        setActiveFilters(prev => prev.filter(f => f.id !== filterId));
        setPendingFilterIds(prev => prev.filter(id => id !== filterId));
    };

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setPendingFilterIds(activeFilters.map(f => f.id));
        }
        onOpenChange(open);
    };

    return (
        <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

                <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 outline-none">
                    <div className="bg-zinc-950 border border-zinc-800 text-white rounded-xl overflow-hidden shadow-2xl flex flex-col h-[85vh] max-h-[85vh]">
                        {/* Header */}
                        <div className="flex flex-col border-b border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm z-10 shrink-0">
                            <div className="flex items-center justify-between p-8 pb-6">
                                <div className="space-y-1">
                                    <DialogPrimitive.Title className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
                                        OpenRouter Marketplace
                                        <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-[0.2em] ml-4 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800">
                                            {isLoading ? "..." : models.length} Modele
                                        </span>
                                    </DialogPrimitive.Title>
                                    <DialogPrimitive.Description className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                                        Katalog modeli od Meta-Dostawcy.
                                    </DialogPrimitive.Description>
                                </div>
                                <DialogPrimitive.Close asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10 transition-all outline-none">
                                        <X className="w-4 h-4" />
                                    </Button>
                                </DialogPrimitive.Close>
                            </div>

                            {/* Toolbar */}
                            <div className="px-8 pb-4 flex items-center gap-4">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                                    <Input 
                                        placeholder="Szukaj modeli (np. Claude, GPT-4, Llama)..." 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl h-12 pl-12 pr-4 text-base text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                    />
                                </div>
                                
                                <FilterBigMenu
                                    groups={filterGroups}
                                    resultsCount={previewCount}
                                    onApply={handleApplyFilters}
                                    onSelectionChange={handleSelectionChange}
                                    onClearAll={() => { setActiveFilters([]); setPendingFilterIds([]); }}
                                    trigger={
                                        <Button 
                                            variant="outline" 
                                            className={cn(
                                                "h-12 px-6 rounded-xl border-zinc-800 bg-zinc-900/50 gap-2 font-mono text-[10px] uppercase tracking-widest transition-all hover:bg-zinc-800 hover:border-zinc-700",
                                                activeFilters.length > 0 && "border-primary/50 text-primary bg-primary/5"
                                            )}
                                        >
                                            <Filter className="w-3.5 h-3.5" />
                                            Filtry
                                            {activeFilters.length > 0 && (
                                                <Badge className="ml-1 bg-primary text-white border-none h-4 min-w-4 flex items-center justify-center rounded-full p-0 text-[8px]">
                                                    {activeFilters.length}
                                                </Badge>
                                            )}
                                        </Button>
                                    }
                                />
                            </div>

                            {/* Active Filters Bar */}
                            {activeFilters.length > 0 && (
                                <div className="px-8 pb-6 border-b border-zinc-900/50">
                                    <FilterBar 
                                        activeFilters={activeFilters}
                                        onRemove={handleRemoveFilter}
                                        onClearAll={() => setActiveFilters([])}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div 
                            ref={parentRef}
                            className="flex-1 overflow-y-auto bg-zinc-950 custom-scrollbar min-h-0"
                        >
                            <div className="p-8">
                                {isLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                            <div key={i} className="bg-zinc-900/30 border border-zinc-800/60 p-4 rounded-xl space-y-4 h-[88px]">
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2 flex-1">
                                                        <Skeleton className="h-2 w-16 bg-zinc-800/50" />
                                                        <Skeleton className="h-4 w-32 bg-zinc-800/50" />
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <Skeleton className="h-3 w-20 bg-zinc-800/50" />
                                                    <Skeleton className="h-3 w-12 bg-zinc-800/50" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : filteredModels.length > 0 ? (
                                    <div 
                                        style={{
                                            height: `${rowVirtualizer.getTotalSize()}px`,
                                            width: '100%',
                                            position: 'relative',
                                        }}
                                    >
                                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                            const startIndex = virtualRow.index * 2;
                                            const rowModels = filteredModels.slice(startIndex, startIndex + 2);
                                            
                                            return (
                                                <div
                                                    key={virtualRow.key}
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: `${virtualRow.size}px`,
                                                        transform: `translateY(${virtualRow.start}px)`,
                                                        paddingBottom: '16px' 
                                                    }}
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                                >
                                                    {rowModels.map((model) => (
                                                        <ModelCard 
                                                            key={model.id}
                                                            model={model}
                                                            isInstalled={installedModelId === model.id}
                                                            onSelect={onSelect}
                                                        />
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
                                        <div className="w-16 h-16 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                                            <AlertCircle className="w-8 h-8 text-zinc-700" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold text-zinc-300">Brak dopasowań</h3>
                                            <p className="text-zinc-500 text-xs max-w-sm mx-auto font-mono italic">
                                                Spróbuj zmienić filtry lub wyszukiwaną frazę.
                                            </p>
                                        </div>
                                        <Button variant="outline" onClick={() => { setSearch(""); setActiveFilters([]); }} className="border-zinc-800 hover:bg-zinc-900 rounded-xl h-10 text-xs">
                                            Wyczyść wszystko
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-zinc-800 bg-zinc-950 shrink-0 flex items-center justify-between">
                            <div className="flex items-center gap-3 text-zinc-600">
                                <Info className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-mono uppercase tracking-[0.2em]">Ceny netto, synchronizowane z OpenRouter</span>
                            </div>
                            <Button 
                                variant="ghost" 
                                onClick={() => onOpenChange(false)} 
                                className="text-zinc-500 hover:text-white font-mono text-[9px] uppercase tracking-[0.3em] hover:bg-white/5 px-6 h-10 rounded-xl"
                            >
                                Zamknij Katalog
                            </Button>
                        </div>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};
