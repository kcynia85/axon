import * as React from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { Button } from "@/shared/ui/ui/Button";
import { WorkspaceCard } from "@/shared/ui/complex/WorkspaceCard";
import { AgentProfilePeek } from "./AgentProfilePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { getAgentAvatarUrl } from "@/shared/lib/utils";

export type AgentsSectionViewProps = {
    readonly workspaceId: string;
    readonly agents: any[] | undefined;
    readonly isAgentsLoading: boolean;
    readonly activeAgent: any | null;
    readonly agentToDeleteId: string | null;
    readonly colorName?: string;
    readonly onSelectAgent: (id: string) => void;
    readonly onClosePeek: () => void;
    readonly onDeleteClick: (id: string) => void;
    readonly onConfirmDelete: () => void;
    readonly onCancelDelete: () => void;
    readonly onEditAgent: (id?: string) => void;
    readonly onAddAgent: () => void;
}

export const AgentsSectionView = ({
    workspaceId,
    agents,
    isAgentsLoading,
    activeAgent,
    agentToDeleteId,
    colorName = "default",
    onSelectAgent,
    onClosePeek,
    onDeleteClick,
    onConfirmDelete,
    onCancelDelete,
    onEditAgent,
    onAddAgent
}: AgentsSectionViewProps): React.ReactNode => {
    // Derived state - React Compiler handles optimization
    const displayAgents = (agents || []).slice(0, 4);
    const agentToDelete = agents?.find(a => a.id === agentToDeleteId);
    const agentToDeleteName = agentToDelete?.agent_name || agentToDelete?.agent_role_text || "Agent";

    if (isAgentsLoading) {
        return (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((index) => (
                    <Skeleton key={index} className="aspect-[1694/2528] w-full shadow-sm rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {displayAgents.map((agent) => {
                    const avatarUrl = getAgentAvatarUrl(agent.id, agent.agent_visual_url);

                    return (
                        <WorkspaceCard
                            key={agent.id}
                            variant="agent"
                            title={agent.agent_role_text || agent.agent_name || "Agent Person"}
                            description={agent.agent_goal}
                            href="#"
                            badgeLabel={agent.agent_role_text || "AI Agent"}
                            tags={agent.agent_keywords}
                            resourceId={agent.id}
                            onEdit={() => onEditAgent(agent.id)}
                            onClick={() => onSelectAgent(agent.id)}
                            onDelete={onDeleteClick}
                            className="w-full"
                            colorName={colorName}
                            visualArea={
                                <div className="absolute inset-0 flex items-start justify-center overflow-hidden pt-24">
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

                                    <div className="relative w-full h-full flex justify-center">
                                        <Image
                                            src={avatarUrl}
                                            alt={agent.agent_name || "Agent"}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 252px"
                                            priority
                                            className="object-contain scale-[1.25] origin-bottom transition-all duration-500 group-hover:-translate-y-2"
                                        />
                                    </div>
                                </div>
                            }
                        />
                    );
                })}

                {(!agents || agents.length === 0) && (
                    <Card className="border-dashed h-40 flex flex-col items-center justify-center px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5 w-full col-span-full gap-4">
                        <span>No agents defined yet. Bring in some talent.</span>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={onAddAgent}
                            className="gap-2 font-semibold"
                        >
                            <Plus className="w-4 h-4" /> Add Agent
                        </Button>
                    </Card>
                )}
            </div>

            <AgentProfilePeek 
                agent={activeAgent}
                isOpen={!!activeAgent}
                onClose={onClosePeek}
                onDelete={onDeleteClick}
                onEdit={() => onEditAgent(activeAgent?.id === "draft" ? undefined : activeAgent?.id)}
            />

            <DestructiveDeleteModal
                isOpen={!!agentToDeleteId}
                onClose={onCancelDelete}
                onConfirm={onConfirmDelete}
                title="Delete Agent"
                resourceName={agentToDeleteName}
                affectedResources={[]}
            />
        </>
    );
};
