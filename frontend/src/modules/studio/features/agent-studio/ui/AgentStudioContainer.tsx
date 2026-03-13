"use client";

import { useAgent } from "@/modules/agents/infrastructure/useAgents";
import { AgentStudio } from "./AgentStudio";

interface AgentStudioContainerProps {
	agentId: string;
}

export const AgentStudioContainer = ({ agentId }: AgentStudioContainerProps) => {
	const { data: agent, isLoading, isError } = useAgent(agentId);

	if (isLoading) {
		return <div className="flex h-screen w-full items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Ładowanie...</div>;
	}

	if (isError || !agent) {
		return <div className="flex h-screen w-full items-center justify-center text-red-500 font-mono text-sm tracking-widest uppercase">Błąd podczas ładowania agenta.</div>;
	}

	return <AgentStudio initialData={agent} agentId={agentId} />;
};
