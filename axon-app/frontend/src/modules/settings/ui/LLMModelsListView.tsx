"use client";

import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/ui/ui/Table";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/shared/ui/ui/DropdownMenu";
import { Button } from "@/shared/ui/ui/Button";
import { 
    MoreHorizontal, 
    Pencil, 
    Trash2, 
    Search,
    Filter,
    Info,
    ArrowUpDown,
    RefreshCw,
    AlertCircle
} from "lucide-react";
import { Input } from "@/shared/ui/ui/Input";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { cn } from "@/shared/lib/utils";
import { Tooltip } from "@/shared/ui/ui/Tooltip";
import { LLMModelSidePeek } from "./LLMModelSidePeek";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { SortMenu } from "@/shared/ui/complex/SortMenu";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { LLMModelsListViewProps } from "./LLMModelsListView.types";

const SORT_OPTIONS = [
    { id: "name_asc", label: "Name (A-Z)" },
    { id: "name_desc", label: "Name (Z-A)" },
    { id: "context_desc", label: "Context (Largest First)" },
    { id: "context_asc", label: "Context (Smallest First)" },
    { id: "price_in_asc", label: "Input Cost (Lowest First)" },
    { id: "price_out_asc", label: "Output Cost (Lowest First)" },
];

/**
 * LLMModelsListView: Pure view component for displaying LLM models.
 * Standard: Pure View pattern, 0% logic, 0% useEffect.
 */
export const LLMModelsListView = ({
    search,
    onSearchChange,
    sortBy,
    onSortChange,
    activeFilters,
    filterGroups,
    onRemoveFilter,
    onClearAllFilters,
    onApplyFilters,
    onSelectionChange,
    filteredModels,
    previewCount,
    isLoading,
    isSyncingPricing,
    onSyncAllVisible,
    getProviderName,
    onEditModel,
    onDeleteModel,
    selectedModel,
    onSelectedModelChange,
    deleteModalOpen,
    onDeleteModalOpenChange,
    onDeleteConfirm,
    modelToDeleteName,
    affectedResources,
    isLoadingUsage,
    lastSyncedInfo
}: LLMModelsListViewProps) => {

    if (isLoading) {
        return <Skeleton className="h-64 w-full rounded-2xl" />;
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-8 flex-1">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <Input
                                placeholder="Search models by name or id..."
                                className="pl-10 h-[52px] text-xs border-zinc-200 dark:border-zinc-800"
                                value={search}
                                onChange={(event) => onSearchChange(event.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-6 h-9">
                            <FilterBigMenu
                                groups={filterGroups}
                                resultsCount={previewCount}
                                onApply={onApplyFilters}
                                onSelectionChange={onSelectionChange}
                                onClearAll={onClearAllFilters}
                                trigger={
                                    <div className={cn(
                                        "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent transition-all pb-1.5 cursor-pointer group outline-none translate-y-[2px]",
                                        activeFilters.length > 0 
                                            ? "text-black dark:text-white border-black dark:border-white" 
                                            : "text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white"
                                    )}>
                                        <Filter size={14} className="group-hover:scale-110 transition-transform" />
                                        <span>Filters</span>
                                        {activeFilters.length > 0 && (
                                            <Badge variant="secondary" className="ml-0.5 h-4 min-w-4 px-1 rounded-full text-[9px] font-black bg-black dark:bg-white text-white dark:text-black">
                                                {activeFilters.length}
                                            </Badge>
                                        )}
                                    </div>
                                }
                            />

                            <SortMenu 
                                options={SORT_OPTIONS}
                                activeOptionId={sortBy}
                                onSelect={onSortChange}
                                trigger={
                                    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-1.5 cursor-pointer group outline-none translate-y-[2px]">
                                        <ArrowUpDown size={14} className="group-hover:scale-110 transition-transform" />
                                        <span>Sort</span>
                                    </div>
                                }
                            />
                        </div>
                    </div>

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onSyncAllVisible}
                        disabled={isSyncingPricing || filteredModels.length === 0}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-zinc-500 hover:text-white"
                    >
                        <RefreshCw size={14} className={cn(isSyncingPricing && "animate-spin")} />
                        Sync Pricing
                    </Button>
                </div>

                <FilterBar 
                    activeFilters={activeFilters}
                    onRemove={onRemoveFilter}
                    onClearAll={onClearAllFilters}
                />
            </div>

            <div className="border rounded-md bg-background overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Model Name</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest">Status</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">Context</TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    In
                                    <Tooltip content="Koszt za 1 mln tokenów">
                                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                                    </Tooltip>
                                </div>
                            </TableHead>
                            <TableHead className="text-[10px] uppercase font-bold tracking-widest text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                    Out
                                    <Tooltip content="Koszt za 1 mln tokenów">
                                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                                    </Tooltip>
                                </div>
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredModels?.map((model) => (
                            <TableRow 
                                key={model.id} 
                                className="group h-[56px] hover:bg-muted/10 even:bg-muted/15 cursor-pointer"
                                onClick={() => onSelectedModelChange(model.id)}
                            >
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-base font-bold">{model.model_display_name}</span>
                                        <span className="text-xs text-muted-foreground font-mono">{getProviderName(model.llm_provider_id)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-black transition-all",
                                        model.is_available 
                                            ? "bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.3)]" 
                                            : "bg-zinc-800 text-zinc-500 border border-zinc-700 opacity-50"
                                    )}>
                                        {model.is_available ? "Dostępny" : "Niedostępny"}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-base font-mono">
                                    <span suppressHydrationWarning>{model.model_context_window.toLocaleString()}</span>
                                </TableCell>
                                <TableCell className="text-right text-base font-mono">
                                    ${((model.model_pricing_config.input as number) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-right text-base font-mono">
                                    ${((model.model_pricing_config.output as number) || 0).toFixed(2)}
                                </TableCell>
                                <TableCell onClick={(e) => e.stopPropagation()} className="w-[50px]">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 transition-opacity border-none">
                                                <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <DropdownMenuItem onClick={() => onEditModel(model)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit Model
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                className="text-red-500 focus:text-red-500" 
                                                onClick={() => onDeleteModel(model.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Model
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredModels?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic text-xs">
                                    No models in inventory.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col gap-2 px-2 pt-2">
                {lastSyncedInfo?.errors && lastSyncedInfo.errors.length > 0 && (
                    <div className="flex items-start gap-2 text-red-500 bg-red-500/5 p-3 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest">Błędy synchronizacji:</span>
                            {lastSyncedInfo.errors.map((error, index) => (
                                <span key={index} className="text-xs font-mono">{error}</span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 text-zinc-500 justify-end">
                    <Info className="w-4 h-4" />
                    <span className="text-xs font-mono text-right">
                        {lastSyncedInfo?.newestSync 
                            ? `Ostatnia udana aktualizacja: ${lastSyncedInfo.newestSync.toLocaleString()} (Auto co 24h)`
                            : "Brak zsynchronizowanych cenników (Auto co 24h)"}
                    </span>
                </div>
            </div>

            <LLMModelSidePeek 
                model={selectedModel}
                isOpen={!!selectedModel}
                onClose={() => onSelectedModelChange(null)}
                onDelete={onDeleteModel}
                onEdit={onEditModel}
                providerName={selectedModel ? getProviderName(selectedModel.llm_provider_id) : undefined}
            />

            <DestructiveDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => onDeleteModalOpenChange(false)}
                onConfirm={onDeleteConfirm}
                title="Usuń Model"
                resourceName={modelToDeleteName || "Model"}
                affectedResources={affectedResources as any}
                isLoading={isLoadingUsage}
            />
        </div>
    );
};
