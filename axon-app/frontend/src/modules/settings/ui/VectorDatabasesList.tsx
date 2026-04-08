"use client";

import * as React from "react";
import { useVectorDatabases, useDeleteVectorDatabase } from "../application/useSettings";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { useRouter } from "next/navigation";
import { FilterGroup, ActiveFilter, SortOption } from "@/shared/domain/filters";
import { VectorDatabasesListView } from "./VectorDatabasesListView";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { VectorDatabase } from "@/shared/domain/settings";
import { DisplayVectorDatabase } from "./VectorDatabasesListView.types";

const SORT_OPTIONS: readonly SortOption[] = [
    { id: "name_asc", label: "Name (A-Z)" },
    { id: "name_desc", label: "Name (Z-A)" },
    { id: "type", label: "Type" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
    { label: "Hosting", groupId: "hosting" },
    { label: "Status", groupId: "status" },
];

export const VectorDatabasesList = () => {
    const { data: databases, isLoading } = useVectorDatabases();
    const { mutateAsync: deleteDatabase } = useDeleteVectorDatabase();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    const router = useRouter();

    const [search, setSearch] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name_asc");
    const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
    const [selectedDatabaseId, setSelectedDatabaseId] = React.useState<string | null>(null);
    const [activeFilters, setActiveFilters] = React.useState<ActiveFilter[]>([]);
    const [pendingFilterIds, setPendingFilterIds] = React.useState<string[]>([]);

    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [databaseToDelete, setDatabaseToDelete] = React.useState<{ id: string; name: string } | null>(null);

    const handleApplyFilters = (selectedIds: string[]) => {
        const nextFilters: ActiveFilter[] = [];
        getFilterGroups().forEach(group => {
            group.options.forEach(option => {
                if (selectedIds.includes(option.id)) {
                    nextFilters.push({ id: option.id, label: option.label, category: group.id });
                }
            });
        });
        setActiveFilters(nextFilters);
        setPendingFilterIds(selectedIds);
    };

    const handleToggleFilter = (id: string) => {
        const option = getFilterGroups().flatMap(group => group.options.map(optionItem => ({...optionItem, groupId: group.id}))).find(optionItem => optionItem.id === id);
        if (option) {
            if (activeFilters.some(filter => filter.id === id)) {
                setActiveFilters(previousFilters => previousFilters.filter(filter => filter.id !== id));
                setPendingFilterIds(previousIds => previousIds.filter(pendingId => pendingId !== id));
            } else {
                setActiveFilters([...activeFilters, { id: option.id, label: option.label, category: option.groupId }]);
                setPendingFilterIds([...pendingFilterIds, id]);
            }
        }
    };

    const confirmDelete = (id: string, name: string) => {
        setDatabaseToDelete({ id, name });
        setDeleteModalOpen(true);
    };

    const handleDeleteExecution = () => {
        if (databaseToDelete) {
            deleteWithUndo(databaseToDelete.id, databaseToDelete.name, () => deleteDatabase(databaseToDelete.id));
            setDeleteModalOpen(false);
            setDatabaseToDelete(null);
        }
    };

    const getHostingType = (database: VectorDatabase) => {
        const typeValue = database.vector_database_type.toUpperCase();
        const urlValue = (database.vector_database_connection_url || "").toLowerCase();
        
        // Supabase is Cloud
        if (urlValue.includes("supabase.co")) return "cloud";
        if (typeValue === "PINECONE") return "cloud";
        
        // Local/Manual indicators
        if (urlValue.includes("localhost") || urlValue.includes("127.0.0.1") || urlValue.includes("0.0.0.0")) return "local";
        
        if (typeValue.includes("CHROMA")) return "local";
        if (typeValue.includes("POSTGRES")) return "local";
        
        return "external";
    };

    const getFilterGroups = (): FilterGroup[] => {
        if (!databases) return [];
        const uniqueTypes = Array.from(new Set(databases.map(database => database.vector_database_type))).sort();
        const uniqueStatuses = Array.from(new Set(databases.map(database => database.vector_database_connection_status.toUpperCase()))).sort();
        return [
            {
                id: "hosting",
                title: "Hosting",
                type: "checkbox",
                options: [
                    { id: "cloud", label: "Cloud", isChecked: pendingFilterIds.includes("cloud") },
                    { id: "local", label: "Local", isChecked: pendingFilterIds.includes("local") },
                    { id: "external", label: "External", isChecked: pendingFilterIds.includes("external") },
                ]
            },
            {
                id: "types",
                title: "Database Type",
                type: "checkbox",
                options: uniqueTypes.map(type => ({
                    id: type,
                    label: type.replace(/_/g, " "),
                    isChecked: pendingFilterIds.includes(type)
                }))
            },
            {
                id: "status",
                title: "Status",
                type: "checkbox",
                options: uniqueStatuses.map(status => ({
                    id: status,
                    label: status.charAt(0) + status.slice(1).toLowerCase(),
                    isChecked: pendingFilterIds.includes(status)
                }))
            }
        ];
    };

    const getDisplayItems = (): DisplayVectorDatabase[] => {
        const baseDatabases = databases || [];
        const filteredDatabases = baseDatabases
            .filter(database => !pendingIds.has(database.id))
            .filter(database => {
                const matchesSearch = database.vector_database_name.toLowerCase().includes(search.toLowerCase()) ||
                    database.vector_database_type.toLowerCase().includes(search.toLowerCase());
                if (!matchesSearch) return false;

                const selectedHostingIds = activeFilters.filter(filter => filter.category === "hosting").map(filter => filter.id);
                const selectedTypeIds = activeFilters.filter(filter => filter.category === "types").map(filter => filter.id);
                const selectedStatusIds = activeFilters.filter(filter => filter.category === "status").map(filter => filter.id);

                if (selectedHostingIds.length > 0) {
                    const hostingType = getHostingType(database);
                    if (!selectedHostingIds.includes(hostingType)) return false;
                }
                if (selectedTypeIds.length > 0) {
                    if (!selectedTypeIds.includes(database.vector_database_type)) return false;
                }
                if (selectedStatusIds.length > 0) {
                    if (!selectedStatusIds.includes(database.vector_database_connection_status.toUpperCase())) return false;
                }
                return true;
            });

        const sortedDatabases = [...filteredDatabases].sort((a, b) => {
            switch (sortBy) {
                case "name_asc": return a.vector_database_name.localeCompare(b.vector_database_name);
                case "name_desc": return b.vector_database_name.localeCompare(a.vector_database_name);
                case "type": return a.vector_database_type.localeCompare(b.vector_database_type);
                default: return 0;
            }
        }).map(database => {
            const isConnected = database.vector_database_connection_status.toUpperCase() === "CONNECTED";
            const hostingType = getHostingType(database);
            
            const hostingLabel = {
                cloud: "Cloud",
                local: "Local / Self-Hosted",
                external: "External"
            }[hostingType as "cloud" | "local" | "external"];

            const formattedType = database.vector_database_type.replace(/_/g, " ").toLowerCase();
            const displayType = formattedType.charAt(0).toUpperCase() + formattedType.slice(1);

            return {
                ...database,
                title: displayType,
                description: database.vector_database_name,
                status: isConnected ? "connected" : "disconnected",
                categories: [
                    hostingLabel
                ]
            };
        });

        return sortedDatabases;
    };


    const displayItems = getDisplayItems();
    const selectedDatabase = displayItems.find(db => db.id === selectedDatabaseId) || null;

    return (
        <VectorDatabasesListView
            search={search}
            onSearchChange={setSearch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilters={activeFilters}
            filterGroups={getFilterGroups()}
            quickFilters={QUICK_FILTERS}
            sortOptions={SORT_OPTIONS}
            onToggleFilter={handleToggleFilter}
            onRemoveFilter={(id) => setActiveFilters(previousFilters => previousFilters.filter(filter => filter.id !== id))}
            onClearAllFilters={() => { setActiveFilters([]); setPendingFilterIds([]); }}
            onApplyFilters={handleApplyFilters}
            onSelectionChange={setPendingFilterIds}
            displayItems={displayItems}
            previewCount={displayItems.length}
            isLoading={isLoading}
            onDbClick={(db) => setSelectedDatabaseId(db.id)}
            onEditDb={(id) => router.push(`/settings/knowledge-engine/vectors/${id}`)}
            onAdd={() => router.push("/settings/knowledge-engine/vectors/new")}
            onDeleteDb={confirmDelete}
            selectedDb={selectedDatabase}
            deleteModalOpen={deleteModalOpen}
            onCancelDelete={() => setDeleteModalOpen(false)}
            onConfirmDelete={handleDeleteExecution}
            dbToDeleteName={databaseToDelete?.name}
            onCloseSidePeek={() => setSelectedDatabaseId(null)}
        />
    );
};
