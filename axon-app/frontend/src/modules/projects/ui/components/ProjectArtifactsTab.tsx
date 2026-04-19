import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectArtifactsTabProps } from "../types";
import { ProjectDetailsContentGroup, ProjectDetailsArtifactItem } from "./ProjectDetailsLayout";
import { BaseDiv, BaseSpan, BaseHeading3, BaseParagraph } from "./ProjectBaseAtoms";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { CheckCircle2, Clock, Filter } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { FilterBigMenu } from "@/shared/ui/complex/FilterBigMenu";
import { FilterGroup } from "@/shared/domain/filters";

/**
 * ProjectArtifactsTab - Presentation component for displaying project artifacts.
 * Uses Axon standard BigNav filtering style and simple list-based artifact items.
 */
export const ProjectArtifactsTab: React.FC<ProjectArtifactsTabProps> = ({ artifacts, isLoading, spaces }) => {
    const [activeFilter, setActiveFilter] = useState<string>("Wszystkie");
    const router = useRouter();

    if (isLoading) {
        return (
            <ProjectDetailsContentGroup>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </ProjectDetailsContentGroup>
        );
    }

    // Extract unique spaces from artifacts sourcePath if not provided
    const displaySpaces = (spaces && spaces.length > 0) 
        ? spaces.map(s => s.name)
        : Array.from(new Set(
            artifacts
                .map(a => a.sourcePath.split('/')[0])
                .filter(Boolean)
        )).sort();

    // Filter artifacts based on the selected space
    const filteredArtifacts = artifacts.filter(artifact => {
        if (activeFilter === "Wszystkie") return true;
        
        const matchingSpace = spaces?.find(s => s.name === activeFilter);
        if (matchingSpace) {
             return artifact.sourcePath.toLowerCase().startsWith(matchingSpace.name.toLowerCase() + '/');
        }

        return artifact.sourcePath.toLowerCase().startsWith(activeFilter.toLowerCase() + '/');
    });

    // Map spaces to FilterGroups for FilterBigMenu compatibility
    const spaceFilterGroup: FilterGroup = {
        id: "spaces",
        title: "Spaces",
        type: "checkbox",
        options: displaySpaces.map(name => ({
            id: name,
            label: name,
            isChecked: activeFilter === name
        }))
    };

    const handleApplyFilters = (selectedIds: string[]) => {
        if (selectedIds.length > 0) {
            setActiveFilter(selectedIds[0]);
        } else {
            setActiveFilter("Wszystkie");
        }
    };

    const handleArtifactClick = (spaceId?: string, nodeId?: string) => {
        if (spaceId) {
            const url = new URL(`${window.location.origin}/spaces/${spaceId}`);
            if (nodeId) {
                url.searchParams.set("focus_node", nodeId);
                url.searchParams.set("inspector_tab", "artefacts");
            }
            router.push(url.pathname + url.search);
        }
    };

    return (
        <ProjectDetailsContentGroup>
            {/* Axon BigNav Style Filter */}
            <div className="flex items-center justify-between gap-6 pb-6 mb-4 border-b border-zinc-100 dark:border-zinc-900/50">
                <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveFilter("Wszystkie")}
                        className={cn(
                            "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all pb-2 outline-none cursor-pointer whitespace-nowrap",
                            activeFilter === "Wszystkie"
                                ? "border-black dark:border-white text-black dark:text-white"
                                : "border-transparent text-zinc-500 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
                        )}
                    >
                        Wszystkie
                    </button>
                    
                    {displaySpaces.slice(0, 4).map(spaceName => (
                        <button
                            key={spaceName}
                            onClick={() => setActiveFilter(spaceName)}
                            className={cn(
                                "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all pb-2 outline-none cursor-pointer whitespace-nowrap",
                                activeFilter === spaceName
                                    ? "border-black dark:border-white text-black dark:text-white"
                                    : "border-transparent text-zinc-500 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
                            )}
                        >
                            {spaceName}
                        </button>
                    ))}

                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 shrink-0" />

                    <FilterBigMenu 
                        groups={[spaceFilterGroup]}
                        resultsCount={filteredArtifacts.length}
                        onApply={handleApplyFilters}
                        onClearAll={() => setActiveFilter("Wszystkie")}
                        trigger={
                            <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 group outline-none cursor-pointer">
                                <Filter size={12} className="group-hover:scale-110 transition-transform" />
                                More
                            </button>
                        }
                    />
                </div>
            </div>

            <BaseDiv className="flex flex-col space-y-8 mt-4">
                {filteredArtifacts.length > 0 ? (
                    filteredArtifacts.map((artifact) => (
                        <div key={artifact.id} onClick={() => handleArtifactClick(artifact.spaceId, artifact.nodeId)}>
                            <ProjectDetailsArtifactItem>
                                <BaseHeading3 className="text-base font-bold group-hover:underline underline-offset-4 text-white">
                                    {artifact.name}
                                </BaseHeading3>
                                <BaseParagraph className="text-[12px] font-bold text-zinc-500">
                                    {artifact.sourcePath.toLowerCase()}
                                </BaseParagraph>
                                <BaseDiv className="flex items-center gap-2">
                                    {artifact.statusVariant === 'success' ? (
                                        <BaseSpan className="text-[12px] font-bold text-emerald-500 flex items-center gap-1.5">
                                            <CheckCircle2 size={12} />
                                            {artifact.statusLabel}
                                        </BaseSpan>
                                    ) : (
                                        <BaseSpan className="text-[12px] font-bold text-blue-400 flex items-center gap-1.5">
                                            <Clock size={12} />
                                            {artifact.statusLabel}
                                        </BaseSpan>
                                    )}
                                </BaseDiv>
                            </ProjectDetailsArtifactItem>
                        </div>
                    ))
                ) : (
                    <BaseDiv className="text-sm font-medium text-zinc-500 py-12 text-center border border-dashed border-zinc-800 rounded-lg">
                        Brak wygenerowanych artefaktów dla wybranych kryteriów.
                    </BaseDiv>
                )}
            </BaseDiv>
        </ProjectDetailsContentGroup>
    );
};
