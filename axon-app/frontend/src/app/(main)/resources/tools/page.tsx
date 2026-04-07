"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import InternalToolsList from "@/modules/resources/ui/InternalToolsList";
import { Button } from "@/shared/ui/ui/Button";
import { RefreshCw, Terminal } from "lucide-react";
import { toast } from "sonner";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { InternalToolDetailsView } from "@/modules/resources/ui/InternalToolDetailsView";
import { InternalTool } from "@/shared/domain/resources";
import { Pagination } from "@/shared/ui/layout/Pagination";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";

/**
 * InternalToolsPage: Management interface for internal functional skills.
 * Standard: Pure View pattern, Zero manual memoization.
 */
export default function InternalToolsPage() {
    const queryClient = useQueryClient();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedTool, setSelectedTool] = useState<InternalTool | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    const { data: internalTools = [], isLoading } = useQuery({
        queryKey: ["internal-tools"],
        queryFn: resourcesApi.getInternalTools,
    });

    const filterItemsFunction = (itemsToFilter: readonly InternalTool[], query: string, filterIds: string[]) => {
        return itemsToFilter.filter(toolItem => {
            const matchesSearch = query === "" || 
                toolItem.tool_display_name.toLowerCase().includes(query.toLowerCase()) ||
                toolItem.tool_function_name.toLowerCase().includes(query.toLowerCase()) ||
                toolItem.tool_description.toLowerCase().includes(query.toLowerCase());
            
            if (!matchesSearch) return false;
            if (filterIds.length === 0) return true;

            const matchesCategory = filterIds.some(id => id === toolItem.tool_category);
            const matchesTags = filterIds.some(id => toolItem.tool_keywords?.includes(id));

            // Logic: if category filters are present, must match one. if tags present, must match one.
            const hasCategoryFilters = filterIds.some(id => ["PRIMEVAL", "AI_UTILS", "LOCAL", "SYSTEMS"].includes(id.toUpperCase()));
            const hasTagFilters = filterIds.some(id => !["PRIMEVAL", "AI_UTILS", "LOCAL", "SYSTEMS"].includes(id.toUpperCase()));

            const categoryMatch = !hasCategoryFilters || matchesCategory;
            const tagMatch = !hasTagFilters || matchesTags;

            return categoryMatch && tagMatch;
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
        handleApplyFilters,
        handleClearAll,
        getFilteredItems,
        getPreviewCount,
        setPendingFilterIds,
    } = useResourceFilters<InternalTool>({
        filterItems: filterItemsFunction,
        initialSortBy: "name-asc",
        initialFilterGroups: [
            {
                id: "category",
                title: "Category",
                type: "checkbox",
                options: [
                    { id: "AI_Utils", label: "AI Utils", isChecked: false },
                    { id: "Local", label: "Local", isChecked: false },
                    { id: "Primeval", label: "Primeval", isChecked: false },
                    { id: "Systems", label: "Systems", isChecked: false },
                ]
            },
            {
                id: "tags",
                title: "Popular Tags",
                type: "checkbox",
                options: [
                    { id: "finance", label: "Finance", isChecked: false },
                    { id: "utility", label: "Utility", isChecked: false },
                    { id: "math", label: "Math", isChecked: false },
                    { id: "text", label: "Text", isChecked: false },
                    { id: "security", label: "Security", isChecked: false },
                ]
            }
        ]
    });

    // Zero manual optimization - React Compiler handles it
    const filteredTools = getFilteredItems(internalTools).sort((toolA, toolB) => {
        if (sortBy === "name-asc") return toolA.tool_display_name.localeCompare(toolB.tool_display_name);
        if (sortBy === "name-desc") return toolB.tool_display_name.localeCompare(toolA.tool_display_name);
        return 0;
    });

    const { mutate: syncTools, isPending: isSyncing } = useMutation({
        mutationFn: resourcesApi.syncInternalTools,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["internal-tools"] });
            if (data.errors && data.errors.length > 0) {
                toast.warning(`Synced with errors: ${data.updated} updated.`);
            } else {
                toast.success(`Tools synced successfully! Updated: ${data.updated}`);
            }
        },
        onError: () => {
            toast.error("Failed to sync tools");
        }
    });

    const totalPages = Math.ceil(filteredTools.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedTools = filteredTools.slice(startIndex, startIndex + pageSize);

    const handleSelectTool = (tool: InternalTool) => {
        setSelectedTool(tool);
        setIsSidebarOpen(true);
    };

    // Use a composite key to force re-render/reset state if needed, 
    // or simply handle it in setSortBy/setSearchQuery etc.
    const handleSearchWithReset = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handleApplyFiltersWithReset = (selectedIds: string[]) => {
        handleApplyFilters(selectedIds);
        setCurrentPage(1);
    };

    return (
        <div className="w-full">
            <PageLayout
                title="Tools"
                description="Manage and sync your internal Python functions library."
                actions={
                    <Button 
                        variant="action" 
                        size="sm" 
                        onClick={() => syncTools()} 
                        disabled={isSyncing}
                        className="gap-2"
                    >
                        <RefreshCw className={`h-3 w-3 ${isSyncing ? "animate-spin" : ""}`} />
                        {isSyncing ? "Syncing..." : "Sync from Code"}
                    </Button>
                }
                pagination={
                    totalPages > 1 ? (
                        <Pagination 
                            pages={Array.from({ length: totalPages }, (_, index) => ({ 
                                number: index + 1, 
                                isActive: currentPage === index + 1 
                            }))}
                            onPageChange={setCurrentPage}
                            canGoBack={currentPage > 1}
                            canGoNext={currentPage < totalPages}
                            onBack={() => setCurrentPage(previousPage => Math.max(1, previousPage - 1))}
                            onNext={() => setCurrentPage(previousPage => Math.min(totalPages, previousPage + 1))}
                        />
                    ) : null
                }
            >
                <BrowserLayout
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchWithReset}
                    searchPlaceholder="Search internal tools..."
                    actionBar={
                        <ActionBar 
                            resultsCount={getPreviewCount(internalTools)}
                            filterGroups={filterGroups}
                            activeFilters={activeFilters}
                            onToggleFilter={handleToggleFilter}
                            onApplyFilters={handleApplyFiltersWithReset}
                            onClearAllFilters={handleClearAll}
                            onPendingFilterIdsChange={setPendingFilterIds}
                            sortOptions={[
                                { id: "name-asc", label: "Name (A-Z)" },
                                { id: "name-desc", label: "Name (Z-A)" }
                            ]}
                            sortBy={sortBy}
                            onSortChange={(value) => { setSortBy(value); setCurrentPage(1); }}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />
                    }
                >
                    <InternalToolsList 
                        tools={paginatedTools} 
                        isLoading={isLoading} 
                        onSelect={handleSelectTool}
                        viewMode={viewMode}
                    />
                </BrowserLayout>
            </PageLayout>

            {/* Side Peek for Tool Details */}
            <SidePeek
                title={selectedTool?.tool_display_name || selectedTool?.tool_function_name || "Internal Tool Details"}
                open={isSidebarOpen}
                onOpenChange={setIsSidebarOpen}
                maxWidth="sm:max-w-md"
                image={
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-primary" />
                    </div>
                }
            >
                {selectedTool && (
                    <InternalToolDetailsView 
                        tool={selectedTool} 
                        onClose={() => setIsSidebarOpen(false)} 
                    />
                )}
            </SidePeek>
        </div>
    );
}
