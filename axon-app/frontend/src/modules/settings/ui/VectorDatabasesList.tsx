"use client";

import * as React from "react";
import { useVectorDatabases, useDeleteVectorDatabase } from "../application/useSettings";
import { Database, Trash2 } from "lucide-react";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { VectorDatabaseSidePeek } from "./VectorDatabaseSidePeek";
import { useRouter } from "next/navigation";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";

const SORT_OPTIONS: readonly SortOption[] = [
    { id: "name_asc", label: "Name (A-Z)" },
    { id: "name_desc", label: "Name (Z-A)" },
    { id: "type", label: "Type" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
    { label: "Hosting", groupId: "hosting" },
    { label: "Status", groupId: "status" },
];

const STATIC_HOSTING = [
    { id: "cloud", label: "Cloud" },
    { id: "self-hosted", label: "Self-Hosted" },
];

export const VectorDatabasesList = () => {
    const { data: dbs, isLoading } = useVectorDatabases();
    const { mutateAsync: deleteDb } = useDeleteVectorDatabase();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    const router = useRouter();

    const [search, setSearch] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name_asc");
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [selectedDb, setSelectedDb] = React.useState<any | null>(null);
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = React.useState<string[]>([]);

    // Deletion Modal State
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [dbToDelete, setDbToDelete] = React.useState<{ id: string; name: string } | null>(null);

    const filterGroups = React.useMemo(() => {
        if (!dbs) return [];
        
        const types = Array.from(new Set(dbs.map(db => db.vector_database_type))).sort();
        const statuses = Array.from(new Set(dbs.map(db => db.vector_database_connection_status.toUpperCase()))).sort();
        
        const groups: FilterGroup[] = [
            {
                id: "hosting",
                title: "Hosting",
                type: "checkbox",
                options: STATIC_HOSTING.map(h => ({
                    id: h.id,
                    label: h.label,
                    isChecked: pendingFilterIds.includes(h.id)
                }))
            },
            {
                id: "types",
                title: "Database Type",
                type: "checkbox",
                options: types.map(t => ({
                    id: t,
                    label: t,
                    isChecked: pendingFilterIds.includes(t)
                }))
            },
            {
                id: "status",
                title: "Status",
                type: "checkbox",
                options: statuses.map(s => ({
                    id: s,
                    label: s,
                    isChecked: pendingFilterIds.includes(s)
                }))
            }
        ];
        return groups;
    }, [dbs, pendingFilterIds]);

    const getHostingType = (db: any) => {
        const type = db.vector_database_type.toUpperCase();
        const url = (db.vector_database_connection_url || "").toLowerCase();
        
        if (type === "PINECONE") return "cloud";
        if (url.includes("self-hosted") || url.includes("localhost") || url.includes("127.0.0.1")) return "self-hosted";
        
        // Default heuristics
        if (type.includes("CHROMA")) return "self-hosted";
        if (type.includes("POSTGRES")) return "self-hosted";
        
        return "cloud";
    };

    const filteredDbs = React.useMemo(() => {
        const baseDbs = dbs || [];

        const filtered = baseDbs
            .filter(db => !pendingIds.has(db.id))
            .filter(db => {
                // Search
                const matchesSearch = db.vector_database_name.toLowerCase().includes(search.toLowerCase()) ||
                    db.vector_database_type.toLowerCase().includes(search.toLowerCase());
                if (!matchesSearch) return false;

                // Filters
                const selectedHostingIds = activeFilters.filter(f => f.category === "hosting").map(f => f.id);
                const selectedTypeIds = activeFilters.filter(f => f.category === "types").map(f => f.id);
                const selectedStatusIds = activeFilters.filter(f => f.category === "status").map(f => f.id);

                if (selectedHostingIds.length > 0) {
                    const hostType = getHostingType(db);
                    if (!selectedHostingIds.includes(hostType)) return false;
                }

                if (selectedTypeIds.length > 0) {
                    if (!selectedTypeIds.includes(db.vector_database_type)) return false;
                }

                if (selectedStatusIds.length > 0) {
                    if (!selectedStatusIds.includes(db.vector_database_connection_status.toUpperCase())) return false;
                }

                return true;
            });

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case "name_asc":
                    return a.vector_database_name.localeCompare(b.vector_database_name);
                case "name_desc":
                    return b.vector_database_name.localeCompare(a.vector_database_name);
                case "type":
                    return a.vector_database_type.localeCompare(b.vector_database_type);
                default:
                    return 0;
            }
        });
    }, [dbs, search, sortBy, pendingIds, activeFilters]);

    const previewCount = React.useMemo(() => {
        const baseDbs = dbs || [];
        return baseDbs.filter(db => {
            if (pendingIds.has(db.id)) return false;
            
            const matchesSearch = db.vector_database_name.toLowerCase().includes(search.toLowerCase()) ||
                db.vector_database_type.toLowerCase().includes(search.toLowerCase());
            if (!matchesSearch) return false;

            const selectedHostingIds = pendingFilterIds.filter(id => STATIC_HOSTING.some(h => h.id === id));
            const selectedTypeIds = pendingFilterIds.filter(id => filterGroups.find(g => g.id === "types")?.options.some(o => o.id === id));
            const selectedStatusIds = pendingFilterIds.filter(id => filterGroups.find(g => g.id === "status")?.options.some(o => o.id === id));

            if (selectedHostingIds.length > 0) {
                const hostType = getHostingType(db);
                if (!selectedHostingIds.includes(hostType)) return false;
            }

            if (selectedTypeIds.length > 0) {
                if (!selectedTypeIds.includes(db.vector_database_type)) return false;
            }

            if (selectedStatusIds.length > 0) {
                if (!selectedStatusIds.includes(db.vector_database_connection_status.toUpperCase())) return false;
            }

            return true;
        }).length;
    }, [dbs, search, pendingFilterIds, pendingIds, filterGroups]);

    const handleApplyFilters = (selectedIds: string[]) => {
        const nextFilters: ActiveFilter[] = [];
        filterGroups.forEach(group => {
            group.options.forEach(opt => {
                if (selectedIds.includes(opt.id)) {
                    nextFilters.push({ id: opt.id, label: opt.label, category: group.id });
                }
            });
        });
        setActiveFilters(nextFilters);
        setPendingFilterIds(selectedIds);
    };

    const handleSelectionChange = (selectedIds: string[]) => {
        setPendingFilterIds(selectedIds);
    };

    const handleToggleFilter = (id: string) => {
        const option = filterGroups.flatMap(g => g.options.map(o => ({...o, groupId: g.id}))).find(o => o.id === id);
        if (option) {
            if (activeFilters.some(f => f.id === id)) {
                setActiveFilters(prev => prev.filter(f => f.id !== id));
                setPendingFilterIds(prev => prev.filter(pId => pId !== id));
            } else {
                setActiveFilters([...activeFilters, { id: option.id, label: option.label, category: option.groupId }]);
                setPendingFilterIds([...pendingFilterIds, id]);
            }
        }
    };

    const handleRemoveFilter = (id: string) => {
        setActiveFilters(prev => prev.filter(f => f.id !== id));
        setPendingFilterIds(prev => prev.filter(pId => pId !== id));
    };

    const handleClearAll = () => {
        setActiveFilters([]);
        setPendingFilterIds([]);
    };

    const confirmDelete = (id: string, name: string) => {
        setDbToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleDeleteExecution = () => {
        if (dbToDelete) {
            deleteWithUndo(dbToDelete.id, dbToDelete.name, () => deleteDb(dbToDelete.id));
            setDeleteModalOpen(false);
            setDbToDelete(null);
        }
    };

    const displayDbs = filteredDbs.map(db => {
        const isConnected = db.vector_database_connection_status.toUpperCase() === "CONNECTED";
        const hostType = getHostingType(db);
        return {
            ...db,
            title: db.vector_database_name,
            description: db.vector_database_type,
            categories: [
                hostType === "cloud" ? "Cloud" : "Self-Hosted",
                isConnected ? "Connected" : "Disconnected"
            ]
        };
    });

    // Mock data if empty
    const itemsToDisplay = displayDbs.length > 0 || search || activeFilters.length > 0 ? displayDbs : [
        {
            id: "postgres-mock",
            title: "Postgres (pgvector)",
            description: "Postgres_pgvector",
            categories: ["Self-Hosted", "Connected"],
            isMock: true,
            vector_database_name: "Postgres (pgvector)",
            vector_database_type: "Postgres_pgvector",
            vector_database_connection_status: "CONNECTED",
            vector_database_connection_url: "aws-eu-central-1",
            vector_database_collection_name: "axon_knowledge_vectors_1536",
            vector_database_embedding_model_reference: "text-embedding-3-small",
            vector_database_total_vectors: 450200,
            vector_database_size: 45
        },
        {
            id: "chroma-mock",
            title: "ChromaDB",
            description: "ChromaDB",
            categories: ["Self-Hosted", "Connected"],
            isMock: true,
            vector_database_name: "ChromaDB",
            vector_database_type: "ChromaDB",
            vector_database_connection_status: "CONNECTED",
            vector_database_connection_url: "self-hosted",
            vector_database_collection_name: "local_cache",
            vector_database_embedding_model_reference: "all-MiniLM-L6-v2",
            vector_database_total_vectors: 520,
            vector_database_size: 2
        }
    ];

    return (
        <>
            <BrowserLayout
                searchQuery={search}
                onSearchChange={setSearch}
                searchPlaceholder="Search databases..."
                activeFilters={activeFilters.length > 0 && (
                    <FilterBar
                        activeFilters={activeFilters}
                        onRemove={handleRemoveFilter}
                        onClearAll={handleClearAll}
                    />
                )}
                actionBar={
                    <ActionBar
                        filterGroups={filterGroups}
                        activeFilters={activeFilters}
                        quickFilters={QUICK_FILTERS}
                        onToggleFilter={handleToggleFilter}
                        onApplyFilters={handleApplyFilters}
                        onSelectionChange={handleSelectionChange}
                        onClearAllFilters={handleClearAll}
                        onPendingFilterIdsChange={handleSelectionChange}
                        resultsCount={previewCount}
                        sortOptions={SORT_OPTIONS}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                    />
                }
            >
                <ResourceList
                    items={itemsToDisplay}
                    isLoading={isLoading}
                    viewMode={viewMode}
                    renderItem={(db) => (
                        <ResourceCard
                            key={db.id}
                            title={db.title}
                            description={db.description}
                            href="#"
                            icon={Database}
                            categories={db.categories}
                            onClick={() => setSelectedDb(db)}
                            onEdit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/settings/knowledge-engine/vectors/${db.id}`);
                            }}
                            onDelete={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                confirmDelete(db.id, db.title);
                            }}
                        />
                    )}
                />
            </BrowserLayout>

            <VectorDatabaseSidePeek 
                db={selectedDb}
                isOpen={!!selectedDb}
                onClose={() => setSelectedDb(null)}
                onEdit={(db) => router.push(`/settings/knowledge-engine/vectors/${db.id}`)}
                onDelete={(id) => confirmDelete(id, selectedDb?.vector_database_name)}
            />

            <DestructiveDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeleteExecution}
                title="Usuń Bazę"
                resourceName={dbToDelete?.name || "Baza"}
                affectedResources={[]}
            />
        </>
    );
};
