"use client";

import { useState, useCallback } from "react";
import { useAgents } from "@/modules/agents/infrastructure/useAgents";
import { useCostEstimate } from "@/modules/agents/application/useCostEstimate";

export const useAgentsSection = (workspaceId: string) => {
    const { data: agents, isLoading: isAgentsLoading } = useAgents(workspaceId);
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const { data: costEstimate, isLoading: isCostLoading } = useCostEstimate(selectedAgentId);

    const selectedAgent = agents?.find((agentItem) => agentItem.id === selectedAgentId);

    const handleSelectAgent = useCallback((id: string) => {
        setSelectedAgentId(id);
    }, []);

    const handleClosePeek = useCallback(() => {
        setSelectedAgentId(null);
    }, []);

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
