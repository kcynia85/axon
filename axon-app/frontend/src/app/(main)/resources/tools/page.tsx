"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import InternalToolsList from "@/modules/resources/ui/InternalToolsList";
import { Button } from "@/shared/ui/ui/Button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { InternalToolDetailsView } from "@/modules/resources/ui/InternalToolDetailsView";
import { InternalTool } from "@/shared/domain/resources";
import { Pagination } from "@/shared/ui/layout/Pagination";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";

export default function InternalToolsPage() {
    const queryClient = useQueryClient();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [selectedTool, setSelectedTool] = useState<InternalTool | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    const { data: tools = [], isLoading } = useQuery({
        queryKey: ["internal-tools"],
        queryFn: resourcesApi.getInternalTools,
    });

    const filterItems = useCallback((items: readonly InternalTool[], query: string, filterIds: string[]) => {
        return items.filter(t => {
            const matchesSearch = query === "" || 
                t.tool_display_name.toLowerCase().includes(query.toLowerCase()) ||
                t.tool_function_name.toLowerCase().includes(query.toLowerCase()) ||
                t.tool_description.toLowerCase().includes(query.toLowerCase());
            
            if (!matchesSearch) return false;
            if (filterIds.length === 0) return true;

            const matchesCategory = filterIds.some(id => id === t.tool_category);
            const matchesTags = filterIds.some(id => t.tool_keywords?.includes(id));

            // Logic: if category filters are present, must match one. if tags present, must match one.
            const hasCategoryFilters = filterIds.some(id => ["PRIMEVAL", "AI_UTILS", "LOCAL", "SYSTEMS"].includes(id.toUpperCase()));
            const hasTagFilters = filterIds.some(id => !["PRIMEVAL", "AI_UTILS", "LOCAL", "SYSTEMS"].includes(id.toUpperCase()));

            const categoryMatch = !hasCategoryFilters || matchesCategory;
            const tagMatch = !hasTagFilters || matchesTags;

            return categoryMatch && tagMatch;
        });
    }, []);

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
        filterItems,
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

    const filteredTools = useMemo(() => {
        const items = getFilteredItems(tools);
        return [...items].sort((a, b) => {
            if (sortBy === "name-asc") return a.tool_display_name.localeCompare(b.tool_display_name);
            if (sortBy === "name-desc") return b.tool_display_name.localeCompare(a.tool_display_name);
            return 0;
        });
    }, [tools, getFilteredItems, sortBy]);

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

    // Reset pagination when search, sort or filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy, activeFilters]);

    const totalPages = Math.ceil(filteredTools.length / pageSize);
    const paginatedTools = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTools.slice(start, start + pageSize);
    }, [filteredTools, currentPage, pageSize]);

    const handleSelectTool = useCallback((tool: InternalTool) => {
        setSelectedTool(tool);
        setIsSidebarOpen(true);
    }, []);

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
                            pages={Array.from({ length: totalPages }, (_, i) => ({ 
                                number: i + 1, 
                                isActive: currentPage === i + 1 
                            }))}
                            onPageChange={setCurrentPage}
                            canGoBack={currentPage > 1}
                            canGoNext={currentPage < totalPages}
                            onBack={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            onNext={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        />
                    ) : null
                }
            >
                <BrowserLayout
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search internal tools..."
                    actionBar={
                        <ActionBar 
                            resultsCount={getPreviewCount(tools)}
                            filterGroups={filterGroups}
                            activeFilters={activeFilters}
                            onToggleFilter={handleToggleFilter}
                            onApplyFilters={handleApplyFilters}
                            onClearAllFilters={handleClearAll}
                            onPendingFilterIdsChange={setPendingFilterIds}
                            sortOptions={[
                                { id: "name-asc", label: "Name (A-Z)" },
                                { id: "name-desc", label: "Name (Z-A)" }
                            ]}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            viewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />
                    }
                >
                    <InternalToolsList 
                        tools={paginatedTools} 
                        isLoading={isLoading} 
                        onSelect={handleSelectTool}
                    />
                </BrowserLayout>
            </PageLayout>

            {/* Side Peek for Tool Details */}
            <SidePeek
                title={selectedTool?.tool_display_name || selectedTool?.tool_function_name || "Internal Tool Details"}
                open={isSidebarOpen}
                onOpenChange={setIsSidebarOpen}
                maxWidth="sm:max-w-md"
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
