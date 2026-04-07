"use client";

import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { ScrollArea } from "@/shared/ui/ui/ScrollArea";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { useInternalSkillsModal, BaseSkill } from "../../application/hooks/sections/useInternalSkillsModal";
import { cn } from "@/shared/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { InternalTool } from "@/shared/domain/resources";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { toast } from "sonner";
import { Checkbox } from "@/shared/ui/ui/Checkbox";

export interface InternalSkillsModalProps {
        readonly isOpen: boolean;
        readonly onOpenChange: (open: boolean) => void;
        readonly addedFunctionIds: readonly string[];
        readonly onAddFunction: (id: string) => void;
        readonly onRemoveFunction: (id: string) => void;
}

/**
 * InternalSkillsModal: Modal for selecting internal Python functions.
 * Standard: Pure View pattern, Zero manual memoization.
 */
export const InternalSkillsModal = ({
        isOpen,
        onOpenChange,
        addedFunctionIds,
        onAddFunction,
        onRemoveFunction,
}: InternalSkillsModalProps) => {
        const queryClient = useQueryClient();

        const { data: internalTools, isLoading } = useQuery({
                queryKey: ["internal-tools"],
                queryFn: resourcesApi.getInternalTools,
                enabled: isOpen,
        });

        const { mutate: syncTools, isPending: isSyncing } = useMutation({
                mutationFn: resourcesApi.syncInternalTools,
                onSuccess: (syncResult) => {
                        queryClient.invalidateQueries({ queryKey: ["internal-tools"] });
                        if (syncResult.errors && syncResult.errors.length > 0) {
                                toast.warning(`Synced with errors: ${syncResult.updated} updated.`);
                        } else {
                                toast.success(`Tools synced successfully! Updated: ${syncResult.updated}`);
                        }
                },
                onError: () => toast.error("Failed to sync tools")
        });

        // Zero manual optimization - React Compiler handles it
        const availableSkills: BaseSkill[] = (internalTools || [])
                .filter((tool: InternalTool) => tool.tool_status === "production")
                .map((tool: InternalTool) => ({
                        id: tool.tool_function_name, // Use function name as ID for consistency
                        uuid: tool.id, // Pass UUID for hydration matching
                        name: tool.tool_display_name,
                        description: tool.tool_description || "No description provided",
                        category: tool.tool_category || "Internal",
                        keywords: tool.tool_keywords || []
                }));

        const {
                searchQuery,
                setSearchQuery,
                filterGroups,
                handleApplyFilters,
                handleClearFilters,
                filteredSkills,
                handleOpenChange,
                previewCount,
                handleSelectionChange
        } = useInternalSkillsModal(isOpen, onOpenChange, availableSkills, addedFunctionIds);

        return (
                <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
                        <DialogPrimitive.Portal>
                                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

                                <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                                        <div className="bg-zinc-950 border border-zinc-800 text-white rounded-xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
                                                {/* Header */}
                                                <div className="flex flex-col border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-sm z-10 shrink-0">
                                                        <div className="flex items-center justify-between p-6 pb-4">
                                                                <div className="space-y-1">
                                                                        <DialogPrimitive.Title className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                                                                Add Custom Functions
                                                                                <span className="text-zinc-500 font-normal text-sm ml-2 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                                                                                        {filteredSkills.length} available
                                                                                </span>
                                                                        </DialogPrimitive.Title>
                                                                        <DialogPrimitive.Description className="text-zinc-400 text-sm">
                                                                                Browse and select internal Python functions to attach to this agent.
                                                                        </DialogPrimitive.Description>
                                                                </div>
                                                                <DialogPrimitive.Close className="rounded-full p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-all outline-none">
                                                                        <X className="w-5 h-5" />
                                                                </DialogPrimitive.Close>
                                                        </div>

                                                        {/* Toolbar */}
                                                        <div className="px-6 pb-6 flex items-center gap-3">
                                                                <div className="relative flex-1 group">
                                                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                                                                        <input
                                                                                placeholder="Search functions by name or description..."
                                                                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                                                                value={searchQuery}
                                                                                onChange={(changeEvent) => setSearchQuery(changeEvent.target.value)}
                                                                        />
                                                                </div>
                                                                <FilterBigMenu
                                                                        groups={filterGroups}
                                                                        resultsCount={previewCount}
                                                                        onApply={handleApplyFilters}
                                                                        onSelectionChange={handleSelectionChange}
                                                                        onClearAll={handleClearFilters}
                                                                />
                                                                <Button 
                                                                        variant="outline" 
                                                                        size="icon" 
                                                                        className="rounded-xl border-zinc-800 hover:bg-zinc-900 hover:text-white shrink-0"
                                                                        onClick={() => syncTools()}
                                                                        disabled={isSyncing}
                                                                        title="Sync tools from code"
                                                                >
                                                                        <RefreshCw className={cn("w-4 h-4 text-zinc-400", isSyncing && "animate-spin")} />
                                                                </Button>
                                                        </div>
                                                </div>

                                                {/* Content */}
                                                <ScrollArea className="flex-1 bg-zinc-950">
                                                        <div className="p-6">
                                                                {isLoading ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                {[1, 2, 3, 4].map(index => <Skeleton key={index} className="h-32 w-full rounded-xl" />)}
                                                                        </div>
                                                                ) : filteredSkills.length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                {filteredSkills.map((skillFunction) => (
                                                                                        <div
                                                                                                key={skillFunction.id}
                                                                                                onClick={() =>
                                                                                                        skillFunction.isAdded ? onRemoveFunction(skillFunction.id) : onAddFunction(skillFunction.id)
                                                                                                }
                                                                                                className={cn(
                                                                                                        "group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none",
                                                                                                        skillFunction.isAdded
                                                                                                                ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                                                                                                                : "bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/50"
                                                                                                )}
                                                                                        >
                                                                                                {/* Checkbox for selection - purely visual, pointer-events-none */}
                                                                                                <div className="pt-0.5 shrink-0 pointer-events-none">
                                                                                                        <Checkbox
                                                                                                                checked={skillFunction.isAdded}
                                                                                                                onCheckedChange={() => {}} 
                                                                                                                className="w-5 h-5 rounded-md border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                                                                        />
                                                                                                </div>

                                                                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                                                                        <div className="flex items-center gap-2">
                                                                                                                <h4 className={cn(
                                                                                                                        "text-sm font-semibold truncate transition-colors",
                                                                                                                        skillFunction.isAdded ? "text-primary" : "text-zinc-200"
                                                                                                                )}>
                                                                                                                        {skillFunction.name}
                                                                                                                </h4>
                                                                                                                {skillFunction.category && (
                                                                                                                        <Badge
                                                                                                                                variant="secondary"
                                                                                                                                className="text-[10px] h-5 px-1.5 bg-zinc-800/50 text-zinc-400 border-none"
                                                                                                                        >
                                                                                                                                {skillFunction.category}
                                                                                                                        </Badge>
                                                                                                                )}
                                                                                                        </div>
                                                                                                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                                                                                                                {skillFunction.description}
                                                                                                        </p>

                                                                                                        {/* Tags/Keywords */}
                                                                                                        {skillFunction.keywords && skillFunction.keywords.length > 0 && (
                                                                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                                                                        {skillFunction.keywords
                                                                                                                                .filter(keywordTag => keywordTag !== "python" && keywordTag !== "synced")
                                                                                                                                .slice(0, 3)
                                                                                                                                .map((keywordTag, tagIndex) => (
                                                                                                                                        <span key={tagIndex} className="text-[10px] text-zinc-500 font-mono">
                                                                                                                                                #{keywordTag.toLowerCase()}
                                                                                                                                        </span>
                                                                                                                                ))}
                                                                                                                </div>
                                                                                                        )}
                                                                                                </div>
                                                                                        </div>
                                                                                ))}
                                                                        </div>
                                                                ) : (
                                                                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                                                                <div className="w-16 h-16 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center">
                                                                                        <AlertCircle className="w-8 h-8 text-zinc-600" />
                                                                                </div>
                                                                                <div className="space-y-1">
                                                                                        <h3 className="text-lg font-medium text-zinc-300">No production functions found</h3>
                                                                                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                                                                                                Only tools set to &apos;Production&apos; in local Axon Tools are available here. Sync your tools if you just changed status.
                                                                                        </p>
                                                                                </div>
                                                                                <Button 
                                                                                        variant="outline" 
                                                                                        onClick={() => syncTools()} 
                                                                                        disabled={isSyncing}
                                                                                        className="mt-4"
                                                                                >
                                                                                        <RefreshCw className={cn("w-4 h-4 mr-2", isSyncing && "animate-spin")} />
                                                                                        Sync Tools
                                                                                </Button>
                                                                        </div>
                                                                )}
                                                        </div>
                                                </ScrollArea>
                                        </div>
                                </DialogPrimitive.Content>
                        </DialogPrimitive.Portal>
                </DialogPrimitive.Root>
        );
};
