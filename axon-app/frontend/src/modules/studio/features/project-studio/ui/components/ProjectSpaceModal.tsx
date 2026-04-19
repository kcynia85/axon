"use client";

import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Search, X, Check, AlertCircle, Plus, Component } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { ScrollArea } from "@/shared/ui/ui/ScrollArea";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { useProjectSpaceModal, BaseSpace } from "../../application/hooks/sections/useProjectSpaceModal";
import { cn } from "@/shared/lib/utils";
import { useSpaces } from "@/modules/spaces/application/hooks";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Checkbox } from "@/shared/ui/ui/Checkbox";

export interface ProjectSpaceModalProps {
        readonly isOpen: boolean;
        readonly onOpenChange: (open: boolean) => void;
        readonly selectedSpaceIds: readonly string[];
        readonly usedSpaceIds: readonly string[];
        readonly onSelectSpace: (id: string) => void;
        readonly onRemoveSpace: (id: string) => void;
        readonly onCreateNew: () => void;
}

/**
 * ProjectSpaceModal: Modal for selecting an existing space or creating a new one.
 * Blizniaczo podobny do InternalSkillsModal.
 */
export const ProjectSpaceModal = ({
        isOpen,
        onOpenChange,
        selectedSpaceIds,
        usedSpaceIds,
        onSelectSpace,
        onRemoveSpace,
        onCreateNew,
}: ProjectSpaceModalProps) => {
        const { data: spaces, isLoading } = useSpaces();

        const availableSpaces: BaseSpace[] = (spaces || []).map((space) => ({
                id: space.id,
                name: space.name,
                description: space.description || "No description provided",
                status: space.status || "Active",
                created_at: space.created_at
        }));

        const {
                searchQuery,
                setSearchQuery,
                filterGroups,
                handleApplyFilters,
                handleClearFilters,
                filteredSpaces,
                handleOpenChange,
                previewCount,
                handleSelectionChange
        } = useProjectSpaceModal(isOpen, onOpenChange, availableSpaces, selectedSpaceIds, usedSpaceIds);

        return (
                <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
                        <DialogPrimitive.Portal>
                                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

                                <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                                        <div className="bg-zinc-950 border border-zinc-800 text-white rounded-xl overflow-hidden shadow-2xl flex flex-col h-[70vh] max-h-[70vh]">
                                                {/* Header - Fixed at top */}
                                                <div className="flex flex-col border-b border-zinc-800/50 bg-zinc-950 z-10 shrink-0">
                                                        <div className="flex items-center justify-between p-6 pb-4">
                                                                <div className="space-y-1">
                                                                        <DialogPrimitive.Title className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                                                                                Dodaj Space
                                                                                <span className="text-zinc-500 font-normal text-sm ml-2 px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">
                                                                                        {filteredSpaces.length} available
                                                                                </span>
                                                                        </DialogPrimitive.Title>
                                                                        <DialogPrimitive.Description className="text-zinc-400 text-sm">
                                                                                Wybierz istniejącą przestrzeń lub utwórz nową dla tego projektu.
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
                                                                                placeholder="Szukaj przestrzeni po nazwie..."
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
                                                        </div>
                                                </div>

                                                {/* Content - Scrollable */}
                                                <ScrollArea className="flex-1 min-h-0 bg-zinc-950">
                                                        <div className="p-6">
                                                                {isLoading ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                                {[1, 2, 3, 4].map(index => <Skeleton key={index} className="h-32 w-full rounded-xl" />)}
                                                                        </div>
                                                                ) : filteredSpaces.length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                                                                        {filteredSpaces.map((space) => (
                                                                                        <div
                                                                                                key={space.id}
                                                                                                onClick={() => {
                                                                                                    console.log("Space Clicked:", space.id, "Selected:", space.isSelected);
                                                                                                    if (space.isSelected) {
                                                                                                        onRemoveSpace(space.id);
                                                                                                    } else {
                                                                                                        onSelectSpace(space.id);
                                                                                                    }
                                                                                                }}
                                                                                                className={cn(
                                                                                                        "group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none",
                                                                                                        space.isSelected
                                                                                                                ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                                                                                                                : "bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/50"
                                                                                                )}
                                                                                        >
                                                                                                <div className="pt-0.5 shrink-0 pointer-events-none">
                                                                                                        <Checkbox
                                                                                                                checked={space.isSelected}
                                                                                                                onCheckedChange={() => {}} 
                                                                                                                className="w-5 h-5 rounded-md border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                                                                                        />
                                                                                                </div>

                                                                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                                                                        <div className="flex items-center gap-2">
                                                                                                                <h4 className={cn(
                                                                                                                        "text-sm font-semibold truncate transition-colors",
                                                                                                                        space.isSelected ? "text-primary" : "text-zinc-200"
                                                                                                                )}>
                                                                                                                        {space.name}
                                                                                                                </h4>
                                                                                                                {space.status && (
                                                                                                                        <Badge
                                                                                                                                variant="secondary"
                                                                                                                                className="text-[10px] h-5 px-1.5 bg-zinc-800/50 text-zinc-400 border-none uppercase font-bold"
                                                                                                                        >
                                                                                                                                {space.status}
                                                                                                                        </Badge>
                                                                                                                )}
                                                                                                        </div>
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
                                                                                        <h3 className="text-lg font-medium text-zinc-300">Nie znaleziono przestrzeni</h3>
                                                                                        <p className="text-zinc-500 text-sm max-w-sm mx-auto">
                                                                                                Wyszukaj ponownie.
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                )}
                                                        </div>
                                                </ScrollArea>

                                                {/* Footer - Fixed at bottom */}
                                                <div className="flex justify-end p-6 border-t border-zinc-800 bg-zinc-950 shrink-0 z-20">
                                                        <Button 
                                                                className="bg-primary hover:bg-primary/90 font-bold px-8"
                                                                onClick={() => onOpenChange(false)}
                                                        >
                                                                Zaakceptuj wybór
                                                        </Button>
                                                </div>
                                        </div>
                                </DialogPrimitive.Content>
                        </DialogPrimitive.Portal>
                </DialogPrimitive.Root>
        );
};
