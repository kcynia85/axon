import React from "react";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { Sparkles, Sparkle, Plus } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import Link from "next/link";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { PromptArchetypesListViewProps } from "./PromptArchetypesListView.types";

export const PromptArchetypesListView = ({
    archetypes,
    draft,
    isLoading,
    onDeleteClick,
    onEditClick,
    archetypeToDeleteId,
    onConfirmDelete,
    onCancelDelete,
    archetypeToDeleteName,
}: PromptArchetypesListViewProps) => {
    if (isLoading) {
        return (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((index) => <Skeleton key={index} className="h-[160px] w-full rounded-xl" />)}
            </div>
        );
    }

    const hasNoArchetypes = archetypes.length === 0;

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
                        onEdit={() => onEditClick("draft")}
                        onDelete={() => onDeleteClick("draft")}
                        colorName="default"
                        tags={draft.keywords}
                        useDirectHoverMenu
                    />
                )}

                {archetypes.map((archetype) => (
                    <WorkspaceCardHorizontal
                        key={archetype.id}
                        title={archetype.archetype_name}
                        description={archetype.archetype_description}
                        href={`/resources/archetypes/studio/${archetype.id}`}
                        icon={Sparkle}
                        resourceId={archetype.id}
                        onEdit={() => onEditClick(archetype.id)}
                        onDelete={onDeleteClick}
                        colorName="default"
                        tags={archetype.archetype_keywords || []}
                        useDirectHoverMenu
                    />
                ))}
                
                {hasNoArchetypes && !draft && (
                    <Card className="border-dashed h-40 flex flex-col items-center justify-center text-muted-foreground col-span-full bg-muted/5">
                        <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                        <p className="text-sm italic">No prompt archetypes discovered yet.</p>
                        <Link href="/resources/archetypes/studio">
                            <Button variant="link" className="text-xs">Create your first archetype</Button>
                        </Link>
                    </Card>
                )}
            </div>

            <DestructiveDeleteModal
                isOpen={!!archetypeToDeleteId}
                onClose={onCancelDelete}
                onConfirm={onConfirmDelete}
                title="Delete Archetype"
                resourceName={archetypeToDeleteName || "this archetype"}
                affectedResources={[]}
            />
        </>
    );
};
