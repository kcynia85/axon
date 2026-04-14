import * as React from "react";
import { Plus } from "lucide-react";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { Button } from "@/shared/ui/ui/Button";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { CrewProfilePeek } from "./CrewSidePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { getAgentAvatarUrl } from "@/shared/lib/utils";

import { Crew } from "@/shared/domain/workspaces";
import { Agent } from "@/modules/agents/domain/agent.schema";

export type CrewsSectionViewProps = {
    readonly workspaceId: string;
    readonly crews: readonly Crew[] | undefined;
    readonly isCrewsLoading: boolean;
    readonly agents: readonly Agent[] | undefined;
    readonly activeCrew: Crew | null;
    readonly crewToDeleteId: string | null;
    readonly colorName?: string;
    readonly onSelectCrew: (id: string) => void;
    readonly onClosePeek: () => void;
    readonly onDeleteClick: (id: string) => void;
    readonly onConfirmDelete: () => void;
    readonly onCancelDelete: () => void;
    readonly onEditCrew: (id?: string) => void;
    readonly onAddCrew: () => void;
}

export const CrewsSectionView = ({
    workspaceId,
    crews,
    isCrewsLoading,
    agents,
    activeCrew,
    crewToDeleteId,
    colorName = "default",
    onSelectCrew,
    onClosePeek,
    onDeleteClick,
    onConfirmDelete,
    onCancelDelete,
    onEditCrew,
    onAddCrew
}: CrewsSectionViewProps): React.ReactNode => {
    // Derived state - React Compiler handles optimization
    const displayCrews = (crews || []).slice(0, 4);
    const crewToDelete = crews?.find(crew => crew.id === crewToDeleteId);
    const crewToDeleteName = crewToDelete?.crew_name || "Crew";

    // Map agent IDs to their info
    const agentsMap: Record<string, { name: string; visualUrl?: string | null }> = {};
    agents?.forEach(agent => {
        agentsMap[agent.id] = {
            name: agent.agent_role_text || agent.agent_name || "Specialist Agent",
            visualUrl: agent.agent_visual_url
        };
    });

    // Compatibility map for WorkspaceCardHorizontal
    const agentVisualsMap: Record<string, string> = {};
    Object.entries(agentsMap).forEach(([agentId, agentInfo]) => {
        agentVisualsMap[agentId] = getAgentAvatarUrl(agentId, agentInfo.visualUrl);
    });

    if (isCrewsLoading) {
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((index) => (
                    <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {displayCrews.map((crew) => (
                    <WorkspaceCardHorizontal 
                        key={crew.id}
                        variant="crew"
                        title={crew.crew_name}
                        description={crew.crew_description}
                        href="#"
                        tags={crew.crew_keywords}
                        resourceId={crew.id}
                        onEdit={() => onEditCrew(crew.id)}
                        onClick={() => onSelectCrew(crew.id)}
                        onDelete={onDeleteClick}
                        colorName={colorName}
                        agentIds={crew.agent_member_ids}
                        agentVisualsMap={agentVisualsMap}
                    />
                ))}

                {(!crews || crews.length === 0) && (
                    <Card className="border-dashed h-40 flex flex-col items-center justify-center px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5 col-span-full gap-4">
                        <span>No crews assembled. Strategy requires team effort.</span>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={onAddCrew}
                            className="gap-2 font-semibold"
                        >
                            <Plus className="w-4 h-4" /> Add Crew
                        </Button>
                    </Card>
                )}
            </div>

            <CrewProfilePeek 
                crew={activeCrew}
                isOpen={!!activeCrew}
                onClose={onClosePeek}
                agentsMap={agentsMap}
                onDelete={onDeleteClick}
                onEdit={() => onEditCrew(activeCrew?.id === "draft" ? undefined : activeCrew?.id)}
            />

            <DestructiveDeleteModal
                isOpen={!!crewToDeleteId}
                onClose={onCancelDelete}
                onConfirm={onConfirmDelete}
                title="Delete Crew"
                resourceName={crewToDeleteName}
                affectedResources={[]}
            />
        </>
    );
};
