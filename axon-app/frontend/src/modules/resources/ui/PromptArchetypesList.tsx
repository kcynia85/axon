"use client";

import * as React from "react";
import { usePromptArchetypes, useDeletePromptArchetype } from "../application/usePromptArchetypes";
import { useArchetypeDraft } from "@/modules/studio/features/archetypes/application/useArchetypeDraft";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { Sparkles, Sparkle, Plus } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { toast } from "sonner";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";

type PromptArchetypesListProps = {
    readonly archetypes?: any[];
};

export const PromptArchetypesList = ({ archetypes: externalArchetypes }: PromptArchetypesListProps) => {
    const router = useRouter();
    const { data: internalArchetypes, isLoading } = usePromptArchetypes();
    const archetypes = externalArchetypes ?? internalArchetypes;
    const { draft, clearDraft } = useArchetypeDraft("global", "new");
    const { mutate: deleteArchetype } = useDeletePromptArchetype();
    const { deleteWithUndo } = useDeleteWithUndo();
    const [archetypeToDeleteId, setArchetypeToDeleteId] = React.useState<string | null>(null);

    const handleCreateNew = () => {
        router.push("/resources/archetypes/studio");
    };

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

    const confirmDelete = () => {
        if (archetypeToDeleteId) {
            deleteArchetype(archetypeToDeleteId);
            setArchetypeToDeleteId(null);
            toast.success("Archetyp usunięty");
        }
    };

    if (isLoading) {
        return (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((index) => <Skeleton key={index} className="h-[160px] w-full rounded-xl" />)}
            </div>
        );
    }

    const hasNoArchetypes = (!archetypes || archetypes.length === 0);

    return (
        <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {/* Create New Card */}
                <Link href="/resources/archetypes/studio" className="group block">
                    <Card className="h-[160px] flex flex-col items-center justify-center border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer rounded-xl">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                            <Plus className="w-5 h-5 text-zinc-500 group-hover:text-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-primary transition-colors">
                            Create New Archetype
                        </span>
                    </Card>
                </Link>

                {/* Draft Card */}
                {draft && (
                    <WorkspaceCardHorizontal 
                        isDraft
                        title={draft.name || "New Archetype"}
                        description={draft.description || "Resume designing your archetype identity..."}
                        href="/resources/archetypes/studio"
                        icon={Sparkles}
                        resourceId="draft"
                        onEdit={() => router.push("/resources/archetypes/studio")}
                        onDelete={() => handleDeleteClick("draft")}
                        colorName="default"
                        tags={draft.keywords}
                        useDirectHoverMenu
                    />
                )}

                {archetypes?.map((archetype) => (
                    <WorkspaceCardHorizontal
                        key={archetype.id}
                        title={archetype.archetype_name}
                        description={archetype.archetype_description}
                        href={`/resources/archetypes/studio/${archetype.id}`}
                        icon={Sparkle}
                        resourceId={archetype.id}
                        onEdit={() => router.push(`/resources/archetypes/studio/${archetype.id}`)}
                        onDelete={handleDeleteClick}
                        colorName="default"
                        tags={archetype.archetype_keywords || []}
                        useDirectHoverMenu
                    />
                ))}
                {hasNoArchetypes && !draft && (
                    <Card className="border-dashed h-40 flex flex-col items-center justify-center text-muted-foreground col-span-full bg-muted/5">
                        <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm italic">No prompt archetypes discovered yet.</p>
                        <Button variant="link" className="text-xs" onClick={handleCreateNew}>Create your first archetype</Button>
                    </Card>
                )}
            </div>

            <DestructiveDeleteModal
                isOpen={!!archetypeToDeleteId}
                onClose={() => setArchetypeToDeleteId(null)}
                onConfirm={confirmDelete}
                title="Delete Archetype"
                resourceName={archetypes?.find(a => a.id === archetypeToDeleteId)?.archetype_name || "this archetype"}
                affectedResources={[]}
            />
        </>
    );
};
