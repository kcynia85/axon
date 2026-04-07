"use client";

import { useCrew } from "@/modules/workspaces/application/useCrews";
import { CrewStudioContainer } from "./CrewStudioContainer";
import type { CrewStudioFormData } from "../types/crew-schema";

interface Props {
        workspaceId: string;
        crewId: string;
        availableAgents: { id: string; name: string; subtitle?: string }[];
}

interface CrewMetadata {
        contexts?: { id?: string; name: string; description?: string }[];
        artefacts?: { id?: string; name: string; description?: string }[];
        tasks?: { id?: string; name: string; description?: string }[];
        owner_agent_id?: string | number;
        synthesis_instruction?: string;
}

/**
 * EditCrewStudioContainer: Orchestrates data for crew editing.
 * Standard: 0% useEffect, arrow function.
 */
export const EditCrewStudioContainer = ({ workspaceId, crewId, availableAgents }: Props) => {
        const { data: crew, isLoading, isError } = useCrew(workspaceId, crewId);

        if (isLoading) {
                return <div className="flex h-screen w-full items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Ładowanie...</div>;
        }

        if (isError || !crew) {
                return <div className="flex h-screen w-full items-center justify-center text-red-500 font-mono text-sm tracking-widest uppercase">Błąd podczas ładowania załogi.</div>;
        }

        const metadata = (crew.metadata || {}) as CrewMetadata;

        // Map Crew model back to CrewStudioFormData with robust fallback logic
        const initialData: Partial<CrewStudioFormData> = {
                crew_name: crew.crew_name,
                crew_description: crew.crew_description || "",
                crew_process_type: crew.crew_process_type as "sequential" | "hierarchical" | "parallel",
                crew_keywords: crew.crew_keywords || [],
                availability_workspace: crew.availability_workspace || [],
                contexts: (crew.data_interface?.context || metadata.contexts || []).map((item) => ({
                        ...item,
                        id: item.id || crypto.randomUUID() // Ensure stable IDs for property table
                })),
                artefacts: (crew.data_interface?.artefacts || metadata.artefacts || []).map((item) => ({
                        ...item,
                        id: item.id || crypto.randomUUID()
                })),
                agent_member_ids: (crew.agent_member_ids || []).map(id => String(id)),
                owner_agent_id: String(crew.manager_agent_id || metadata.owner_agent_id || ""),
                synthesis_instruction: metadata.synthesis_instruction || "",
                tasks: (metadata.tasks || []).map((task) => ({
                        ...task,
                        id: task.id || crypto.randomUUID()
                })),
        };
	return (
		<CrewStudioContainer
			key={crew.id}
			workspaceId={workspaceId}
			crewId={crewId}
			availableAgents={availableAgents}
			initialData={initialData}
		/>
	);
};
