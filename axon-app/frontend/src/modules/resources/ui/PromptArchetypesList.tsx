"use client";

import * as React from "react";
import { usePromptArchetypes, useDeletePromptArchetype } from "../application/usePromptArchetypes";
import { useArchetypeDraft } from "@/modules/studio/features/archetypes/application/useArchetypeDraft";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { PromptArchetypesListView } from "./PromptArchetypesListView";

type PromptArchetypesListProps = {
    readonly archetypes?: any[];
};

export const PromptArchetypesList = ({ archetypes: externalArchetypes }: PromptArchetypesListProps) => {
    const router = useRouter();
    const { data: internalArchetypes, isLoading } = usePromptArchetypes();
    const archetypes = externalArchetypes ?? internalArchetypes;
    
    // Using default workspace/id for draft if not specified
    const { draft, clearDraft } = useArchetypeDraft("global", "new");
    const { mutate: deleteArchetype } = useDeletePromptArchetype();
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();
    const [archetypeToDeleteId, setArchetypeToDeleteId] = React.useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        if (id === "draft") {
            if (window.confirm("Are you sure you want to discard this draft?")) {
                clearDraft();
                toast.success("Szkic archetypu usunięty");
            }
            return;
        }
        
        const archetype = archetypes?.find(a => a.id === id);
        const name = archetype?.archetype_name || "Archetype";
        deleteWithUndo(id, name, () => deleteArchetype(id));
    };

    const handleEditClick = (id: string) => {
        if (id === "draft") {
            router.push("/resources/archetypes/studio");
        } else {
            router.push(`/resources/archetypes/studio/${id}`);
        }
    };

    const confirmDelete = () => {
        if (archetypeToDeleteId) {
            deleteArchetype(archetypeToDeleteId);
            setArchetypeToDeleteId(null);
            toast.success("Archetyp usunięty");
        }
    };

    const cancelDelete = () => {
        setArchetypeToDeleteId(null);
    };

    // Derived state - React Compiler will handle optimizations
    const filteredArchetypes = (archetypes || []).filter(a => !pendingIds.has(a.id));
    const archetypeToDelete = archetypes?.find(a => a.id === archetypeToDeleteId);

    return (
        <PromptArchetypesListView
            archetypes={filteredArchetypes}
            draft={draft}
            isLoading={isLoading}
            onDeleteClick={handleDeleteClick}
            onEditClick={handleEditClick}
            archetypeToDeleteId={archetypeToDeleteId}
            onConfirmDelete={confirmDelete}
            onCancelDelete={cancelDelete}
            archetypeToDeleteName={archetypeToDelete?.archetype_name}
        />
    );
};
