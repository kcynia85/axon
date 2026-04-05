"use client";

import { useState } from "react";
import { useAgents } from "@/modules/agents/infrastructure/useAgents";
import { useCostEstimate } from "@/modules/agents/application/useCostEstimate";

export const useAgentsSection = (workspaceId: string) => {
    const { data: agents, isLoading: isAgentsLoading } = useAgents(workspaceId);
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const { data: costEstimate, isLoading: isCostLoading } = useCostEstimate(selectedAgentId);

    // Derived state - React Compiler handles optimization
    const selectedAgent = agents?.find((agentItem) => agentItem.id === selectedAgentId);

    const handleSelectAgent = (id: string) => {
        setSelectedAgentId(id);
    };

    const handleClosePeek = () => {
        setSelectedAgentId(null);
    };

    return {
        agents,
        isAgentsLoading,
        selectedAgent,
        costEstimate,
        isCostLoading,
        handleSelectAgent,
        handleClosePeek,
    };
};
